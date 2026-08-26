using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TrainService : ITrainService
{
    private readonly ITrainRepository _repo;
    public TrainService(ITrainRepository repo) { _repo = repo; }

    public async Task<IEnumerable<TrainResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<TrainResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<TrainResponse> CreateAsync(TrainCreateRequest dto)
    {
        var train = new Train
        {
            TrainNo = dto.TrainNo,
            TrainName = dto.TrainName,
            TrainType = dto.TrainType,
            TotalCoaches = dto.TotalCoaches,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(train);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, TrainUpdateRequest dto)
    {
        var train = new Train
        {
            Id = id,
            TrainName = dto.TrainName,
            TrainType = dto.TrainType,
            TotalCoaches = dto.TotalCoaches,
            IsActive = dto.IsActive
        };
        return await _repo.UpdateAsync(train);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static TrainResponse MapToResponse(Train t) => new()
    {
        Id = t.Id,
        TrainNo = t.TrainNo,
        TrainName = t.TrainName,
        TrainType = t.TrainType,
        TotalCoaches = t.TotalCoaches,
        IsActive = t.IsActive,
        CreatedAt = t.CreatedAt
    };
}