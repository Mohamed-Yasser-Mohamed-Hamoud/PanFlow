using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Update
{
    public record UpdateHabitRequest
    {
        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; set; }

        [Required]
        [JsonPropertyName("aspectId")]
        public required string AspectId { get; set; }


        [Required]
        [JsonPropertyName("habitName")]
        public required string HabitName { get; set; }
    }
}
