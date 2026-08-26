using RailAdmin.API.DTOs.Request.Trip;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TripService : ITripService
{
    private readonly ITripRepository _repo;
    public TripService(ITripRepository repo) { _repo = repo; }

    public async Task<IEnumerable<TripResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<TripResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<TripResponse> CreateAsync(TripCreateRequest dto)
    {
        var trip = new Trip
        {
            TrainId = dto.TrainId,
            FromStationId = dto.FromStationId,
            ToStationId = dto.ToStationId,
            JourneyDate = dto.JourneyDate,
            DepartureTime = dto.DepartureTime,
            ArrivalTime = dto.ArrivalTime,
            TotalCapacity = dto.TotalCapacity,
            AvailableSeats = dto.TotalCapacity,
            Status = "Scheduled",
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(trip);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, TripUpdateRequest dto)
    {
        var trip = new Trip
        {
            Id = id,
            JourneyDate = dto.JourneyDate,
            DepartureTime = dto.DepartureTime,
            ArrivalTime = dto.ArrivalTime,
            Status = dto.Status,
            TotalCapacity = dto.TotalCapacity,
            AvailableSeats = dto.AvailableSeats
        };
        return await _repo.UpdateAsync(trip);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static TripResponse MapToResponse(Trip t) => new()
    {
        Id = t.Id,
        TrainId = t.TrainId,
        FromStationId = t.FromStationId,
        ToStationId = t.ToStationId,
        JourneyDate = t.JourneyDate,
        DepartureTime = t.DepartureTime,
        ArrivalTime = t.ArrivalTime,
        Status = t.Status,
        TotalCapacity = t.TotalCapacity,
        AvailableSeats = t.AvailableSeats,
        CreatedAt = t.CreatedAt
    };
}