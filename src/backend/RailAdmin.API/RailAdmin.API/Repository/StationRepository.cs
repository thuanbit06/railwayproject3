using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class StationRepository : IStationRepository
{
    private readonly AppDbContext _db;
    public StationRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<Station>> GetAllAsync()
        => await _db.Stations.AsNoTracking().OrderBy(s => s.Code).ToListAsync();

    public async Task<Station?> GetByIdAsync(int id)
        => await _db.Stations.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);

    public async Task<Station?> GetByCodeAsync(string code)
        => await _db.Stations.AsNoTracking().FirstOrDefaultAsync(s => s.Code == code);

    public async Task<Station> CreateAsync(Station station)
    {
        _db.Stations.Add(station);
        await _db.SaveChangesAsync();
        return station;
    }

    public async Task<bool> UpdateAsync(Station station)
    {
        var existing = await _db.Stations.FirstOrDefaultAsync(s => s.Id == station.Id);
        if (existing == null) return false;
        existing.Code = station.Code;
        existing.Name = station.Name;
        existing.City = station.City;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.Stations.FirstOrDefaultAsync(s => s.Id == id);
        if (item == null) return false;
        _db.Stations.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}