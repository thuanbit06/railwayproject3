using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Data.Constants;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _db;

    public BookingRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _db.Bookings
            .AsNoTracking()
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }

    public async Task<Booking?> GetByPNRAsync(
        string pnr)
    {
        return await _db.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.PNR == pnr);
    }

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(
        int userId)
    {
        return await _db.Bookings
            .AsNoTracking()
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }

    public async Task<bool> ExistsByPNRAsync(
        string pnr)
    {
        return await _db.Bookings
            .AnyAsync(b => b.PNR == pnr);
    }

    public async Task<Booking> CreateAsync(
        Booking booking)
    {
        _db.Bookings.Add(booking);

        await _db.SaveChangesAsync();

        return booking;
    }

    public async Task<bool> UpdateStatusAsync(
        string pnr,
        string status)
    {
        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.PNR == pnr);

        if (booking == null)
        {
            return false;
        }

        booking.BookingStatus = status;

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CancelAsync(
        string pnr)
    {
        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.PNR == pnr);

        if (booking == null)
        {
            return false;
        }

        booking.BookingStatus = BookingStatus.Cancelled;

        await _db.SaveChangesAsync();

        return true;
    }
}