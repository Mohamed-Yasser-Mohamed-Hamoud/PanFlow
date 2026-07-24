using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PanFlow.API.Models
{
    public class Day
    {
        [Key]
        public string DayId { get; set; } = Guid.NewGuid().ToString();

        public DateOnly DayDate { get; set; } = DateOnly.FromDateTime(DateTime.Now) ;




        //Navigation properties
        public ICollection<DayHabit> DayHabits { get; set; }

    }
}
