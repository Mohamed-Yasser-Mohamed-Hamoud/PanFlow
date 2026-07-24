using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PanFlow.API.Models
{
    public class Aspect
    {
        //Attributes
        [Key]
        public string AspectId { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string AspectName { get; set; }
        public string AspectColor { get; set; } ="#FFFFFF" ;
        public bool IsDeleted { get; set; } = false;
        [Required]
        public string UserId { get; set; }



        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }
        public ICollection<Habit> Habits { get; set; }

    }

}
