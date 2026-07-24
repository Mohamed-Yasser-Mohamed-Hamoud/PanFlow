using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Create
{
    public record CreateHabitResponse
    {
        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; init; }
    }
}
