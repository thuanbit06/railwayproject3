using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _db;
    public PaymentRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Payment>> GetAllAsync()
        => await _db.Payments.AsNoTracking().OrderByDescending(p => p.PaidAt).ToListAsync();

    public async Task<Payment?> GetByIdAsync(int id)
        => await _db.Payments.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Payment?> GetByPNRAsync(
      string pnr)
    {
        return await _db.Payments
            .AsNoTracking()
            .Where(p => p.PNR == pnr)
            .OrderByDescending(p => p.PaidAt)
            .FirstOrDefaultAsync();
    }

    public async Task<Payment> CreateAsync(Payment payment)
    {
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
        return payment;
    }

    public async Task<bool> UpdateAsync(Payment payment)
    {
        var existing = await _db.Payments.FirstOrDefaultAsync(p => p.Id == payment.Id);
        if (existing == null) return false;
        existing.Status = payment.Status;
        existing.TransactionId = payment.TransactionId;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (item == null) return false;
        _db.Payments.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Payment?> GetSuccessfulPaymentByPNRAsync(
        string pnr)
    {
        return await _db.Payments
            .AsNoTracking()
            .Where(p =>
                p.PNR == pnr &&
                p.Status == "PAID")
            .OrderByDescending(p => p.PaidAt)
            .FirstOrDefaultAsync();
    }
}