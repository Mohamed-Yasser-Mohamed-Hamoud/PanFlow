using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Data;
using PanFlow.API.Features.Day.DTOs.AddHabits;
using PanFlow.API.Features.Day.DTOs.Create;
using PanFlow.API.Features.Day.DTOs.Delete;
using PanFlow.API.Features.Day.DTOs.Read;
using PanFlow.API.Features.Day.DTOs.Restore;
using PanFlow.API.Features.Day.DTOs.Update;
using PanFlow.API.Models;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Day.Services
{
    public class DayService : IDayService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public DayService(AppDbContext context, UserManager<User> UserManager)
        {
            _context = context;
            _userManager = UserManager;
        }


        public async Task<GeneralResponseDto<object>> RemoveHabit(RemoveHabitFromDayRequest request)
        {
            var relation = await _context.DayHabits
                .FirstOrDefaultAsync(x =>
                    x.DayId == request.DayId &&
                    x.HabitId == request.HabitId);

            if (relation == null)
            {
                return new()
                {
                    IsSuccess = false,
                    Message = "Habit not found in this day."
                };
            }

            _context.DayHabits.Remove(relation);

            await _context.SaveChangesAsync();

            return new()
            {
                IsSuccess = true,
                Message = "Habit removed from day successfully."
            };
        }

        public async Task<GeneralResponseDto<CreateDayResponse>> Create(CreateDayRequest request, string userId)
        {
            // Check user
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("There is no User Id");
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("User does not exist");
            }

            var dayDate = request.Date ?? DateOnly.FromDateTime(DateTime.Now);

            // Check if day already exists
            var existingDay = await _context.Days.FirstOrDefaultAsync(d =>
                d.UserId == userId &&
                d.DayDate == dayDate &&
                !d.IsDeleted);

            if (existingDay != null)
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("Day already exists for this date");
            }

            // Create empty day
            var day = new Models.Day
            {
                UserId = userId,
                DayDate = dayDate
            };

            await _context.Days.AddAsync(day);

            var row = await _context.SaveChangesAsync();

            if (row == 0)
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("Can't create day");
            }

            var response = new CreateDayResponse
            {
                DayId = day.DayId,
                Date = day.DayDate
            };

            return GeneralResponseDto<CreateDayResponse>.Success("Day created successfully", response);
        }




        public async Task<GeneralResponseDto<ReadDayResponse>> Read(ReadDayRequest request)
        {
            // find day 
            var day = await _context.Days
                .Include(d => d.DayHabits)
                    .ThenInclude(dh => dh.Habit)
                        .ThenInclude(h => h.Aspect)
                .FirstOrDefaultAsync(d => d.DayId == request.DayId);

            if (day == null)
            {
                return GeneralResponseDto<ReadDayResponse>.Failure("can't find day");
            }

            var habits = day.DayHabits
                .OrderBy(dh => dh.Order)
                .Select(dh => new ReadDayHabitResponse
                {
                    DayId = dh.DayId,
                    HabitId = dh.HabitId,
                    HabitName = dh.Habit.HabitName,
                    HabitColor = dh.Habit.Aspect.AspectColor,
                    IsChecked = dh.IsChecked,
                    Order = dh.Order
                }).ToList();

            var completion = habits.Count == 0
                ? 0
                : Math.Round((double)habits.Count(h => h.IsChecked) / habits.Count * 100, 2);

            var responseData = new ReadDayResponse
            {
                DayId = day.DayId,
                Date = day.DayDate,
                Habits = habits,
                CompletionPercentage = completion
            };

            return GeneralResponseDto<ReadDayResponse>.Success("find Day", responseData);
        }




        public async Task<GeneralResponseDto<ReadAllDayResponse>> GetAllDays(string userId)
        {
            // Cheack there is user Id 
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<ReadAllDayResponse>.Failure("there is no User Id");
            }
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<ReadAllDayResponse>.Failure("User Is Not Esixt");
            }

            var days = await _context.Days
                .Where(d => d.UserId == userId && d.IsDeleted == false)
                .Include(d => d.DayHabits)
                .OrderByDescending(d => d.DayDate)
                .ToListAsync();

            var summaries = days.Select(d => new ReadDaySummaryResponse
            {
                DayId = d.DayId,
                Date = d.DayDate,
                TotalHabits = d.DayHabits.Count,
                CompletedHabits = d.DayHabits.Count(dh => dh.IsChecked),
                CompletionPercentage = d.DayHabits.Count == 0
                    ? 0
                    : Math.Round((double)d.DayHabits.Count(dh => dh.IsChecked) / d.DayHabits.Count * 100, 2)
            }).ToList();

            var response = new ReadAllDayResponse { Days = summaries };

            return GeneralResponseDto<ReadAllDayResponse>.Success("Find Days Successfully", response);
        }




        public async Task<GeneralResponseDto<ReadAllDayResponse>> GetDeletedDays(string userId)
        {
            // Cheack there is user Id 
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<ReadAllDayResponse>.Failure("there is no User Id");
            }
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<ReadAllDayResponse>.Failure("User Is Not Esixt");
            }

            var days = await _context.Days
                .Where(d => d.UserId == userId && d.IsDeleted == true)
                .Include(d => d.DayHabits)
                .OrderByDescending(d => d.DayDate)
                .ToListAsync();

            var summaries = days.Select(d => new ReadDaySummaryResponse
            {
                DayId = d.DayId,
                Date = d.DayDate,
                TotalHabits = d.DayHabits.Count,
                CompletedHabits = d.DayHabits.Count(dh => dh.IsChecked),
                CompletionPercentage = d.DayHabits.Count == 0
                    ? 0
                    : Math.Round((double)d.DayHabits.Count(dh => dh.IsChecked) / d.DayHabits.Count * 100, 2)
            }).ToList();

            var response = new ReadAllDayResponse { Days = summaries };

            return GeneralResponseDto<ReadAllDayResponse>.Success("Find Days Successfully", response);
        }




        public async Task<GeneralResponseDto<ReadDayResponse>> GetToday(string userId)
        {
            // Cheack there is user Id 
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<ReadDayResponse>.Failure("there is no User Id");
            }

            var today = DateOnly.FromDateTime(DateTime.Now);

            var day = await _context.Days
                .FirstOrDefaultAsync(d => d.UserId == userId && d.DayDate == today && d.IsDeleted == false);

            // if today's day doesn't exist yet, create it with all current habits
            if (day == null)
            {
                var createResult = await Create(new CreateDayRequest { Date = today }, userId);
                if (!createResult.IsSuccess || createResult.Data == null)
                {
                    return GeneralResponseDto<ReadDayResponse>.Failure(createResult.Message);
                }

                return await Read(new ReadDayRequest { DayId = createResult.Data.DayId });
            }

            return await Read(new ReadDayRequest { DayId = day.DayId });
        }




        public async Task<GeneralResponseDto<object>> UpdateHabitStatus(UpdateDayHabitRequest request)
        {
            // find day habit (Composite Key: HabitId , DayId)
            var dayHabit = await _context.DayHabits.FindAsync(request.HabitId, request.DayId);

            if (dayHabit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit in this day");
            }

            if (dayHabit.IsChecked == request.IsChecked)
            {
                return GeneralResponseDto<object>.Success("No changes detected");
            }

            dayHabit.IsChecked = request.IsChecked;
            await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("Updated successfully");
        }




        public async Task<GeneralResponseDto<object>> Delete(DeleteDayRequest request)
        {
            // find day 
            var day = await _context.Days.FindAsync(request.DayId);

            if (day == null)
            {
                return GeneralResponseDto<object>.Failure("can't find day");
            }
            if (day.IsDeleted)
            {
                return GeneralResponseDto<object>.Success("Day is already deleted");
            }
            day.IsDeleted = true;
            day.DeletedAt = DateTime.UtcNow;
            var row = await _context.SaveChangesAsync();

            return GeneralResponseDto<object>.Success("deleted day successfully");
        }




        public async Task<GeneralResponseDto<object>> DeleteForEver(DeleteDayRequest request)
        {
            // find day 
            var day = await _context.Days
                .Include(d => d.DayHabits)
                .FirstOrDefaultAsync(d => d.DayId == request.DayId);

            if (day == null)
            {
                return GeneralResponseDto<object>.Failure("can't find day");
            }

            _context.DayHabits.RemoveRange(day.DayHabits);
            _context.Days.Remove(day);

            var row = await _context.SaveChangesAsync();

            if (row == 0)
            {
                return GeneralResponseDto<object>.Failure("Can't delete day");
            }

            return GeneralResponseDto<object>.Success("Deleted Forever");
        }


        public async Task<GeneralResponseDto<AddHabitsToDayResponse>> AddHabits(AddHabitsToDayRequest request)
        {
            // Check day
            var day = await _context.Days
                .Include(d => d.DayHabits)
                .FirstOrDefaultAsync(d => d.DayId == request.DayId);

            if (day == null)
            {
                return GeneralResponseDto<AddHabitsToDayResponse>.Failure("Day not found");
            }

            // Get habits
            var habits = await _context.Habits
                .Include(h => h.Aspect)
                .Where(h =>
                    request.HabitIds.Contains(h.HabitId) &&
                    !h.IsDeleted)
                .ToListAsync();

            if (!habits.Any())
            {
                return GeneralResponseDto<AddHabitsToDayResponse>.Failure("No habits found");
            }

            // Next order
            int nextOrder = day.DayHabits.Any()
                ? day.DayHabits.Max(h => h.Order) + 1
                : 0;

            var addedHabits = new List<ReadHabitDayResponse>();

            foreach (var habit in habits)
            {
                // Skip if already exists
                if (day.DayHabits.Any(h => h.HabitId == habit.HabitId))
                    continue;

                var dayHabit = new Models.DayHabit
                {
                    DayId = day.DayId,
                    HabitId = habit.HabitId,
                    IsChecked = false,
                    Order = nextOrder++
                };

                await _context.DayHabits.AddAsync(dayHabit);

                addedHabits.Add(new ReadHabitDayResponse
                {
                    DayId = day.DayId,
                    HabitId = habit.HabitId,
                    HabitName = habit.HabitName,
                    HabitColor = habit.Aspect.AspectColor,
                    IsChecked = false,
                    Order = dayHabit.Order
                });
            }

            await _context.SaveChangesAsync();

            return GeneralResponseDto<AddHabitsToDayResponse>.Success(
                "Habits added successfully",
                new AddHabitsToDayResponse
                {
                    AddedHabits = addedHabits
                });
        }

        public async Task<GeneralResponseDto<object>> Restore(RestoreDayRequest request)
        {
            // find day 
            var day = await _context.Days.FindAsync(request.DayId);

            if (day == null)
            {
                return GeneralResponseDto<object>.Failure("can't find day");
            }
            if (!day.IsDeleted)
            {
                return GeneralResponseDto<object>.Success("Day is already restored");
            }

            day.IsDeleted = false;
            day.DeletedAt = null;
            var row = await _context.SaveChangesAsync();
            if (row == 0)
            {
                return GeneralResponseDto<object>.Failure("can't restore day");
            }
            return GeneralResponseDto<object>.Success("restored day successfully");
        }
    }
}
