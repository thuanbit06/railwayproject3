using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class SeatRepository : ISeatRepository
{
    private readonly AppDbContext _db;
    public SeatRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Seat>> GetAllAsync()
        => await _db.Seats
        .AsNoTracking()
        .OrderBy(s => s.CoachId)
        .ThenBy(s => s.SeatNo)
        .ToListAsync();

    public async Task<IEnumerable<Seat>> GetByCoachIdAsync(int coachId)
        => await _db.Seats
        .AsNoTracking()
        .OrderBy(s => s.CoachId)
        .ThenBy(s => s.SeatNo)
        .Where(s => s.CoachId == coachId)
        .ToListAsync();

    public async Task<Seat?> GetByIdAsync(int id)
        => await _db.Seats
        .AsNoTracking()
        .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<Seat> CreateAsync(Seat seat)
    {
        _db.Seats.Add(seat);
        await _db.SaveChangesAsync();
        return seat;
    }

    public async Task<bool> UpdateAsync(Seat seat)
    {
        var existing = await _db.Seats
            .FirstOrDefaultAsync(s => s.Id == seat.Id);
        if (existing == null) return false;
        existing.SeatNo = seat.SeatNo;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.Seats.FirstOrDefaultAsync(s => s.Id == id);
        if (item == null) return false;
        _db.Seats.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsAvailableAsync(int seatId) 
    { 
        return !await _db.Tickets
            .AsNoTracking()
            .AnyAsync(t => t.SeatId == seatId && t.Status == "Confirmed"); 
    }
    public async Task<bool> IsOwnedByTicketAsync(int seatId, int ticketId) 
    {
        return await _db.Tickets
            .AsNoTracking()
            .AnyAsync(t => t.Id == ticketId && t.SeatId == seatId && t.Status == "Confirmed"); 
    }
}