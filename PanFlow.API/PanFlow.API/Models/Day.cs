using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PanFlow.API.Models
{
    public class Day
    {
        [Key]
        public string DayId { get; set; } = Guid.NewGuid().ToString();

        public DateOnly DayDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        // ✅ اتضاف: عشان نضمن إن اليوم بتاع مين حتى لو لسه مفيهوش DayHabits خالص
        // (كان قبل كده بيتحدد بس عن طريق DayHabit -> Habit -> Aspect -> UserId,
        // بس ده كان بينهار لو اليوم اتعمل فاضي بدون عادات)
        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        //Navigation properties
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        //Navigation properties
        public ICollection<DayHabit> DayHabits { get; set; }
    }
}
