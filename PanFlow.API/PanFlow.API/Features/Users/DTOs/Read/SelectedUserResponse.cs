using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Users.DTOs.Read
{
    public record SelectedUserResponse
    {
        [Required]
        [JsonPropertyName("userName")]
        public required string UserName { get; init; }

        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public  required string Email { get; init; }
    }
}