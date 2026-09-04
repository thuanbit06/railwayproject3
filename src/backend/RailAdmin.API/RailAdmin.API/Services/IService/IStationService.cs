using RailAdmin.API.DTOs.Request.Station;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IStationService
{
    Task<IEnumerable<StationResponse>> GetAllAsync();

    Task<StationResponse?> GetByIdAsync(int id);

    Task<StationResponse> CreateAsync(
        StationCreateRequest dto);

    Task<bool> UpdateAsync(
        int id,
        StationUpdateRequest dto);

    Task<bool> DeleteAsync(int id);
}