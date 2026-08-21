using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Models;

namespace RailAdmin.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Train> Trains => Set<Train>();
    public DbSet<Station> Stations { get; set; }
    public DbSet<FareRule> FareRules { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<CancellationRule> CancellationRules { get; set; }
    public DbSet<Refund> Refunds { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<ScheduleStop> ScheduleStops { get; set; }
    public DbSet<TrainOperatingDay> TrainOperatingDays { get; set; }
    public DbSet<FoodService> FoodServices { get; set; }
    public DbSet<Passenger> Passengers { get; set; }
    public DbSet<WaitList> WaitLists { get; set; }
    public DbSet<Coach> Coaches { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Seat> Seats { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình TrainOperatingDay
        modelBuilder.Entity<TrainOperatingDay>()
            .HasKey(x => new
            {
                x.TrainID,
                x.DayOfWeek
            });

        modelBuilder.Entity<TrainOperatingDay>()
            .HasOne(x => x.Train)
            .WithMany()
            .HasForeignKey(x => x.TrainID);

        // Cấu hình AuditLog
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("sysutcdatetime()");

            entity.Property(e => e.IsSuccess)
                  .HasDefaultValue(true);
        });
    }
}