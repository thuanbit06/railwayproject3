using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class CancellationRuleRepository : ICancellationRuleRepository
{
    private readonly AppDbContext _db;
    public CancellationRuleRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<CancellationRule>> GetAllAsync()
        => await _db.CancellationRules.AsNoTracking().OrderBy(r => r.HoursBeforeDeparture).ToListAsync();

    public async Task<CancellationRule?> GetByIdAsync(int id)
        => await _db.CancellationRules.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);

    public async Task<CancellationRule> CreateAsync(CancellationRule rule)
    {
        _db.CancellationRules.Add(rule);
        await _db.SaveChangesAsync();
        return rule;
    }

    public async Task<bool> UpdateAsync(CancellationRule rule)
    {
        var existing = await _db.CancellationRules.FirstOrDefaultAsync(r => r.Id == rule.Id);
        if (existing == null) return false;
        existing.HoursBeforeDeparture = rule.HoursBeforeDeparture;
        existing.FeeType = rule.FeeType;
        existing.FeeValue = rule.FeeValue;
        existing.MinFee = rule.MinFee;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.CancellationRules.FirstOrDefaultAsync(r => r.Id == id);
        if (item == null) return false;
        _db.CancellationRules.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}