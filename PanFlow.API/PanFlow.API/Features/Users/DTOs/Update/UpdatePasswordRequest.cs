using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Users.DTOs.Update
{
    public record UpdatePasswordRequest
    {
        [Required]
        [DataType(DataType.Password)]
        [JsonPropertyName("currentPassword")]
        public  required string CurrentPassword { get; init; }

        [Required]
        [DataType(DataType.Password)]
        [JsonPropertyName("newPassword")]
        public required string NewPassword { get; init; }
    }
}