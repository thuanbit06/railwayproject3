using RailAdmin.API.DTOs.Request.Waitlist;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IWaitListService
{
    Task<IEnumerable<WaitListResponse>> GetAllAsync();
    Task<IEnumerable<WaitListResponse>> GetByTripIdAsync(int tripId);
    Task<WaitListResponse?> GetByIdAsync(int id);
    Task<WaitListResponse> CreateAsync(WaitListCreateRequest dto);
    Task<bool> UpdateAsync(int id, WaitListUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}