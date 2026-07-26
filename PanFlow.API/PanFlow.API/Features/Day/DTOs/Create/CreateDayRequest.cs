using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Create
{
    public record CreateDayRequest
    {
        // اختياري: لو مبعتش تاريخ هيتحسب تاريخ النهارده تلقائي
        [JsonPropertyName("date")]
        public DateOnly? Date { get; init; }

        // العادات اللي عايز تضيفها لليوم ده وقت الإنشاء (اختياري)
        // ممكن تيجي فاضية (زي ما بيحصل من GetToday) وتتضاف العادات بعدين
        // عن طريق /addHabitsToDay
        [JsonPropertyName("habitIds")]
        public List<string> HabitIds { get; init; } = new();
    }
}
