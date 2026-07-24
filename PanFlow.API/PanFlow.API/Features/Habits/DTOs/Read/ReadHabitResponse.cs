using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Read
{
    public record ReadHabitResponse
    {
        [Required]
        [JsonPropertyName("habitName")]
        public required string HabitName { get; set; }

        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; set; }
    }
}
