using RailAdmin.API.DTOs.Request.TripStop;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TripStopService : ITripStopService
{
    private readonly ITripStopRepository _repo;
    public TripStopService(ITripStopRepository repo) { _repo = repo; }

    public async Task<IEnumerable<TripStopResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<IEnumerable<TripStopResponse>> GetByTripIdAsync(int tripId)
    {
        var list = await _repo.GetByTripIdAsync(tripId);
        return list.Select(MapToResponse);
    }

    public async Task<TripStopResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<TripStopResponse> CreateAsync(TripStopCreateRequest dto)
    {
        var stop = new TripStop
        {
            TripId = dto.TripId,
            StationId = dto.StationId,
            StopSequence = dto.StopSequence,
            ArrivalTime = dto.ArrivalTime,
            DepartureTime = dto.DepartureTime
        };
        var created = await _repo.CreateAsync(stop);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, TripStopUpdateRequest dto)
    {
        var stop = new TripStop
        {
            Id = id,
            StopSequence = dto.StopSequence,
            ArrivalTime = dto.ArrivalTime,
            DepartureTime = dto.DepartureTime
        };
        return await _repo.UpdateAsync(stop);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static TripStopResponse MapToResponse(TripStop ts) => new()
    {
        Id = ts.Id,
        TripId = ts.TripId,
        StationId = ts.StationId,
        StopSequence = ts.StopSequence,
        ArrivalTime = ts.ArrivalTime,
        DepartureTime = ts.DepartureTime
    };
}