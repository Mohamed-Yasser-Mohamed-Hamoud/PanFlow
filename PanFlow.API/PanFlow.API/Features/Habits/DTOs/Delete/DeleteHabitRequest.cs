using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Delete
{
    public record DeleteHabitRequest
    {
        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; init; }
    }
}
