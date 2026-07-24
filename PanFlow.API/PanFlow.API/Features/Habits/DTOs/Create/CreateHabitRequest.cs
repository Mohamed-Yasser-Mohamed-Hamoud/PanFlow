using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Create
{
    public record CreateHabitRequest
    {
        [Required]
        [JsonPropertyName("aspectId")]
        public required string AspectId { get; init; }

        [Required]
        [JsonPropertyName("habitName")]
        public required string HabitName { get; init; }
    }
}
