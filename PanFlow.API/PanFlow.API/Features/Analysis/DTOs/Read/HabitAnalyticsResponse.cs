using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Analysis.DTOs.Read
{
    // إحصائيات عادة واحدة عبر كل الأيام
    public record HabitAnalyticsResponse
    {
        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; set; }

        [Required]
        [JsonPropertyName("habitName")]
        public required string HabitName { get; set; }

        [Required]
        [JsonPropertyName("habitColor")]
        public required string HabitColor { get; set; }

        [Required]
        [JsonPropertyName("completionRate")]
        public required double CompletionRate { get; set; }

        [Required]
        [JsonPropertyName("totalDays")]
        public required int TotalDays { get; set; }

        [Required]
        [JsonPropertyName("completedDays")]
        public required int CompletedDays { get; set; }

        // true لو العادة دي ظهرت في يوم واحد على الأقل (يعني عندها بيانات فعلية)
        // false لو لسه معملتلهاش أي Day خالص، عشان الفرونت يفرق بين
        // "عادة بتفشل فعلاً (0%)" و "عادة لسه ما اتتابعتش أصلاً"
        [Required]
        [JsonPropertyName("hasData")]
        public required bool HasData { get; set; }
    }
}
