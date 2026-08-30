using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TrainRepository : ITrainRepository
{
    private readonly AppDbContext _context;

    public TrainRepository(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET ALL
    // =========================================================
    public async Task<IEnumerable<Train>> GetAllAsync()
    {
        return await _context.Trains
            .Include(t => t.Coaches)
            .ThenInclude(c => c.Seats)
            .OrderBy(t => t.TrainNo)
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================
    public async Task<Train?> GetByIdAsync(int id)
    {
        return await _context.Trains
            .Include(t => t.Coaches)
            .ThenInclude(c => c.Seats)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    // =========================================================
    // SEARCH
    // =========================================================
    public async Task<IEnumerable<Train>> SearchAsync(
        TrainSearchRequest request)
    {
        var query = _context.Trains
            .Include(t => t.Coaches)
            .ThenInclude(c => c.Seats)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();

            query = query.Where(t =>
                t.TrainNo.Contains(search) ||
                t.TrainName.Contains(search) ||
                t.TrainType.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(request.TrainNo))
        {
            query = query.Where(t =>
                t.TrainNo.Contains(request.TrainNo));
        }

        if (!string.IsNullOrWhiteSpace(request.TrainName))
        {
            query = query.Where(t =>
                t.TrainName.Contains(request.TrainName));
        }

        if (!string.IsNullOrWhiteSpace(request.TrainType))
        {
            query = query.Where(t =>
                t.TrainType == request.TrainType);
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(t =>
                t.IsActive == request.IsActive.Value);
        }

        return await query
            .OrderBy(t => t.TrainNo)
            .ToListAsync();
    }

    // =========================================================
    // CREATE
    // =========================================================
    public async Task<Train> CreateAsync(Train train)
    {
        await _context.Trains.AddAsync(train);
        await _context.SaveChangesAsync();

        return train;
    }

    // =========================================================
    // UPDATE
    // =========================================================
    public async Task UpdateAsync(Train train)
    {
        _context.Trains.Update(train);
        await _context.SaveChangesAsync();
    }

    // =========================================================
    // DELETE
    // =========================================================
    public async Task DeleteAsync(Train train)
    {
        _context.Trains.Remove(train);
        await _context.SaveChangesAsync();
    }
}