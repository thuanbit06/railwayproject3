using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TripRepository : ITripRepository
{
    private readonly AppDbContext _db;
    public TripRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Trip>> GetAllAsync()
        => await _db.Trips.AsNoTracking().OrderByDescending(t => t.JourneyDate).ToListAsync();

    public async Task<Trip?> GetByIdAsync(int id)
        => await _db.Trips.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Trip> CreateAsync(Trip trip)
    {
        _db.Trips.Add(trip);
        await _db.SaveChangesAsync();
        return trip;
    }

    public async Task<bool> UpdateAsync(Trip trip)
    {
        var existing = await _db.Trips.FirstOrDefaultAsync(t => t.Id == trip.Id);
        if (existing == null) return false;
        existing.JourneyDate = trip.JourneyDate;
        existing.DepartureTime = trip.DepartureTime;
        existing.ArrivalTime = trip.ArrivalTime;
        existing.Status = trip.Status;
        existing.TotalCapacity = trip.TotalCapacity;
        existing.AvailableSeats = trip.AvailableSeats;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.Trips.FirstOrDefaultAsync(t => t.Id == id);
        if (item == null) return false;
        _db.Trips.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}