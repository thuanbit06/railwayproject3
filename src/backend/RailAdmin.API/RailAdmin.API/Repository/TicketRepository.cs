using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TicketRepository : ITicketRepository
{
    private readonly AppDbContext _db;
    public TicketRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Ticket>> GetAllAsync()
        => await _db.Tickets.AsNoTracking().ToListAsync();

    public async Task<IEnumerable<Ticket>> GetByPNRAsync(string pnr)
        => await _db.Tickets.AsNoTracking().Where(t => t.PNR == pnr).ToListAsync();

    public async Task<Ticket?> GetByIdAsync(int id)
        => await _db.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Ticket> CreateAsync(Ticket ticket)
    {
        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();
        return ticket;
    }

    public async Task<bool> UpdateAsync(Ticket ticket)
    {
        var existing = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == ticket.Id);
        if (existing == null) return false;
        existing.SeatId = ticket.SeatId;
        existing.Status = ticket.Status;
        existing.CancelReason = ticket.CancelReason;
        if (ticket.Status == "Cancelled" && existing.CancelledAt == null)
            existing.CancelledAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (item == null) return false;
        _db.Tickets.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Ticket?> GetByIdWithBookingAsync(int ticketId)
    {
        return await _db.Tickets
            .AsNoTracking()
            .Include(t => t.Booking)          // giả sử Ticket có navigation property Booking
            .FirstOrDefaultAsync(t => t.Id == ticketId);
    }

    public async Task<bool> CancelAsync(int ticketId, string? cancelReason, DateTime cancelledAt)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);
        if (ticket == null) return false;

        // Chỉ hủy khi vé chưa bị hủy
        if (ticket.Status == "Cancelled") return false;

        ticket.Status = "Cancelled";
        ticket.CancelReason = cancelReason;
        ticket.CancelledAt = cancelledAt;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReleaseSeatAsync(int seatId)
    {
        // Giả sử có entity Seat và property IsAvailable / Status
        var seat = await _db.Seats.FirstOrDefaultAsync(s => s.Id == seatId);
        if (seat == null) return false;                                       
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Ticket?> GetByIdWithBookingAndTripAsync(int id)
    {
        return await _db.Tickets
       .Include(t => t.Booking)
       .ThenInclude(b => b!.Trip)
       .FirstOrDefaultAsync(t => t.Id == id);
    }
}