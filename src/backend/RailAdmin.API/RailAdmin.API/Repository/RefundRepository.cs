using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs.Request.Refund;
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

    // =========================================================
    // GET BY ID
    // =========================================================

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
        var existing =
            await _db.Refunds
                .FirstOrDefaultAsync(r => r.Id == refund.Id);

        if (existing == null)
        {
            return false;
        }

        ArgumentNullException.ThrowIfNull(refund);


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

        // If you need to persist the reason, set a property here, e.g.:
        // existing.Reason = reason;
        // (only do this if the Refund model actually has such a property)

        await _db.SaveChangesAsync();

        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================

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

    public async Task<bool> UpdateStatusAsync(int id, string status, string reason)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Refund ID must be greater than 0.",
                nameof(id));
        }

        if (string.IsNullOrWhiteSpace(status))
        {
            throw new ArgumentException(
                "Refund status is required.",
                nameof(status));
        }

        var refund = await _db.Refunds
            .FirstOrDefaultAsync(r => r.Id == id);

        if (refund == null)
        {
            return false;
        }

        refund.RefundStatus = status.Trim();
        refund.FailureReason = reason.Trim();

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<Refund?> GetByIdempotencyKeyAsync(
        string idempotencyKey)
    {
        return await _db.Refunds
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.IdempotencyKey == idempotencyKey);
    }
}