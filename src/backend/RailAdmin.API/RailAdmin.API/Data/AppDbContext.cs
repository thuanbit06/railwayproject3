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
    public DbSet<Station> Stations => Set<Station>();
    public DbSet<Train> Trains => Set<Train>();
    public DbSet<TrainCoach> TrainCoaches => Set<TrainCoach>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripStop> TripStops => Set<TripStop>();
    public DbSet<FareRule> FareRules => Set<FareRule>();
    public DbSet<CancellationRule> CancellationRules => Set<CancellationRule>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Refund> Refunds => Set<Refund>();
    public DbSet<WaitList> WaitLists => Set<WaitList>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ===== Station =====
        modelBuilder.Entity<Station>()
            .HasIndex(x => x.Code)
            .IsUnique();

        // ===== Train =====
        modelBuilder.Entity<Train>()
            .HasIndex(x => x.TrainNo)
            .IsUnique();

        // ===== TrainCoach =====
        modelBuilder.Entity<TrainCoach>()
            .HasIndex(x => new { x.TrainId, x.CoachNo })
            .IsUnique();

        // ===== Seat =====
        // Một số ghế không được trùng số trong cùng 1 toa
        modelBuilder.Entity<Seat>()
            .HasIndex(x => new { x.CoachId, x.SeatNo })
            .IsUnique();

        // ===== Trip =====
        // Tăng tốc tra cứu "tìm chuyến theo ngày + ga đi + ga đến"
        modelBuilder.Entity<Trip>()
            .HasIndex(x => new { x.JourneyDate, x.FromStationId, x.ToStationId });

        modelBuilder.Entity<Trip>()
            .HasOne(x => x.Train)
            .WithMany()
            .HasForeignKey(x => x.TrainId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Trip>()
            .HasOne(x => x.FromStation)
            .WithMany()
            .HasForeignKey(x => x.FromStationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Trip>()
            .HasOne(x => x.ToStation)
            .WithMany()
            .HasForeignKey(x => x.ToStationId)
            .OnDelete(DeleteBehavior.Restrict);

        // ===== TripStop =====
        modelBuilder.Entity<TripStop>()
            .HasIndex(x => new { x.TripId, x.StopSequence })
            .IsUnique();

        // ===== FareRule =====
        modelBuilder.Entity<FareRule>()
            .HasIndex(x => new { x.SeatClass, x.TrainType });

        // ===== User =====
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        // ===== Booking (PNR là string PK, không auto-generate) =====
        modelBuilder.Entity<Booking>()
            .Property(x => x.PNR)
            .ValueGeneratedNever();

        modelBuilder.Entity<Booking>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(x => x.Trip)
            .WithMany()
            .HasForeignKey(x => x.TripId)
            .OnDelete(DeleteBehavior.Restrict);

        // ===== Ticket =====
        modelBuilder.Entity<Ticket>()
            .HasOne(x => x.Booking)
            .WithMany(b => b.Tickets)
            .HasForeignKey(x => x.PNR)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Ticket>()
            .HasOne(x => x.Seat)
            .WithMany()
            .HasForeignKey(x => x.SeatId)
            .OnDelete(DeleteBehavior.SetNull);

        // Một ghế trên một chuyến chỉ được giữ bởi 1 vé còn hiệu lực
        // (Lọc theo Status ở tầng service; DB chỉ đảm bảo không trùng SeatId
        // trong các vé chưa bị hủy — cân nhắc filtered index nếu dùng SQL Server)

        // ===== Payment =====
        modelBuilder.Entity<Payment>()
            .HasOne(x => x.Booking)
            .WithMany()
            .HasForeignKey(x => x.PNR)
            .OnDelete(DeleteBehavior.Cascade);

        // ===== Refund =====
        modelBuilder.Entity<Refund>()
            .HasOne(x => x.Ticket)
            .WithMany()
            .HasForeignKey(x => x.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Refund>()
            .HasOne(x => x.CancellationRule)
            .WithMany()
            .HasForeignKey(x => x.CancellationRuleId)
            .OnDelete(DeleteBehavior.Restrict);

        // ===== WaitList =====
        modelBuilder.Entity<WaitList>()
            .HasOne(x => x.Trip)
            .WithMany()
            .HasForeignKey(x => x.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WaitList>()
            .HasOne(x => x.Ticket)
            .WithMany()
            .HasForeignKey(x => x.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WaitList>()
            .HasIndex(x => new { x.TripId, x.Position });
    }
}