using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Aspects.DTOs.Read
{
    public record ReadAspectRequest
    {
        [Required]
        [JsonPropertyName("aspectId")]
        public required string AspectId { get; init; }
    }
}