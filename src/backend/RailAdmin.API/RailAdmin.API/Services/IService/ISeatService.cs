using RailAdmin.API.DTOs.Request.Seat;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ISeatService
{
    Task<IEnumerable<SeatResponse>> GetAllAsync();

    Task<IEnumerable<SeatResponse>> GetByCoachIdAsync(
        int coachId);

    Task<SeatResponse?> GetByIdAsync(int id);

    Task<SeatResponse> CreateAsync(
        SeatCreateRequest dto);

    Task<bool> UpdateAsync(
        int id,
        SeatUpdateRequest dto);

    Task<bool> DeleteAsync(int id);
}