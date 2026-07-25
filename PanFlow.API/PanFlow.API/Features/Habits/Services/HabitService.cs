using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Data;
using PanFlow.API.Features.Aspects.DTOs.Create;
using PanFlow.API.Features.Aspects.DTOs.Read;
using PanFlow.API.Features.Habits.DTOs.Create;
using PanFlow.API.Features.Habits.DTOs.Delete;
using PanFlow.API.Features.Habits.DTOs.Read;
using PanFlow.API.Features.Habits.DTOs.Restore;
using PanFlow.API.Features.Habits.DTOs.Update;
using PanFlow.API.Models;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Habits.Services
{
    public class HabitService : IHabitService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public HabitService(AppDbContext context , UserManager<User> UserManager)
        {
            _context = context;
            _userManager = UserManager;
        }





        public async Task<GeneralResponseDto<ReadHabitResponse>> Read(ReadHabitRequest request)
        {

            // find habit 
            var habit = await _context.Habits
                .Include(h => h.Aspect)
                .FirstOrDefaultAsync(h => h.HabitId == request.HabitId);
            if (habit == null)
            {
                return GeneralResponseDto<ReadHabitResponse>.Failure("can't find habit");
            }

            // create response 
            var responseData = new ReadHabitResponse
            {
                HabitName = habit.HabitName,
                HabitId = habit.HabitId,
                AspectId = habit.AspectId,
                HabitColor = habit.Aspect.AspectColor
            };

            return GeneralResponseDto<ReadHabitResponse>.Success("find Habit", responseData);
        }




        public async Task<GeneralResponseDto<CreateHabitResponse>> Create(CreateHabitRequest request)
        {
            // is Aspect Exist
            var aspect = await _context.Aspects.FindAsync(request.AspectId);
            if (aspect == null) 
            {
                return  GeneralResponseDto<CreateHabitResponse>.Failure("Can't find Aspect");
            }
            // Create Habit
            var habit = new Habit { 
                HabitName = request.HabitName,
                AspectId = request.AspectId,
            };
            await _context.Habits.AddAsync(habit);
            var row = await _context.SaveChangesAsync();
            if (row == 0) 
            {
                return GeneralResponseDto<CreateHabitResponse>.Failure("Can't Add habit");
            }
            var response = new CreateHabitResponse { HabitId = habit.HabitId };
            return GeneralResponseDto<CreateHabitResponse>.Success("Create Successfully" , response);
        }




        public async Task<GeneralResponseDto<object>> Delete(DeleteHabitRequest request)
        {
            // find habit 
            var habit = await _context.Habits.FindAsync(request.HabitId);

            if (habit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit");
            }
            if (habit.IsDeleted)
            {
                return GeneralResponseDto<object>.Success("Habit is already deleted");
            }
            habit.IsDeleted = true;
            var row = await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("deleted habit successfully");
        }




        public async Task<GeneralResponseDto<object>> DeleteForEver(DeleteHabitRequest request)
        {
            // find habit 
            var habit = await _context.Habits.FindAsync(request.HabitId);

            if (habit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit");
            }

            _context.Habits.Remove(habit);

            var row = await _context.SaveChangesAsync();

            if (row == 0)
            {
                return GeneralResponseDto<object>.Failure("Can't delete habit");
            }

            return GeneralResponseDto<object>.Success("Deleted Forever");
        }


        public async Task<GeneralResponseDto<object>> Restore(RestoreHabitRequest request)
        {
            // find habit 
            var habit = await _context.Habits.FindAsync(request.HabitId);

            if (habit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit");
            }
            if (!habit.IsDeleted)
            {
                return GeneralResponseDto<object>.Success("Habit is already deleted");
            }

            habit.IsDeleted = false;
            var row = await _context.SaveChangesAsync();
            if (row == 0)
            {
                return GeneralResponseDto<object>.Failure("can't delete habit");
            }
            return GeneralResponseDto<object>.Success("deleted habit successfully");
        }

        public async Task<GeneralResponseDto<object>> Update(UpdateHabitRequest request)
        {
            var habit = await _context.Habits.FindAsync(request.HabitId);

            if (habit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit");
            }

            if (
                habit.HabitName == request.HabitName &&
                habit.AspectId == request.AspectId
            )
            {
                return GeneralResponseDto<object>.Success("No changes detected");
            }

            habit.HabitName = request.HabitName;
            habit.AspectId = request.AspectId;

            var row = await _context.SaveChangesAsync();

            if (row == 0)
            {
                return GeneralResponseDto<object>.Failure("Update failed");
            }

            return GeneralResponseDto<object>.Success("Updated successfully");
        }

        public async Task<GeneralResponseDto<ReadAllHabitResponse>> GetAllHabits(string userId)
        {
            // Cheack there is user Id 
            if (string.IsNullOrWhiteSpace(userId)) 
            {
                return GeneralResponseDto<ReadAllHabitResponse>.Failure("there is no User Id");
            }
            var user = await _context.Users.FindAsync(userId);

            if (user == null) {
                return GeneralResponseDto<ReadAllHabitResponse>.Failure("User Is Not Esixt");
            }
            var allHabits = await _context.Habits.Where(h => h.Aspect.UserId == userId && h.IsDeleted == false).Select(habit => new ReadHabitResponse
            {
                HabitName = habit.HabitName,
                HabitId = habit.HabitId,
                AspectId = habit.AspectId,
                HabitColor = habit.Aspect.AspectColor
            }).ToListAsync();
            var response = new ReadAllHabitResponse { Habits = allHabits };

            return GeneralResponseDto<ReadAllHabitResponse>.Success("Find Aspects Successfully",response);
        
        }

        public async Task<GeneralResponseDto<ReadAllHabitResponse>> GetAspectHabits(ReadAspectHabitsRequest request)
        {
            var habits = await _context.Habits
                .Where(h => h.AspectId == request.AspectId && h.IsDeleted == false)
                .Select(habit => new ReadHabitResponse
                {
                    HabitName = habit.HabitName,
                    HabitId = habit.HabitId,
                    AspectId = habit.AspectId,
                    HabitColor = habit.Aspect.AspectColor
                })
                .ToListAsync();
            var response = new ReadAllHabitResponse { Habits = habits };
            return GeneralResponseDto<ReadAllHabitResponse>.Success(" successfully ", response);

        }

        public async Task<GeneralResponseDto<ReadAllHabitResponse>> GetDeletedHabits(string userId)
        {


            // Cheack there is user Id 
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<ReadAllHabitResponse>.Failure("there is no User Id");
            }
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return GeneralResponseDto<ReadAllHabitResponse>.Failure("User Is Not Esixt");
            }
            var allHabits = await _context.Habits.Where(h => h.Aspect.UserId == userId && h.IsDeleted == true).Select(habit => new ReadHabitResponse
            {
                HabitName = habit.HabitName,
                HabitId = habit.HabitId,
                AspectId = habit.AspectId,
                HabitColor = habit.Aspect.AspectColor
            }).ToListAsync();
            var response = new ReadAllHabitResponse { Habits = allHabits };

            return GeneralResponseDto<ReadAllHabitResponse>.Success("Find Aspects Successfully", response);



        }
    }
}
