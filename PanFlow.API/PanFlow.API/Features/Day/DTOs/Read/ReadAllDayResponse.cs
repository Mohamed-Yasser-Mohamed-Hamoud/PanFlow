using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Read
{
    public record ReadAllDayResponse
    {
        [Required]
        [JsonPropertyName("days")]
        public required List<ReadDaySummaryResponse> Days { get; set; }
    }
}
