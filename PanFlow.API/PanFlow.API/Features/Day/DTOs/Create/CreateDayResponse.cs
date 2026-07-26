using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Create
{
    public record CreateDayResponse
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; init; }

        [Required]
        [JsonPropertyName("date")]
        public required DateOnly Date { get; init; }
    }
}
