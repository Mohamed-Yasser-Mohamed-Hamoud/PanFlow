using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Users.DTOs.Delete
{
    public record DeleteUserRequest
    {
        [Required]
        [JsonPropertyName("password")]
        public required string Password { get; init; }
    }
}
