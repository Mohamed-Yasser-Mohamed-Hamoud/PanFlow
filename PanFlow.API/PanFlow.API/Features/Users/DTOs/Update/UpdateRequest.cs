using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Users.DTOs.Update
{
    public record UpdateRequest
    {
        [JsonPropertyName("email")]
        public string? Email { get; init; } = null;

        [JsonPropertyName("userName")]
        public string? UserName { get; init; } = null;
    }
}