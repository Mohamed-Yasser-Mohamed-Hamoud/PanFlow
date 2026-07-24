using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Models;

namespace PanFlow.API.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext>option):base(option)
        {
        }
        public DbSet<Aspect> Aspects { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<DayHabit> DayHabits { get; set; }
    }
}
