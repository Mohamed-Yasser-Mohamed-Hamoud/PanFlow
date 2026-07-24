using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Aspects.DTOs.Create
{
    public record CreateAspectRequest
    {
        [Required]
        [JsonPropertyName("aspectName")]
        public required string AspectName { get; init; }

        [Required]
        [JsonPropertyName("aspectColor")]
        public required string AspectColor { get; init; } = "#ffffff";
    }
}