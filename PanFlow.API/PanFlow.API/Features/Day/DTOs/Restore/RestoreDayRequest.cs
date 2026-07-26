using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Restore
{
    public record RestoreDayRequest
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; set; }
    }
}
