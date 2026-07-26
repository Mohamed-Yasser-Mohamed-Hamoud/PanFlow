using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Features.Day.DTOs.Update
{
    // بتستخدم عشان تعلم/تلغي علامة عادة معينة داخل يوم معين (تيك/إلغاء تيك)
    // الاتنين مطلوبين مع بعض لأن DayHabit عنده Composite Key (HabitId, DayId)
    public record UpdateDayHabitRequest
    {
        [Required]
        [JsonPropertyName("dayId")]
        public required string DayId { get; set; }

        [Required]
        [JsonPropertyName("habitId")]
        public required string HabitId { get; set; }

        [Required]
        [JsonPropertyName("isChecked")]
        public required bool IsChecked { get; set; }
    }
}
