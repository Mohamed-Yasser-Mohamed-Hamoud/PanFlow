using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Data;
using PanFlow.API.Features.Day.DTOs.AddHabits;
using PanFlow.API.Features.Day.DTOs.Create;
using PanFlow.API.Features.Day.DTOs.Read;
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




        public async Task<GeneralResponseDto<CreateDayResponse>> Create(CreateDayRequest request, string userId)
        {
            // Cheack there is user Id
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("there is no User Id");
            }
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("User does not exist");
            }

            var date = request.Date ?? DateOnly.FromDateTime(DateTime.UtcNow);

            // ملكية اليوم بقت مباشرة عن طريق Day.UserId (مش عن طريق DayHabit)
            var existingDay = await _context.Days
                .FirstOrDefaultAsync(d => d.UserId == userId && d.DayDate == date);
            if (existingDay != null)
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("Day already exists for this date");
            }

            // العادات دي اختيارية دلوقتي - المستخدم هو اللي بيحدد أنهي عادات
            // تتضاف لليوم ده، مش كل العادات النشطة عنده
            var habitIds = request.HabitIds?.Distinct().ToList() ?? new List<string>();

            var habits = new List<Models.Habit>();
            if (habitIds.Count > 0)
            {
                habits = await _context.Habits
                    .Include(h => h.Aspect)
                    .Where(h => habitIds.Contains(h.HabitId) && h.Aspect.UserId == userId && h.IsDeleted == false)
                    .ToListAsync();

                // لو فيه Id مش موجود أو مش بتاع المستخدم ده، نرفض العملية كلها
                // بدل ما نتجاهله بصمت
                if (habits.Count != habitIds.Count)
                {
                    return GeneralResponseDto<CreateDayResponse>.Failure("في عادات مش موجودة أو مش بتاعتك ضمن القائمة اللي بعتها");
                }
            }

            var day = new Models.Day
            {
                UserId = userId,
                DayDate = date,
            };

            await _context.Days.AddAsync(day);
            var row = await _context.SaveChangesAsync();
            if (row == 0)
            {
                return GeneralResponseDto<CreateDayResponse>.Failure("Can't create day");
            }

            foreach (var habit in habits)
            {
                await _context.DayHabits.AddAsync(new Models.DayHabit
                {
                    DayId = day.DayId,
                    HabitId = habit.HabitId,
                    IsChecked = false,
                });
            }
            if (habits.Count > 0)
            {
                await _context.SaveChangesAsync();
            }

            var response = new CreateDayResponse { DayId = day.DayId, Date = day.DayDate };
            return GeneralResponseDto<CreateDayResponse>.Success("Day created successfully", response);
        }




        public async Task<GeneralResponseDto<AddHabitsToDayResponse>> AddHabitsToDay(AddHabitsToDayRequest request, string userId)
        {
            if (request.HabitIds == null || request.HabitIds.Count == 0)
            {
                return GeneralResponseDto<AddHabitsToDayResponse>.Failure("لازم تبعت عادة واحدة على الأقل");
            }

            var day = await _context.Days
                .Include(d => d.DayHabits)
                .FirstOrDefaultAsync(d => d.DayId == request.DayId);

            if (day == null)
            {
                return GeneralResponseDto<AddHabitsToDayResponse>.Failure("can't find day");
            }

            // ownership check بسيط ومضمون دلوقتي بفضل Day.UserId
            if (day.UserId != userId)
            {
                return GeneralResponseDto<AddHabitsToDayResponse>.Failure("can't find day");
            }

            var habitIds = request.HabitIds.Distinct().ToList();

            // منع تكرار إضافة عادة موجودة بالفعل في نفس اليوم (composite PK هيرمي exception غير كده)
            var alreadyAdded = day.DayHabits.Select(dh => dh.HabitId).ToHashSet();
            var newHabitIds = habitIds.Where(id => !alreadyAdded.Contains(id)).ToList();

            if (newHabitIds.Count == 0)
            {
                return GeneralResponseDto<AddHabitsToDayResponse>.Failure("كل العادات دي مضافة في اليوم ده بالفعل");
            }

            var habits = await _context.Habits
                .Include(h => h.Aspect)
                .Where(h => newHabitIds.Contains(h.HabitId) && h.Aspect.UserId == userId && h.IsDeleted == false)
                .ToListAsync();

            if (habits.Count != newHabitIds.Count)
            {
                return GeneralResponseDto<AddHabitsToDayResponse>.Failure("في عادات مش موجودة أو مش بتاعتك ضمن القائمة اللي بعتها");
            }

            foreach (var habit in habits)
            {
                await _context.DayHabits.AddAsync(new Models.DayHabit
                {
                    DayId = day.DayId,
                    HabitId = habit.HabitId,
                    IsChecked = false,
                });
            }
            await _context.SaveChangesAsync();

            var addedResponse = habits.Select(h => new ReadHabitDayResponse
            {
                HabitId = h.HabitId,
                HabitName = h.HabitName,
                HabitColor = h.Aspect.AspectColor,
                IsChecked = false
            }).ToList();

            return GeneralResponseDto<AddHabitsToDayResponse>.Success(
                "تمت إضافة العادات بنجاح",
                new AddHabitsToDayResponse { AddedHabits = addedResponse });
        }




        public async Task<GeneralResponseDto<ReadDayResponse>> Read(ReadDayRequest request, string userId)
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

            // ownership check بسيط دلوقتي عن طريق Day.UserId مباشرة
            if (day.UserId != userId)
            {
                return GeneralResponseDto<ReadDayResponse>.Failure("can't find day");
            }

            var habits = day.DayHabits.Select(dh => new ReadHabitDayResponse
            {
                HabitId = dh.HabitId,
                HabitName = dh.Habit.HabitName,
                HabitColor = dh.Habit.Aspect.AspectColor,
                IsChecked = dh.IsChecked
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
                return GeneralResponseDto<ReadAllDayResponse>.Failure("User does not exist");
            }

            var days = await _context.Days
                .Where(d => d.UserId == userId)
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

            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var day = await _context.Days
                .FirstOrDefaultAsync(d => d.UserId == userId && d.DayDate == today);

            // لو مفيش يوم للنهارده، بيتعمل فاضي (من غير عادات)
            // والمستخدم بعدين بيضيف العادات اللي عايزها عن طريق /addHabitsToDay
            if (day == null)
            {
                var createResult = await Create(new CreateDayRequest { Date = today, HabitIds = new List<string>() }, userId);
                if (!createResult.IsSuccess || createResult.Data == null)
                {
                    return GeneralResponseDto<ReadDayResponse>.Failure(createResult.Message);
                }

                return await Read(new ReadDayRequest { DayId = createResult.Data.DayId }, userId);
            }

            return await Read(new ReadDayRequest { DayId = day.DayId }, userId);
        }




        public async Task<GeneralResponseDto<object>> UpdateHabitStatus(UpdateHabitDayRequest request, string userId)
        {
            // find day habit using composite key (HabitId + DayId)
            var dayHabit = await _context.DayHabits
                .Include(dh => dh.Day)
                .FirstOrDefaultAsync(dh => dh.DayId == request.DayId && dh.HabitId == request.HabitId);

            if (dayHabit == null)
            {
                return GeneralResponseDto<object>.Failure("can't find habit in this day");
            }

            // ownership check عن طريق Day.UserId مباشرة
            if (dayHabit.Day.UserId != userId)
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
    }
}
