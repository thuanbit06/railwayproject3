using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TrainRepository : ITrainRepository
{
    private readonly AppDbContext _db;
    public TrainRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Train>> GetAllAsync()
        => await _db.Trains.AsNoTracking().OrderBy(t => t.TrainNo).ToListAsync();

    public async Task<Train?> GetByIdAsync(int id)
        => await _db.Trains.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Train?> GetByTrainNoAsync(string trainNo)
        => await _db.Trains.AsNoTracking().FirstOrDefaultAsync(t => t.TrainNo == trainNo);

    public async Task<Train> CreateAsync(Train train)
    {
        _db.Trains.Add(train);
        await _db.SaveChangesAsync();
        return train;
    }

    public async Task<bool> UpdateAsync(Train train)
    {
        var existing = await _db.Trains.FirstOrDefaultAsync(t => t.Id == train.Id);
        if (existing == null) return false;
        existing.TrainName = train.TrainName;
        existing.TrainType = train.TrainType;
        existing.TotalCoaches = train.TotalCoaches;
        existing.IsActive = train.IsActive;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.Trains.FirstOrDefaultAsync(t => t.Id == id);
        if (item == null) return false;
        _db.Trains.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}