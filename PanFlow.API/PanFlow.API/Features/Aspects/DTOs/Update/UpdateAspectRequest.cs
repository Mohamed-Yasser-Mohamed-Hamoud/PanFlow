using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Aspects.DTOs.Update
{
    public record UpdateAspectRequest
    {
        [Required]
        [JsonPropertyName("aspectId")]
        public required string AspectId { get; init; }

        [Required]
        [JsonPropertyName("aspectName")]
        public  required string AspectName { get; init; }

        [Required]
        [JsonPropertyName("aspectColor")]
        public required string AspectColor { get; init; } = "#ffffff";
    }
}