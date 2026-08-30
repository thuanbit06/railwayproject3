using RailAdmin.API.DTOs.Request.Coach;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TrainCoachService : ITrainCoachService
{
    private readonly ITrainCoachRepository _repo;

    public TrainCoachService(
        ITrainCoachRepository repo)
    {
        _repo = repo;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<TrainCoachResponse>> GetAllAsync()
    {
        var list =
            await _repo.GetAllAsync();

        return list.Select(MapToResponse);
    }

    // =========================================================
    // GET BY TRAIN
    // =========================================================

    public async Task<IEnumerable<TrainCoachResponse>>
        GetByTrainIdAsync(int trainId)
    {
        var list =
            await _repo.GetByTrainIdAsync(trainId);

        return list.Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<TrainCoachResponse?>
        GetByIdAsync(int id)
    {
        var coach =
            await _repo.GetByIdAsync(id);

        return coach == null
            ? null
            : MapToResponse(coach);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<TrainCoachResponse>
        CreateAsync(
            TrainCoachCreateRequest dto)
    {
        // -----------------------------------------------------
        // Check Train
        // -----------------------------------------------------

        var trainExists =
            await _repo.TrainExistsAsync(dto.TrainId);

        if (!trainExists)
        {
            throw new KeyNotFoundException(
                $"Train with ID {dto.TrainId} not found.");
        }

        // -----------------------------------------------------
        // Check CoachNo
        // -----------------------------------------------------

        var coachNo =
            dto.CoachNo.Trim();

        var exists =
            await _repo.CoachNoExistsAsync(
                dto.TrainId,
                coachNo);

        if (exists)
        {
            throw new InvalidOperationException(
                $"Coach number '{coachNo}' already exists in this train.");
        }

        // -----------------------------------------------------
        // Create
        // -----------------------------------------------------

        var coach = new TrainCoach
        {
            TrainId = dto.TrainId,

            CoachNo = coachNo,

            ClassType = dto.ClassType.Trim(),

            TotalSeats = dto.TotalSeats,

            FareMultiplier = dto.FareMultiplier
        };

        var created =
            await _repo.CreateAsync(coach);

        return MapToResponse(created);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(
        int id,
        TrainCoachUpdateRequest dto)
    {
        var existing =
            await _repo.GetByIdAsync(id);

        if (existing == null)
            return false;

        var coach = new TrainCoach
        {
            Id = id,

            TrainId = existing.TrainId,

            CoachNo = existing.CoachNo,

            ClassType = dto.ClassType.Trim(),

            TotalSeats = dto.TotalSeats,

            FareMultiplier = dto.FareMultiplier
        };

        return await _repo.UpdateAsync(coach);
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }

    // =========================================================
    // MAP
    // =========================================================

    private static TrainCoachResponse MapToResponse(
        TrainCoach coach)
    {
        return new TrainCoachResponse
        {
            Id = coach.Id,

            TrainId = coach.TrainId,

            CoachNo = coach.CoachNo,

            ClassType = coach.ClassType,

            TotalSeats = coach.TotalSeats,

            FareMultiplier = coach.FareMultiplier,

            Seats = coach.Seats?
                .Select(s => new SeatResponse
                {
                    Id = s.Id,
                    CoachId = s.CoachId,
                    SeatNo = s.SeatNo
                })
                .ToList()
                ?? new List<SeatResponse>()
        };
    }
}