using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Read
{
    // عادة واحدة جوه اليوم مع حالة إنجازها وترتيبها
    public record ReadDayHabitResponse
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; set; }

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
        [JsonPropertyName("isChecked")]
        public required bool IsChecked { get; set; }

        [Required]
        [JsonPropertyName("order")]
        public required int Order { get; set; }
    }
}
