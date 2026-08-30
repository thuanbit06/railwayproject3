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
            .OrderBy(s => s.CoachId)
            .ThenBy(s => s.SeatNo)
            .ToListAsync();
    }

    // =========================================================
    // GET BY COACH
    // =========================================================

    public async Task<IEnumerable<Seat>> GetByCoachIdAsync(
        int coachId)
    {
        return await _db.Seats
            .AsNoTracking()
            .Where(s => s.CoachId == coachId)
            .OrderBy(s => s.SeatNo)
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<Seat?> GetByIdAsync(int id)
    {
        return await _db.Seats
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    // =========================================================
    // CHECK COACH
    // =========================================================

    public async Task<bool> CoachExistsAsync(int coachId)
    {
        return await _db.TrainCoaches
            .AnyAsync(c => c.Id == coachId);
    }

    // =========================================================
    // CHECK SEAT NUMBER
    // =========================================================

    public async Task<bool> SeatNoExistsAsync(
        int coachId,
        string seatNo,
        int? excludeId = null)
    {
        var query = _db.Seats
            .Where(s =>
                s.CoachId == coachId &&
                s.SeatNo == seatNo);

        if (excludeId.HasValue)
        {
            query = query.Where(
                s => s.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<Seat> CreateAsync(Seat seat)
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
        var existing =
            await _db.Seats
                .FirstOrDefaultAsync(s => s.Id == seat.Id);

        if (existing == null)
            return false;

        existing.SeatNo = seat.SeatNo;

        await _db.SaveChangesAsync();

        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var item =
            await _db.Seats
                .FirstOrDefaultAsync(s => s.Id == id);

        if (item == null)
            return false;

        _db.Seats.Remove(item);

        await _db.SaveChangesAsync();

        return true;
    }
}