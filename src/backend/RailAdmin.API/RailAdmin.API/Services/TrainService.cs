using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TrainService : ITrainService
{
    private readonly ITrainRepository _repository;

    public TrainService(ITrainRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TrainResponse>> GetAllAsync()
    {
        var trains = await _repository.GetAllAsync();

        return trains.Select(MapToResponse);
    }

    public async Task<TrainResponse?> GetByIdAsync(int id)
    {
        var train = await _repository.GetByIdAsync(id);

        return train == null ? null : MapToResponse(train);
    }

    public async Task<IEnumerable<TrainResponse>> SearchAsync(
        TrainSearchRequest request)
    {
        var trains = await _repository.SearchAsync(request);

        return trains.Select(MapToResponse);
    }

    public async Task<TrainResponse> CreateAsync(
    TrainCreateRequest request)
    {
        var train = new Models.Train
        {
            TrainNo = request.TrainNo.Trim(),
            TrainName = request.TrainName.Trim(),
            TrainType = request.TrainType?.Trim() ?? string.Empty,
            TotalCoaches = request.TotalCoaches,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(train);

        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(
        int id,
        TrainUpdateRequest request)
    {
        var train = await _repository.GetByIdAsync(id);

        if (train == null)
            return false;

        train.TrainNo = request.TrainNo;
        train.TrainName = request.TrainName;
        train.TrainType = request.TrainType ?? string.Empty;
        train.TotalCoaches = request.TotalCoaches;

        await _repository.UpdateAsync(train);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var train = await _repository.GetByIdAsync(id);

        if (train == null)
            return false;

        await _repository.DeleteAsync(train);

        return true;
    }

    public async Task<bool> UpdateStatusAsync(
    int id,
    bool isActive)
    {
        var train = await _repository.GetByIdAsync(id);

        if (train == null)
            return false;

        train.IsActive = isActive;

        await _repository.UpdateAsync(train);

        return true;
    }

    private static TrainResponse MapToResponse(Models.Train train)
    {
        return new TrainResponse
        {
            Id = train.Id,
            TrainNo = train.TrainNo,
            TrainName = train.TrainName,
            TrainType = train.TrainType,
            TotalCoaches = train.TotalCoaches,
            IsActive = train.IsActive,
            CreatedAt = train.CreatedAt
        };
    }
}