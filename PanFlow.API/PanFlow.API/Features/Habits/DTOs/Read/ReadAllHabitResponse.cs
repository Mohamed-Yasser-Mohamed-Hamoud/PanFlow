using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Habits.DTOs.Read
{
    public record ReadAllHabitResponse
    {
        [Required]
        [JsonPropertyName("habits")]
        public required List<ReadHabitResponse> Habits { get; set; }
    }
}
