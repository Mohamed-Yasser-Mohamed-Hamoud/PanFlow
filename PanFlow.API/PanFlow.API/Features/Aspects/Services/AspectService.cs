using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Data;
using PanFlow.API.Features.Aspects.DTOs.Create;
using PanFlow.API.Features.Aspects.DTOs.Delete;
using PanFlow.API.Features.Aspects.DTOs.Read;
using PanFlow.API.Features.Aspects.DTOs.Restore;
using PanFlow.API.Features.Aspects.DTOs.Update;
using PanFlow.API.Models;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Aspects.Services
{
    public class AspectService : IAspectService
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;

        public AspectService( UserManager<User> userManager , AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }


        public async Task<GeneralResponseDto<CreateAspectResponse>> CreateAspectAsync(CreateAspectRequest request, string userId) 
        {
            // Check there is User Id
            if ( string.IsNullOrEmpty(userId)) 
            {
                return GeneralResponseDto<CreateAspectResponse>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) 
            {
                return GeneralResponseDto<CreateAspectResponse>.Failure("this User Doesn't Exist");
            }

            // Create Aspect
            var aspect = new Aspect
            {
                AspectName = request.AspectName,
                AspectColor = request.AspectColor,
                UserId = userId
            };
            var result = await _context.Aspects.AddAsync(aspect);

            //check aspect Created
            if (request== null) 
            {
                return GeneralResponseDto<CreateAspectResponse>.Failure("Faild to Create Aspect Try Again later");
            }

            // save Changes
            await _context.SaveChangesAsync();

            // return Response
            var responseData = new CreateAspectResponse 
            {
                AspectId = aspect.AspectId
            };

            return GeneralResponseDto<CreateAspectResponse>.Success("Aspect Created Successfully",responseData);
        
        }

        public async Task<GeneralResponseDto<ReadAspectResponse>> ReadAspectAsync(ReadAspectRequest request, string userId)
        {
            // Check there is User Id
            if (string.IsNullOrEmpty(userId))
            {
                return GeneralResponseDto<ReadAspectResponse>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<ReadAspectResponse>.Failure("this User Doesn't Exist");
            }

            // find Aspect
            var aspect = await _context.Aspects.FirstOrDefaultAsync( a => a.AspectId == request.AspectId && a.UserId == userId && a.IsDeleted ==false );
            if (aspect == null) 
            {
                return GeneralResponseDto<ReadAspectResponse>.Failure("don't find Aspect");
            }
            // Create response 
            var responseData = new ReadAspectResponse {
                AspectId=aspect.AspectId,
                AspectName = aspect.AspectName,
                AspectColor = aspect.AspectColor
            };

            if (responseData == null) 
            {
                return GeneralResponseDto<ReadAspectResponse>.Failure("Can't Find the Aspect");
            }
            return GeneralResponseDto<ReadAspectResponse>.Success("Find Aspect Successfully", responseData);
        }


        public async Task<GeneralResponseDto<GetAllAspectsResponse>> GetAllAspectsAsync(string userId) 
        {
            // Check there is User Id
            if (string.IsNullOrEmpty(userId))
            {
                return GeneralResponseDto<GetAllAspectsResponse>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<GetAllAspectsResponse>.Failure("this User Doesn't Exist");
            }

            var AllAspects = await _context.Aspects.Where(a => a.UserId == userId && a.IsDeleted == false).Select(aspect => new ReadAspectResponse
            {
                AspectId = aspect.AspectId,
                AspectColor = aspect.AspectColor,
                AspectName = aspect.AspectName
            }).ToListAsync();

            var response = new GetAllAspectsResponse { Aspects = AllAspects};

            if (response == null) 
            {
                return GeneralResponseDto<GetAllAspectsResponse>.Failure("Can't Get Aspects");
            }

            return GeneralResponseDto<GetAllAspectsResponse>.Success("Get Aspects Successfully", response);
        }



        public async Task<GeneralResponseDto<GetAllAspectsResponse>> GetAllDeletedAspectsAsync(string userId)
        {
            // Check there is User Id
            if (string.IsNullOrEmpty(userId))
            {
                return GeneralResponseDto<GetAllAspectsResponse>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<GetAllAspectsResponse>.Failure("this User Doesn't Exist");
            }

            var AllAspects = await _context.Aspects.Where(a => a.UserId == userId && a.IsDeleted == true).Select(aspect => new ReadAspectResponse
            {
                AspectId = aspect.AspectId,
                AspectColor = aspect.AspectColor,
                AspectName = aspect.AspectName
            }).ToListAsync();

            var response = new GetAllAspectsResponse { Aspects = AllAspects };

            if (response == null)
            {
                return GeneralResponseDto<GetAllAspectsResponse>.Failure("Can't Get Aspects");
            }

            return GeneralResponseDto<GetAllAspectsResponse>.Success("Get Aspects Successfully", response);
        }

        public async Task<GeneralResponseDto<object>> UpdateAspectAsync(UpdateAspectRequest request, string userId)
        {
            // Check there is User Id
            if (string.IsNullOrEmpty(userId))
            {
                return GeneralResponseDto<object>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<object>.Failure("this User Doesn't Exist");
            }

            //Find Aspect
            var Aspect = await _context.Aspects.FirstOrDefaultAsync(a => a.UserId == userId && a.AspectId == request.AspectId);

            if (Aspect == null) 
            {
                return GeneralResponseDto<object>.Failure("Don't Find Aspect");
            }

            // update 
            Aspect.AspectName = request.AspectName;
            Aspect.AspectColor = request.AspectColor;
            var result = await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("Updated Successfully");
        }

        public async Task<GeneralResponseDto<object>> DeleteAspectAsync(DeleteAspectRequest request, string userId)
        {
            // Check there is User Id
            if (string.IsNullOrEmpty(userId))
            {
                return GeneralResponseDto<object>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<object>.Failure("this User Doesn't Exist");
            }

            //Find Aspect
            var Aspect = await _context.Aspects.FirstOrDefaultAsync(a => a.UserId == userId && a.AspectId == request.AspectId);

            if (Aspect == null)
            {
                return GeneralResponseDto<object>.Failure("Don't Find Aspect");
            }

            // delete 
            Aspect.IsDeleted = true;
            var result = await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("Deleted Successfully");
        }

        public async Task<GeneralResponseDto<object>> RestoreAspectAsync(RestoreAspectRequest request, string userId)
        {
            // Check there is User Id
            if (string.IsNullOrEmpty(userId))
            {
                return GeneralResponseDto<object>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<object>.Failure("this User Doesn't Exist");
            }

            //Find Aspect
            var Aspect = await _context.Aspects.FirstOrDefaultAsync(a => a.UserId == userId && a.AspectId == request.AspectId);

            if (Aspect == null)
            {
                return GeneralResponseDto<object>.Failure("Don't Find Aspect");
            }

            // delete 
            Aspect.IsDeleted = false;
            var result = await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("Restored Successfully");

        }



        public async Task<GeneralResponseDto<object>> DeleteAspectForEverAsync(DeleteAspectRequest request, string userId)
        {
            // Check there is User Id
            if (string.IsNullOrEmpty(userId))
            {
                return GeneralResponseDto<object>.Failure("there is no Id");
            }


            // Check User Exist
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<object>.Failure("this User Doesn't Exist");
            }

            //Find Aspect
            var Aspect = await _context.Aspects.FirstOrDefaultAsync(a => a.UserId == userId && a.AspectId == request.AspectId);

            if (Aspect == null)
            {
                return GeneralResponseDto<object>.Failure("Don't Find Aspect");
            }

            // delete 
            _context.Aspects.Remove(Aspect);
            var result = await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("Deleted Forever Successfully");
        }
    }
}
