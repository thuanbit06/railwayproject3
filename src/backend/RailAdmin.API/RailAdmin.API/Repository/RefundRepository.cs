using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class RefundRepository : IRefundRepository
{
    private readonly AppDbContext _db;
    public RefundRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Refund>> GetAllAsync()
        => await _db.Refunds.AsNoTracking().OrderByDescending(r => r.RefundDate).ToListAsync();

    public async Task<Refund?> GetByIdAsync(int id)
        => await _db.Refunds.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);

    public async Task<Refund?> GetByTicketIdAsync(int ticketId)
        => await _db.Refunds.AsNoTracking().FirstOrDefaultAsync(r => r.TicketId == ticketId);

    public async Task<Refund> CreateAsync(Refund refund)
    {
        _db.Refunds.Add(refund);
        await _db.SaveChangesAsync();
        return refund;
    }

    public async Task<bool> UpdateAsync(Refund refund)
    {
        var existing = await _db.Refunds.FirstOrDefaultAsync(r => r.Id == refund.Id);
        if (existing == null) return false;
        existing.RefundStatus = refund.RefundStatus;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.Refunds.FirstOrDefaultAsync(r => r.Id == id);
        if (item == null) return false;
        _db.Refunds.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}