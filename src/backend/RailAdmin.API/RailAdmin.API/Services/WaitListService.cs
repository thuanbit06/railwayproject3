using RailAdmin.API.DTOs.Request.Waitlist;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class WaitListService : IWaitListService
{
    private readonly IWaitListRepository _repo;
    public WaitListService(IWaitListRepository repo) { _repo = repo; }

    public async Task<IEnumerable<WaitListResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<IEnumerable<WaitListResponse>> GetByTripIdAsync(int tripId)
    {
        var list = await _repo.GetByTripIdAsync(tripId);
        return list.Select(MapToResponse);
    }

    public async Task<WaitListResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<WaitListResponse> CreateAsync(WaitListCreateRequest dto)
    {
        int nextPos = await _repo.GetNextPositionAsync(dto.TripId, dto.RequestedClass);

        var waitList = new WaitList
        {
            TripId = dto.TripId,
            TicketId = dto.TicketId,
            RequestedClass = dto.RequestedClass,
            Position = nextPos,
            Status = "WAITING",
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(waitList);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, WaitListUpdateRequest dto)
    {
        var waitList = new WaitList
        {
            Id = id,
            Status = dto.Status,
            ExpiresAt = dto.ExpiresAt
        };
        return await _repo.UpdateAsync(waitList);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static WaitListResponse MapToResponse(WaitList w) => new()
    {
        Id = w.Id,
        TripId = w.TripId,
        TicketId = w.TicketId,
        RequestedClass = w.RequestedClass,
        Position = w.Position,
        Status = w.Status,
        CreatedAt = w.CreatedAt,
        ExpiresAt = w.ExpiresAt
    };
}