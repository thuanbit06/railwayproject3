using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TrainCoachRepository : ITrainCoachRepository
{
    private readonly AppDbContext _db;
    public TrainCoachRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<TrainCoach>> GetAllAsync()
        => await _db.TrainCoaches.AsNoTracking().ToListAsync();

    public async Task<IEnumerable<TrainCoach>> GetByTrainIdAsync(int trainId)
        => await _db.TrainCoaches.AsNoTracking().Where(c => c.TrainId == trainId).ToListAsync();

    public async Task<TrainCoach?> GetByIdAsync(int id)
        => await _db.TrainCoaches.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

    public async Task<TrainCoach> CreateAsync(TrainCoach coach)
    {
        _db.TrainCoaches.Add(coach);
        await _db.SaveChangesAsync();
        return coach;
    }

    public async Task<bool> UpdateAsync(TrainCoach coach)
    {
        var existing = await _db.TrainCoaches.FirstOrDefaultAsync(c => c.Id == coach.Id);
        if (existing == null) return false;
        existing.ClassType = coach.ClassType;
        existing.TotalSeats = coach.TotalSeats;
        existing.FareMultiplier = coach.FareMultiplier;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.TrainCoaches.FirstOrDefaultAsync(c => c.Id == id);
        if (item == null) return false;
        _db.TrainCoaches.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}