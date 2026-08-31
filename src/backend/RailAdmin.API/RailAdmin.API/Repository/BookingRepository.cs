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

    // =====================================================
    // GET ALL
    // =====================================================

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _db.Bookings
            .AsNoTracking()
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }

    // =====================================================
    // GET BY PNR
    // =====================================================

    public async Task<Booking?> GetByPNRAsync(string pnr)
    {
        return await _db.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(
                b => b.PNR == pnr);
    }

    // =====================================================
    // GET BY USER
    // =====================================================

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(
        int userId)
    {
        return await _db.Bookings
            .AsNoTracking()
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }

    // =====================================================
    // CREATE
    // =====================================================

    public async Task<Booking> CreateAsync(
        Booking booking)
    {
        _db.Bookings.Add(booking);

        await _db.SaveChangesAsync();

        return booking;
    }

    // =====================================================
    // UPDATE
    // =====================================================

    public async Task<bool> UpdateAsync(Booking booking)
    {
        var existing = await _db.Bookings
            .FirstOrDefaultAsync(b => b.PNR == booking.PNR);

        if (existing == null)
            return false;

        existing.BookingStatus = booking.BookingStatus;

        await _db.SaveChangesAsync();

        return true;
    }
    // =====================================================
    // UPDATE STATUS
    // =====================================================

    public async Task<bool> UpdateStatusAsync(
        string pnr,
        string status)
    {
        var booking =
            await _db.Bookings
                .FirstOrDefaultAsync(
                    b => b.PNR == pnr);

        if (booking == null)
            return false;

        booking.BookingStatus = status;

        await _db.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // UPDATE TOTAL AMOUNT
    // =====================================================

    public async Task<bool> UpdateTotalAmountAsync(
    string pnr,
    decimal totalAmount)
    {
        var existing =
            await _db.Bookings
                .FirstOrDefaultAsync(
                    b => b.PNR == pnr);

        if (existing == null)
        {
            return false;
        }

        existing.TotalAmount = totalAmount;

        return true;
    }

    // =====================================================
    // DELETE
    // =====================================================

    public async Task<bool> DeleteAsync(string pnr)
    {
        var booking =
            await _db.Bookings
                .FirstOrDefaultAsync(
                    b => b.PNR == pnr);

        if (booking == null)
            return false;

        _db.Bookings.Remove(booking);

        await _db.SaveChangesAsync();

        return true;
    }
}