using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class FareRuleRepository : IFareRuleRepository
{
    private readonly AppDbContext _db;

    public FareRuleRepository(AppDbContext db)
    {
        _db = db;
    }

    // =========================================================
    // GET ALL
    // =========================================================
    public async Task<IEnumerable<FareRule>> GetAllAsync()
    {
        return await _db.FareRules
            .AsNoTracking()
            .OrderBy(f => f.TrainType)
            .ThenBy(f => f.SeatClass)
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================
    public async Task<FareRule?> GetByIdAsync(int id)
    {
        return await _db.FareRules
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    // =========================================================
    // GET BY SEAT CLASS + TRAIN TYPE
    // =========================================================
    public async Task<FareRule?> GetByClassAndTrainTypeAsync(
        string seatClass,
        string trainType)
    {
        return await _db.FareRules
            .AsNoTracking()
            .FirstOrDefaultAsync(f =>
                f.SeatClass == seatClass &&
                f.TrainType == trainType);
    }

    // =========================================================
    // CREATE
    // =========================================================
    public async Task<FareRule> CreateAsync(FareRule rule)
    {
        _db.FareRules.Add(rule);

        await _db.SaveChangesAsync();

        return rule;
    }

    // =========================================================
    // UPDATE
    // =========================================================
    public async Task<bool> UpdateAsync(FareRule rule)
    {
        var existing = await _db.FareRules
            .FirstOrDefaultAsync(f => f.Id == rule.Id);

        if (existing == null)
            return false;

        existing.BasePrice = rule.BasePrice;
        existing.IsActive = rule.IsActive;

        await _db.SaveChangesAsync();

        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================
    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.FareRules
            .FirstOrDefaultAsync(f => f.Id == id);

        if (item == null)
            return false;

        _db.FareRules.Remove(item);

        await _db.SaveChangesAsync();

        return true;
    }
}