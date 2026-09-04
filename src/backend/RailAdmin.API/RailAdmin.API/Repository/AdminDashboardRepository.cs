using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Services.IRepository;

namespace RailAdmin.API.Services.Repository;

public class AdminDashboardRepository : IAdminDashboardRepository
{
    private readonly AppDbContext _context;

    public AdminDashboardRepository(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // TOTAL TRAINS
    // =========================================================

    public async Task<int> GetTotalTrainsAsync()
    {
        return await _context.Trains
            .CountAsync(t => t.IsActive);
    }

    // =========================================================
    // TOTAL RESERVATIONS
    // =========================================================

    public async Task<int> GetTotalReservationsAsync()
    {
        return await _context.Bookings
            .CountAsync();
    }

    // =========================================================
    // TICKETS SOLD
    // =========================================================

    public async Task<int> GetTicketsSoldAsync()
    {
        return await _context.Tickets
            .CountAsync(t => t.Status != "Cancelled");
    }

    // =========================================================
    // TOTAL REVENUE
    // =========================================================

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Tickets
            .Where(t => t.Status != "Cancelled")
            .SumAsync(t => (decimal?)t.Fare) ?? 0m;
    }

    // =========================================================
    // RECENT RESERVATIONS
    // =========================================================

    public async Task<List<Booking>> GetRecentReservationsAsync(int count)
    {
        if (count <= 0)
            count = 5;

        return await _context.Bookings
            .AsNoTracking()
            .Include(b => b.User)
            .Include(b => b.Trip)
                .ThenInclude(t => t!.Train)
            .Include(b => b.Tickets)
            .OrderByDescending(b => b.BookingDate)
            .Take(count)
            .ToListAsync();
    }

    // =========================================================
    // REVENUE OVERVIEW
    // =========================================================

    public async Task<List<(DateTime Date, decimal Revenue)>> GetRevenueOverviewAsync(
        int days)
    {
        if (days <= 0)
            days = 7;

        var fromDate = DateTime.UtcNow.Date.AddDays(-(days - 1));

        var data = await _context.Tickets
            .AsNoTracking()
            .Where(t =>
                t.Status != "Cancelled" &&
                t.Booking != null &&
                t.Booking.BookingDate >= fromDate)
            .GroupBy(t => t.Booking!.BookingDate.Date)
            .Select(g => new
            {
                Date = g.Key,
                Revenue = g.Sum(t => t.Fare)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return data
            .Select(x => (x.Date, x.Revenue))
            .ToList();
    }
}