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

    public async Task UpdateTotalAmountAsync(string pnr, decimal total)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));

        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.PNR == pnr.Trim());

        if (booking == null)
            throw new KeyNotFoundException(
                $"Booking with PNR '{pnr}' was not found.");

        booking.TotalAmount = total;

        await _db.SaveChangesAsync();
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

    public async Task<bool> ExistsByPNRAsync(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return false;

        return await _db.Bookings
            .AnyAsync(b => b.PNR == pnr.Trim());
    }

    public async Task<bool> CancelAsync(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return false;

        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.PNR == pnr.Trim());

        if (booking == null)
            return false;

        if (booking.BookingStatus == BookingStatus.Cancelled)
            return true;

        booking.BookingStatus = BookingStatus.Cancelled;
        booking.TotalAmount = 0;

        await _db.SaveChangesAsync();

        return true;
    }
}