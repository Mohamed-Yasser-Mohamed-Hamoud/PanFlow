using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Models;

namespace PanFlow.API.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> option) : base(option)
        {
        }
        public DbSet<Aspect> Aspects { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<DayHabit> DayHabits { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // كسر الـ Multiple Cascade Paths:
            // فيه مسارين من AspNetUsers لجدول DayHabits:
            //   1) User -> Aspect -> Habit -> DayHabit
            //   2) User -> Day -> DayHabit
            // لو الاتنين Cascade، SQL Server هيرفض ينشئ الـ FK. فبنخلي
            // العلاقة الجديدة (Day -> User) من غير Cascade.
            modelBuilder.Entity<Day>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}