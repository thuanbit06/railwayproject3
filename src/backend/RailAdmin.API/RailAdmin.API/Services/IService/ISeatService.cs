using RailAdmin.API.DTOs.Request.Seat;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ISeatService
{
    Task<IEnumerable<SeatResponse>> GetAllAsync();

    Task<SeatResponse?> GetByIdAsync(int id);

    Task<IEnumerable<SeatResponse>> GetByCoachIdAsync(int coachId);

    Task<SeatResponse> CreateAsync(SeatCreateRequest dto);

    Task<bool> UpdateAsync(int id, SeatUpdateRequest dto);

    Task<bool> DeleteAsync(int id);

    Task<bool> SeatExistsAsync(int seatId);

    Task<bool> SeatBelongsToTripAsync(int seatId, string pnr);

    Task<bool> SeatIsAlreadyBookedAsync(int seatId, string pnr);
}