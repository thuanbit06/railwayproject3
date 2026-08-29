using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using System.Net.Sockets;

namespace RailAdmin.API.Repository;

public class RefundRepository : IRefundRepository
{
    private readonly AppDbContext _db;

    public RefundRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Refund>> GetAllAsync()
    {
        return await _db.Refunds
            .AsNoTracking()
            .OrderByDescending(r => r.RefundDate)
            .ToListAsync();
    }

    public async Task<Refund?> GetByIdAsync(int id)
    {
        return await _db.Refunds
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Refund?> GetByTicketIdAsync(
        int ticketId)
    {
        return await _db.Refunds
            .AsNoTracking()
            .FirstOrDefaultAsync(
                r => r.TicketId == ticketId);
    }

    public async Task<bool> ExistsForTicketAsync(
        int ticketId)
    {
        return await _db.Refunds
            .AnyAsync(r => r.TicketId == ticketId);
    }

    public async Task<Refund> CreateAsync(
        Refund refund)
    {
        _db.Refunds.Add(refund);

        await _db.SaveChangesAsync();

        return refund;
    }

    public async Task<bool> UpdateStatusAsync(
        int id,
        string status)
    {
        var existing =
            await _db.Refunds
                .FirstOrDefaultAsync(r => r.Id == id);

        if (existing == null)
        {
            return false;
        }

        existing.RefundStatus = status;

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var refund =
            await _db.Refunds
                .FirstOrDefaultAsync(r => r.Id == id);

        if (refund == null)
        {
            return false;
        }

        _db.Refunds.Remove(refund);

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateAsync(Refund refund)
    {
        //var existing = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == ticket.Id);
        //if (existing == null) return false;
        //existing.SeatId = ticket.SeatId;
        //existing.Status = ticket.Status;
        //existing.CancelReason = ticket.CancelReason;
        //if (ticket.Status == "Cancelled" && existing.CancelledAt == null)
        //    existing.CancelledAt = DateTime.UtcNow;
        //await _db.SaveChangesAsync();
        return true;
    }
}