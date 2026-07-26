using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Read
{
    // عادة واحدة جوه اليوم مع حالة إنجازها
    // ملحوظة: HabitDayId اتشالت لأن DayHabit مالهاش PK مستقل
    // الهوية بتاعتها بقت composite: (HabitId + DayId), والـ DayId معروف من الـ ReadDayResponse نفسه
    public record ReadHabitDayResponse
    {
        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; set; }

        [Required]
        [JsonPropertyName("habitName")]
        public required string HabitName { get; set; }

        [Required]
        [JsonPropertyName("habitColor")]
        public required string HabitColor { get; set; }

        [Required]
        [JsonPropertyName("isChecked")]
        public required bool IsChecked { get; set; }
    }
}
