using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _db;
    public BookingRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Booking>> GetAllAsync()
        => await _db.Bookings.AsNoTracking().OrderByDescending(b => b.BookingDate).ToListAsync();

    public async Task<Booking?> GetByPNRAsync(string pnr)
        => await _db.Bookings.AsNoTracking().FirstOrDefaultAsync(b => b.PNR == pnr);

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
        => await _db.Bookings.AsNoTracking().Where(b => b.UserId == userId).ToListAsync();

    public async Task<Booking> CreateAsync(Booking booking)
    {
        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();
        return booking;
    }

    public async Task<bool> UpdateAsync(Booking booking)
    {
        var existing = await _db.Bookings.FirstOrDefaultAsync(b => b.PNR == booking.PNR);
        if (existing == null) return false;
        existing.BookingStatus = booking.BookingStatus;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string pnr)
    {
        var item = await _db.Bookings.FirstOrDefaultAsync(b => b.PNR == pnr);
        if (item == null) return false;
        _db.Bookings.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}