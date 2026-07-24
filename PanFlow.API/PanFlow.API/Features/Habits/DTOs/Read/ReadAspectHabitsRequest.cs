using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Read
{
    public record ReadAspectHabitsRequest
    {
        [Required]
        [JsonPropertyName("aspectId")]
        public required string AspectId { get; init; }
    }
}
