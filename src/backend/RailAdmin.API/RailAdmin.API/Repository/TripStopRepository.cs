using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TripStopRepository : ITripStopRepository
{
    private readonly AppDbContext _db;
    public TripStopRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<TripStop>> GetAllAsync()
        => await _db.TripStops.AsNoTracking().ToListAsync();

    public async Task<IEnumerable<TripStop>> GetByTripIdAsync(int tripId)
        => await _db.TripStops.AsNoTracking()
            .Where(ts => ts.TripId == tripId)
            .OrderBy(ts => ts.StopSequence)
            .ToListAsync();

    public async Task<TripStop?> GetByIdAsync(int id)
        => await _db.TripStops.AsNoTracking().FirstOrDefaultAsync(ts => ts.Id == id);

    public async Task<TripStop> CreateAsync(TripStop stop)
    {
        _db.TripStops.Add(stop);
        await _db.SaveChangesAsync();
        return stop;
    }

    public async Task<bool> UpdateAsync(TripStop stop)
    {
        var existing = await _db.TripStops.FirstOrDefaultAsync(ts => ts.Id == stop.Id);
        if (existing == null) return false;
        existing.StopSequence = stop.StopSequence;
        existing.ArrivalTime = stop.ArrivalTime;
        existing.DepartureTime = stop.DepartureTime;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.TripStops.FirstOrDefaultAsync(ts => ts.Id == id);
        if (item == null) return false;
        _db.TripStops.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}