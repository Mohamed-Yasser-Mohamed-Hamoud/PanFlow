using Microsoft.EntityFrameworkCore;
using PanFlow.API.Data;
using PanFlow.API.Features.Analysis.DTOs.Read;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Analysis.Services
{
    public class AnalysisService : IAnalysisService
    {
        private readonly AppDbContext _context;

        public AnalysisService(AppDbContext context)
        {
            _context = context;
        }




        public async Task<GeneralResponseDto<ReadAnalysisResponse>> GetAnalysis(string userId)
        {
            // Cheack there is user Id 
            if (string.IsNullOrWhiteSpace(userId))
            {
                return GeneralResponseDto<ReadAnalysisResponse>.Failure("there is no User Id");
            }
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return GeneralResponseDto<ReadAnalysisResponse>.Failure("User Is Not Esixt");
            }

            // ── Days ──
            // كل أيام المستخدم (غير المحذوفة) مع الـ DayHabits بتاعتها
            var days = await _context.Days
                .Where(d => d.UserId == userId && d.IsDeleted == false)
                .Include(d => d.DayHabits)
                .OrderBy(d => d.DayDate)
                .ToListAsync();

            var daysAnalytics = days.Select(d => new DayAnalyticsResponse
            {
                DayId = d.DayId,
                Date = d.DayDate,
                TotalHabits = d.DayHabits.Count,
                CompletedHabits = d.DayHabits.Count(dh => dh.IsChecked),
                CompletionPercentage = d.DayHabits.Count == 0
                    ? 0
                    : Math.Round((double)d.DayHabits.Count(dh => dh.IsChecked) / d.DayHabits.Count * 100, 2)
            }).ToList();

            // ── Habits ──
            // كل عادات المستخدم النشطة (من خلال الـ Aspects بتاعته)
            var habits = await _context.Habits
                .Where(h => h.Aspect.UserId == userId && h.IsDeleted == false)
                .Include(h => h.Aspect)
                .ToListAsync();

            var dayIds = days.Select(d => d.DayId).ToList();

            // كل الـ DayHabits اللي بتخص أيام المستخدم دي (مرة واحدة عشان منعملش استعلام لكل عادة)
            var dayHabitsForUser = await _context.DayHabits
                .Where(dh => dayIds.Contains(dh.DayId))
                .ToListAsync();

            var habitsAnalytics = habits.Select(h =>
            {
                var relatedDayHabits = dayHabitsForUser.Where(dh => dh.HabitId == h.HabitId).ToList();

                var totalDays = relatedDayHabits.Count;
                var completedDays = relatedDayHabits.Count(dh => dh.IsChecked);

                return new HabitAnalyticsResponse
                {
                    HabitId = h.HabitId,
                    HabitName = h.HabitName,
                    HabitColor = h.Aspect.AspectColor,
                    TotalDays = totalDays,
                    CompletedDays = completedDays,
                    CompletionRate = totalDays == 0
                        ? 0
                        : Math.Round((double)completedDays / totalDays * 100, 2),
                    HasData = totalDays > 0
                };
            }).ToList();

            var response = new ReadAnalysisResponse
            {
                Days = daysAnalytics,
                Habits = habitsAnalytics
            };

            return GeneralResponseDto<ReadAnalysisResponse>.Success("Analysis fetched successfully", response);
        }
    }
}
