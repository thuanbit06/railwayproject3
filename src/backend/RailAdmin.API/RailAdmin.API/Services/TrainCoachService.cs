using RailAdmin.API.DTOs.Request.Coach;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TrainCoachService : ITrainCoachService
{
    private readonly ITrainCoachRepository _repo;
    public TrainCoachService(ITrainCoachRepository repo) { _repo = repo; }

    public async Task<IEnumerable<TrainCoachResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<IEnumerable<TrainCoachResponse>> GetByTrainIdAsync(int trainId)
    {
        var list = await _repo.GetByTrainIdAsync(trainId);
        return list.Select(MapToResponse);
    }

    public async Task<TrainCoachResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<TrainCoachResponse> CreateAsync(TrainCoachCreateRequest dto)
    {
        var coach = new TrainCoach
        {
            TrainId = dto.TrainId,
            CoachNo = dto.CoachNo,
            ClassType = dto.ClassType,
            TotalSeats = dto.TotalSeats,
            FareMultiplier = dto.FareMultiplier
        };
        var created = await _repo.CreateAsync(coach);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, TrainCoachUpdateRequest dto)
    {
        var coach = new TrainCoach
        {
            Id = id,
            ClassType = dto.ClassType,
            TotalSeats = dto.TotalSeats,
            FareMultiplier = dto.FareMultiplier
        };
        return await _repo.UpdateAsync(coach);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static TrainCoachResponse MapToResponse(TrainCoach c) => new()
    {
        Id = c.Id,
        TrainId = c.TrainId,
        CoachNo = c.CoachNo,
        ClassType = c.ClassType,
        TotalSeats = c.TotalSeats,
        FareMultiplier = c.FareMultiplier
    };
}