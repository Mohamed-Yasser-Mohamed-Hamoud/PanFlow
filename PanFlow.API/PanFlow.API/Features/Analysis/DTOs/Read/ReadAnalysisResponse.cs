using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Analysis.DTOs.Read
{
    public record ReadAnalysisResponse
    {
        [Required]
        [JsonPropertyName("days")]
        public required List<DayAnalyticsResponse> Days { get; set; }

        [Required]
        [JsonPropertyName("habits")]
        public required List<HabitAnalyticsResponse> Habits { get; set; }
    }
}
