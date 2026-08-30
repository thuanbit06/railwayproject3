using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class RefundRepository : IRefundRepository
{
    private readonly AppDbContext _db;

    public RefundRepository(AppDbContext db)
    {
        _db = db;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<Refund>> GetAllAsync()
    {
        return await _db.Refunds
            .AsNoTracking()
            .OrderByDescending(r => r.RefundDate)
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<Refund?> GetByIdAsync(int id)
    {
        return await _db.Refunds
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    // =========================================================
    // GET BY TICKET
    // =========================================================

    public async Task<Refund?> GetByTicketIdAsync(int ticketId)
    {
        return await _db.Refunds
            .AsNoTracking()
            .FirstOrDefaultAsync(
                r => r.TicketId == ticketId);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<Refund> CreateAsync(Refund refund)
    {
        ArgumentNullException.ThrowIfNull(refund);

        _db.Refunds.Add(refund);

        await _db.SaveChangesAsync();

        return refund;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(Refund refund)
    {
        ArgumentNullException.ThrowIfNull(refund);

        var existing =
            await _db.Refunds
                .FirstOrDefaultAsync(
                    r => r.Id == refund.Id);

        if (existing == null)
        {
            return false;
        }

        existing.CancellationRuleId =
            refund.CancellationRuleId;

        existing.AmountPaid =
            refund.AmountPaid;

        existing.CancellationFee =
            refund.CancellationFee;

        existing.RefundAmount =
            refund.RefundAmount;

        existing.RefundStatus =
            refund.RefundStatus;

        existing.RefundDate =
            refund.RefundDate;

        await _db.SaveChangesAsync();

        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var item =
            await _db.Refunds
                .FirstOrDefaultAsync(
                    r => r.Id == id);

        if (item == null)
        {
            return false;
        }

        _db.Refunds.Remove(item);

        await _db.SaveChangesAsync();

        return true;
    }
}