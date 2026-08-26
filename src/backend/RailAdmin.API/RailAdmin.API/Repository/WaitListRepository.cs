using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class WaitListRepository : IWaitListRepository
{
    private readonly AppDbContext _db;
    public WaitListRepository(AppDbContext db) { _db = db; }

    public async Task<IEnumerable<WaitList>> GetAllAsync()
        => await _db.WaitLists.AsNoTracking().OrderBy(w => w.Position).ToListAsync();

    public async Task<IEnumerable<WaitList>> GetByTripIdAsync(int tripId)
        => await _db.WaitLists.AsNoTracking()
            .Where(w => w.TripId == tripId)
            .OrderBy(w => w.Position)
            .ToListAsync();

    public async Task<WaitList?> GetByIdAsync(int id)
        => await _db.WaitLists.AsNoTracking().FirstOrDefaultAsync(w => w.Id == id);

    public async Task<int> GetNextPositionAsync(int tripId, string requestedClass)
    {
        var count = await _db.WaitLists
            .Where(w => w.TripId == tripId && w.RequestedClass == requestedClass && w.Status == "WAITING")
            .CountAsync();
        return count + 1;
    }

    public async Task<WaitList> CreateAsync(WaitList waitList)
    {
        _db.WaitLists.Add(waitList);
        await _db.SaveChangesAsync();
        return waitList;
    }

    public async Task<bool> UpdateAsync(WaitList waitList)
    {
        var existing = await _db.WaitLists.FirstOrDefaultAsync(w => w.Id == waitList.Id);
        if (existing == null) return false;
        existing.Status = waitList.Status;
        existing.ExpiresAt = waitList.ExpiresAt;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _db.WaitLists.FirstOrDefaultAsync(w => w.Id == id);
        if (item == null) return false;
        _db.WaitLists.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }
}