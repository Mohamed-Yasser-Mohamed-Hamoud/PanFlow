using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.AddHabits
{
    public record AddHabitsToDayRequest
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; set; }

        [Required]
        [JsonPropertyName("habitIds")]
        public required List<string> HabitIds { get; set; }
    }
}
