using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TrainCoachRepository : ITrainCoachRepository
{
    private readonly AppDbContext _db;

    public TrainCoachRepository(AppDbContext db)
    {
        _db = db;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<TrainCoach>> GetAllAsync()
    {
        return await _db.TrainCoaches
            .AsNoTracking()
            .Include(c => c.Seats)
            .OrderBy(c => c.TrainId)
            .ThenBy(c => c.CoachNo)
            .ToListAsync();
    }

    // =========================================================
    // GET BY TRAIN
    // =========================================================

    public async Task<IEnumerable<TrainCoach>> GetByTrainIdAsync(
        int trainId)
    {
        return await _db.TrainCoaches
            .AsNoTracking()
            .Include(c => c.Seats)
            .Where(c => c.TrainId == trainId)
            .OrderBy(c => c.CoachNo)
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<TrainCoach?> GetByIdAsync(int id)
    {
        return await _db.TrainCoaches
            .AsNoTracking()
            .Include(c => c.Seats)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    // =========================================================
    // CHECK TRAIN
    // =========================================================

    public async Task<bool> TrainExistsAsync(int trainId)
    {
        return await _db.Trains
            .AnyAsync(t => t.Id == trainId);
    }

    // =========================================================
    // CHECK COACH NUMBER
    // =========================================================

    public async Task<bool> CoachNoExistsAsync(
        int trainId,
        string coachNo,
        int? excludeId = null)
    {
        var query = _db.TrainCoaches
            .Where(c =>
                c.TrainId == trainId &&
                c.CoachNo == coachNo);

        if (excludeId.HasValue)
        {
            query = query.Where(c =>
                c.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<TrainCoach> CreateAsync(
        TrainCoach coach)
    {
        _db.TrainCoaches.Add(coach);

        await _db.SaveChangesAsync();

        return coach;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(
        TrainCoach coach)
    {
        var existing =
            await _db.TrainCoaches
                .FirstOrDefaultAsync(c => c.Id == coach.Id);

        if (existing == null)
            return false;

        existing.ClassType =
            coach.ClassType;

        existing.TotalSeats =
            coach.TotalSeats;

        existing.FareMultiplier =
            coach.FareMultiplier;

        await _db.SaveChangesAsync();

        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var item =
            await _db.TrainCoaches
                .FirstOrDefaultAsync(c => c.Id == id);

        if (item == null)
            return false;

        _db.TrainCoaches.Remove(item);

        await _db.SaveChangesAsync();

        return true;
    }
}