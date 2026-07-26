using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Delete
{
    public record DeleteDayRequest
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; init; }
    }
}
