using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Create
{
    public record CreateDayRequest
    {
        // اختياري: لو مبعتش تاريخ هيتحسب تاريخ النهارده تلقائي
        [JsonPropertyName("date")]
        public DateOnly? Date { get; init; }
    }
}
