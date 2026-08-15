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

    public DbSet<Train> Trains => Set<Train>();
    public DbSet<Station> Stations { get; set; }

    public DbSet<FareRule> FareRules { get; set; }
    public DbSet<Booking> Bookings { get; set; }
}