using Microsoft.EntityFrameworkCore;

namespace PanFlow.API.Models
{
    [PrimaryKey(nameof(HabitId), nameof(DayId))]
    public class DayHabit
    {
        public string HabitId { get; set; }
        public string DayId { get; set; }
        public bool IsChecked { get; set; } = false;
        public int Order { get; set; } = 0;

        //Navigation properties
        public Day Day { get; set; }
        public Habit Habit { get; set; }
    }
}
