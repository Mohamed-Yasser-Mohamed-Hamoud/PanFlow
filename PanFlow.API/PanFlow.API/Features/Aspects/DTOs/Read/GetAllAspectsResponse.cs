using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Aspects.DTOs.Read
{
    public record GetAllAspectsResponse
    {
        [Required]
        [JsonPropertyName("aspects")]
        public List<ReadAspectResponse> Aspects { get; init; } = new();
    }
}