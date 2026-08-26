using RailAdmin.API.DTOs.Request.Seat;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class SeatService : ISeatService
{
    private readonly ISeatRepository _repo;
    public SeatService(ISeatRepository repo) { _repo = repo; }

    public async Task<IEnumerable<SeatResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<IEnumerable<SeatResponse>> GetByCoachIdAsync(int coachId)
    {
        var list = await _repo.GetByCoachIdAsync(coachId);
        return list.Select(MapToResponse);
    }

    public async Task<SeatResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<SeatResponse> CreateAsync(SeatCreateRequest dto)
    {
        var seat = new Seat
        {
            CoachId = dto.CoachId,
            SeatNo = dto.SeatNo
        };
        var created = await _repo.CreateAsync(seat);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, SeatUpdateRequest dto)
    {
        var seat = new Seat
        {
            Id = id,
            SeatNo = dto.SeatNo
        };
        return await _repo.UpdateAsync(seat);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static SeatResponse MapToResponse(Seat s) => new()
    {
        Id = s.Id,
        CoachId = s.CoachId,
        SeatNo = s.SeatNo
    };
}