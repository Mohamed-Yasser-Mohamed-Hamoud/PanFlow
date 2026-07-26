using Microsoft.AspNetCore.Identity;

namespace PanFlow.API.Models
{
    public class User : IdentityUser
    {
        public ICollection<Aspect> Aspects { get; set; }
        public ICollection<Day> Days { get; set; } = new List<Day>();
    }
}
