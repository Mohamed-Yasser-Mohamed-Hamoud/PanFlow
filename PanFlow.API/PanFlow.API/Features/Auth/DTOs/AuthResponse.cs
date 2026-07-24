using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Auth.DTOs
{
    public record AuthResponse
    {
        [Required]
        [JsonPropertyName("token")]
        public required string Token { get; init; }
    }
}