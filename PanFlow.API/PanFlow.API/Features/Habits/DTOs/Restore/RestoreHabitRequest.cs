using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Restore
{
    public record RestoreHabitRequest
    {
        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; set; }
    }
}
