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
        if (dto.CoachId <= 0) throw new ArgumentException("Invalid coach ID."); 
        if (string.IsNullOrWhiteSpace(dto.SeatNo)) throw new ArgumentException("Seat number is required."); 
        var seat = new Seat 
        { 
            CoachId = dto.CoachId, 
            SeatNo = dto.SeatNo.Trim() 
        };
        var created = await _repo.CreateAsync(seat); 
        return MapToResponse(created); 
    }

    public async Task<bool> UpdateAsync(int id, SeatUpdateRequest dto)
    {
        if (id <= 0) return false; 
        if (string.IsNullOrWhiteSpace(dto.SeatNo)) return false;
        var seat = new Seat
        {
            Id = id,
            SeatNo = dto.SeatNo
        };
        return await _repo.UpdateAsync(seat);
    }

    public async Task<bool> DeleteAsync(int id) {
        if (id <= 0) return false; 
        return await _repo.DeleteAsync(id); 
    }

    private static SeatResponse MapToResponse(Seat s) => new()
    {
        Id = s.Id,
        CoachId = s.CoachId,
        SeatNo = s.SeatNo
    };


    //chỉ xác nhận seat có thể được release, còn việc chuyển: Ticket Confirmed -> Cancelled phải do TicketService thực hiện.
    public async Task<bool> ReleaseAsync(int seatId, int ticketId)
    {
        if (seatId <= 0 || ticketId <= 0) return false; 
        var seat = await _repo.GetByIdAsync(seatId); 
        if (seat == null) return false; 
        var owned = await _repo.IsOwnedByTicketAsync(seatId, ticketId); 
        if (!owned) return false; // Seat itself does not need to be updated. // 
        // TicketService will change: // 
        // Confirmed -> Cancelled // 
        // Therefore this seat becomes available 
        // automatically.
        return true;
    }

    public async Task<bool> IsAvailableAsync(int seatId)
    {
        if (seatId <= 0) return false; 
        var seat = await _repo.GetByIdAsync(seatId); 
        if (seat == null) return false; 
        return await _repo.IsAvailableAsync(seatId); 
    }

    public Task<bool> IsOwnedByTicketAsync(int seatId, int ticketId)
    {
        throw new NotImplementedException();
    }
}