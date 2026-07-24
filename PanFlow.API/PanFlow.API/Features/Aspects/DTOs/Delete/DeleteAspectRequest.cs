using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Aspects.DTOs.Delete
{
    public record DeleteAspectRequest
    {
        [Required]
        [JsonPropertyName("aspectId")]
        public  required string AspectId { get; init; }
    }
}