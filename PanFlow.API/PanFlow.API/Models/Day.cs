using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PanFlow.API.Models
{
    public class Day
    {
        [Key]
        public string DayId { get; set; } = Guid.NewGuid().ToString();

        public DateOnly DayDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        //Navigation properties
        public ICollection<DayHabit> DayHabits { get; set; }
    }
}
