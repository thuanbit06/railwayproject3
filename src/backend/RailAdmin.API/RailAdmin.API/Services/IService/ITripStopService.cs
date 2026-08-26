using RailAdmin.API.DTOs.Request.TripStop;
using RailAdmin.API.DTOs.Response;
namespace RailAdmin.API.Services.IService;

public interface ITripStopService
{
    Task<IEnumerable<TripStopResponse>> GetAllAsync();
    Task<IEnumerable<TripStopResponse>> GetByTripIdAsync(int tripId);
    Task<TripStopResponse?> GetByIdAsync(int id);
    Task<TripStopResponse> CreateAsync(TripStopCreateRequest dto);
    Task<bool> UpdateAsync(int id, TripStopUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}