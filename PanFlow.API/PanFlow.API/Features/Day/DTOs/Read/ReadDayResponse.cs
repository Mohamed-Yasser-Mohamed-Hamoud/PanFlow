using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Read
{
    public record ReadDayResponse
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; set; }

        [Required]
        [JsonPropertyName("date")]
        public required DateOnly Date { get; set; }

        [Required]
        [JsonPropertyName("habits")]
        public required List<ReadHabitDayResponse> Habits { get; set; }

        [Required]
        [JsonPropertyName("completionPercentage")]
        public required double CompletionPercentage { get; set; }
        
        [JsonPropertyName("isDeleted")]
        public bool IsDeleted { get; set; }
    }
}
