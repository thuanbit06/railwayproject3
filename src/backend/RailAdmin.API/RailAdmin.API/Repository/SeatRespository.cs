using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class SeatRepository : ISeatRepository
{
    private readonly AppDbContext _db;

    public SeatRepository(AppDbContext db)
    {
        _db = db;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<Seat>> GetAllAsync()
    {
        return await _db.Seats
            .AsNoTracking()
            .Include(s => s.Coach)
            .OrderBy(s => s.CoachId)
            .ThenBy(s => s.SeatNo)
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<Seat?> GetByIdAsync(int id)
    {
        if (id <= 0)
            return null;

        return await _db.Seats
            .AsNoTracking()
            .Include(s => s.Coach)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    // =========================================================
    // GET BY COACH
    // =========================================================

    public async Task<IEnumerable<Seat>> GetByCoachIdAsync(int coachId)
    {
        if (coachId <= 0)
            return Enumerable.Empty<Seat>();

        return await _db.Seats
            .AsNoTracking()
            .Include(s => s.Coach)
            .Where(s => s.CoachId == coachId)
            .OrderBy(s => s.SeatNo)
            .ToListAsync();
    }

    // =========================================================
    // CHECK EXISTS
    // =========================================================

    public async Task<bool> SeatExistsAsync(int seatId)
    {
        if (seatId <= 0)
            return false;

        return await _db.Seats
            .AsNoTracking()
            .AnyAsync(s => s.Id == seatId);
    }

    // =========================================================
    // SEAT BELONGS TO TRIP
    // (Seat → Coach → Train → Trip)
    // =========================================================

    public async Task<bool> SeatBelongsToTripAsync(int seatId, string pnr)
    {
        if (seatId <= 0 || string.IsNullOrWhiteSpace(pnr))
            return false;

        pnr = pnr.Trim();

        var booking = await _db.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.PNR == pnr);

        if (booking == null)
            return false;

        var trip = await _db.Trips
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == booking.TripId);

        if (trip == null)
            return false;

        return await _db.Seats
            .AsNoTracking()
            .Include(s => s.Coach)
            .AnyAsync(s =>
                s.Id == seatId &&
                s.Coach != null &&
                s.Coach.TrainId == trip.TrainId);
    }

    // =========================================================
    // SEAT IS ALREADY BOOKED (trong cùng PNR / Trip)
    // =========================================================

    public async Task<bool> SeatIsAlreadyBookedAsync(int seatId, string pnr)
    {
        if (seatId <= 0 || string.IsNullOrWhiteSpace(pnr))
            return false;

        pnr = pnr.Trim();

        // Lấy TripId từ booking hiện tại
        var booking = await _db.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.PNR == pnr);

        if (booking == null)
            return false;

        // Kiểm tra ghế đã được gán cho ticket Confirmed của cùng Trip chưa
        return await _db.Tickets
            .AsNoTracking()
            .Include(t => t.Booking)
            .AnyAsync(t =>
                t.SeatId == seatId &&
                t.Booking != null &&
                t.Booking.TripId == booking.TripId &&
                t.Status == "Confirmed");
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<Seat> AddAsync(Seat seat)
    {
        _db.Seats.Add(seat);
        await _db.SaveChangesAsync();
        return seat;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(Seat seat)
    {
        var existing = await _db.Seats
            .FirstOrDefaultAsync(s => s.Id == seat.Id);

        if (existing == null)
            return false;

        existing.CoachId = seat.CoachId;
        existing.SeatNo = seat.SeatNo;
        existing.BerthType = seat.BerthType;

        await _db.SaveChangesAsync();
        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var seat = await _db.Seats
            .FirstOrDefaultAsync(s => s.Id == id);

        if (seat == null)
            return false;

        // Không cho xóa nếu ghế đang được dùng
        var isInUse = await _db.Tickets
            .AnyAsync(t => t.SeatId == id && t.Status != "Cancelled");

        if (isInUse)
            throw new InvalidOperationException(
                "Cannot delete a seat that is currently assigned to an active ticket.");

        _db.Seats.Remove(seat);
        await _db.SaveChangesAsync();
        return true;
    }
}