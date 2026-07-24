using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Aspects.DTOs.Create
{
    public record CreateAspectResponse
    {
        [Required]
        [JsonPropertyName("aspectId")]
        public required string AspectId { get; init; }
    }
}