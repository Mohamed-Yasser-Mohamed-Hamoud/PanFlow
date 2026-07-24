using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PanFlow.API.Models
{
    public class Habit
    {
        //attributes : HabitId, HabitName, IsDeleted, AspectId

        [Key]
        public string HabitId { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public required string HabitName { get; set; }
        public bool IsDeleted { get; set; } = false;
        [Required]
        public required string AspectId { get; set; }



        //Navigation properties
        [ForeignKey("AspectId")]
        public Aspect? Aspect { get; set; }
        public ICollection<DayHabit>? DayHabits { get; set; }
    }
}
