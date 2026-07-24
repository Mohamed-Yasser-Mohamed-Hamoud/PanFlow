using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Auth.DTOs.Login
{
    public record LoginRequest
    {
        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public required string Email { get; init; }

        [Required]
        [DataType(DataType.Password)]
        [JsonPropertyName("password")]
        public required string Password { get; init; }
    }
}