using RailAdmin.API.DTOs.Request.Trip;
using RailAdmin.API.DTOs.Response;
namespace RailAdmin.API.Services.IService;

public interface ITripService
{
    Task<IEnumerable<TripResponse>> GetAllAsync();
    Task<TripResponse?> GetByIdAsync(int id);
    Task<TripResponse> CreateAsync(TripCreateRequest dto);
    Task<bool> UpdateAsync(int id, TripUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}