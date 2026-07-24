using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Read
{
    public record ReadHabitRequest
    {
        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; init; }
    }
}
