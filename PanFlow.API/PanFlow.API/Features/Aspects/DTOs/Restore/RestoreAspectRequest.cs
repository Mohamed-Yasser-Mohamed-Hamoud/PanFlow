using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Aspects.DTOs.Restore
{
    public record RestoreAspectRequest
    {
        [Required]
        [JsonPropertyName("aspectId")]
        public required string AspectId { get; init; }
    }
}