using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TripStopRepository : ITripStopRepository
{
    private readonly AppDbContext _db;

    public TripStopRepository(AppDbContext db)
    {
        _db = db;
    }

    // GET ALL
    public async Task<IEnumerable<TripStop>> GetAllAsync()
    {
        return await _db.TripStops
            .AsNoTracking()
            .OrderBy(x => x.TripId)
            .ThenBy(x => x.StopSequence)
            .ToListAsync();
    }

    // GET BY TRIP ID
    public async Task<IEnumerable<TripStop>> GetByTripIdAsync(int tripId)
    {
        return await _db.TripStops
            .AsNoTracking()
            .Where(x => x.TripId == tripId)
            .OrderBy(x => x.StopSequence)
            .ToListAsync();
    }

    // GET BY ID
    public async Task<TripStop?> GetByIdAsync(int id)
    {
        return await _db.TripStops
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    // CREATE
    public async Task<TripStop> CreateAsync(TripStop stop)
    {
        _db.TripStops.Add(stop);

        await _db.SaveChangesAsync();

        return stop;
    }

    // UPDATE
    public async Task<bool> UpdateAsync(TripStop stop)
    {
        var existing = await _db.TripStops
            .FirstOrDefaultAsync(x => x.Id == stop.Id);

        if (existing == null)
            return false;

        existing.StopSequence = stop.StopSequence;
        existing.ArrivalTime = stop.ArrivalTime;
        existing.DepartureTime = stop.DepartureTime;

        await _db.SaveChangesAsync();

        return true;
    }

    // DELETE
    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.TripStops
            .FirstOrDefaultAsync(x => x.Id == id);

        if (item == null)
            return false;

        _db.TripStops.Remove(item);

        await _db.SaveChangesAsync();

        return true;
    }
}