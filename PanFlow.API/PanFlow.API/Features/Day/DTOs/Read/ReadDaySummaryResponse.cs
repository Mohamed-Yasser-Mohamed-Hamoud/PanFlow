using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Read
{
    // ملخص يوم واحد يستخدم في شاشة القائمة (List)
    public record ReadDaySummaryResponse
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; set; }

        [Required]
        [JsonPropertyName("date")]
        public required DateOnly Date { get; set; }

        [Required]
        [JsonPropertyName("completionPercentage")]
        public required double CompletionPercentage { get; set; }

        [Required]
        [JsonPropertyName("totalHabits")]
        public required int TotalHabits { get; set; }

        [Required]
        [JsonPropertyName("completedHabits")]
        public required int CompletedHabits { get; set; }
    }
}
