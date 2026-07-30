using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Data;
using PanFlow.API.Features.Aspects.DTOs.Create;
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

        public HabitService(AppDbContext context, UserManager<User> UserManager)
        {
            _context = context;
            _userManager = UserManager;
        }

        public async Task<GeneralResponseDto<ReadHabitResponse>> Read(ReadHabitRequest request, string userId)
        {
            // find habit وتأكد إنه بتاع الـ userId ده
            var habit = await _context.Habits
                .Include(h => h.Aspect)
                .FirstOrDefaultAsync(h => h.HabitId == request.HabitId && h.Aspect.UserId == userId);

            if (habit == null)
            {
                return GeneralResponseDto<ReadHabitResponse>.Failure("can't find habit");
            }

            var responseData = new ReadHabitResponse
            {
                HabitName = habit.HabitName,
                HabitId = habit.HabitId,
                AspectId = habit.AspectId,
                HabitColor = habit.Aspect.AspectColor
            };

            return GeneralResponseDto<ReadHabitResponse>.Success("find Habit", responseData);
        }

        public async Task<GeneralResponseDto<CreateHabitResponse>> Create(CreateHabitRequest request, string userId)
        {
            // تأكد إن الـ Aspect ده بتاع نفس المستخدم
            var aspect = await _context.Aspects
                .FirstOrDefaultAsync(a => a.AspectId == request.AspectId && a.UserId == userId);

            if (aspect == null)
            {
                return GeneralResponseDto<CreateHabitResponse>.Failure("Can't find Aspect");
            }

            var habit = new Habit
            {
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
            return GeneralResponseDto<CreateHabitResponse>.Success("Create Successfully", response);
        }




        public async Task<GeneralResponseDto<object>> Delete(DeleteHabitRequest request, string userId)
        {
            var habit = await _context.Habits
                .Include(h => h.Aspect)
                .FirstOrDefaultAsync(h => h.HabitId == request.HabitId && h.Aspect.UserId == userId);

            if (habit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit");
            }

            //var today = DateOnly.FromDateTime(DateTime.UtcNow);
            //var isUsedToday = await _context.DayHabits
            //    .AnyAsync(dh => dh.HabitId == request.HabitId && dh.Day.DayDate == today && !dh.Day.IsDeleted);

            //if (isUsedToday)
            //{
            //    return GeneralResponseDto<object>.Failure("لا يمكن حذف عادة تم إضافتها لليوم الحالي. قم بإزالتها من اليوم أولاً.");
            //}

            if (habit.IsDeleted)
            {
                return GeneralResponseDto<object>.Success("Habit is already deleted");
            }
            habit.IsDeleted = true;
            await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("deleted habit successfully");
        }




        public async Task<GeneralResponseDto<object>> DeleteForEver(DeleteHabitRequest request, string userId)
        {
            var habit = await _context.Habits
                .Include(h => h.Aspect)
                .FirstOrDefaultAsync(h => h.HabitId == request.HabitId && h.Aspect.UserId == userId);

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

        public async Task<GeneralResponseDto<object>> Restore(RestoreHabitRequest request, string userId)
        {
            var habit = await _context.Habits
                .Include(h => h.Aspect)
                .FirstOrDefaultAsync(h => h.HabitId == request.HabitId && h.Aspect.UserId == userId);

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

        public async Task<GeneralResponseDto<object>> Update(UpdateHabitRequest request, string userId)
        {
            var habit = await _context.Habits
                .Include(h => h.Aspect)
                .FirstOrDefaultAsync(h => h.HabitId == request.HabitId && h.Aspect.UserId == userId);

            if (habit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit");
            }

            // لو هيغيّر الـ Aspect، تأكد إن الـ Aspect الجديد ده كمان بتاع نفس المستخدم
            if (habit.AspectId != request.AspectId)
            {
                var newAspectBelongsToUser = await _context.Aspects
                    .AnyAsync(a => a.AspectId == request.AspectId && a.UserId == userId);

                if (!newAspectBelongsToUser)
                {
                    return GeneralResponseDto<object>.Failure("Can't find Aspect");
                }
            }

            if (habit.HabitName == request.HabitName && habit.AspectId == request.AspectId)
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
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<ReadAllHabitResponse>.Failure("there is no User Id");
            }
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
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

            return GeneralResponseDto<ReadAllHabitResponse>.Success("Find Aspects Successfully", response);
        }

        // ده كان فيه المشكلة كمان: كان بيرجع Habits لأي Aspect من غير تأكد إنه بتاع المستخدم
        public async Task<GeneralResponseDto<ReadAllHabitResponse>> GetAspectHabits(ReadAspectHabitsRequest request, string userId)
        {
            var habits = await _context.Habits
                .Where(h => h.AspectId == request.AspectId && h.IsDeleted == false && h.Aspect.UserId == userId)
                .Select(habit => new ReadHabitResponse
                {
                    HabitName = habit.HabitName,
                    HabitId = habit.HabitId,
                    AspectId = habit.AspectId,
                    HabitColor = habit.Aspect.AspectColor
                })
                .ToListAsync();
            var response = new ReadAllHabitResponse { Habits = habits };
            return GeneralResponseDto<ReadAllHabitResponse>.Success("successfully", response);
        }

        public async Task<GeneralResponseDto<ReadAllHabitResponse>> GetDeletedHabits(string userId)
        {
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