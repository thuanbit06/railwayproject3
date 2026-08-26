using RailAdmin.API.DTOs.Request.Station;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class StationService : IStationService
{
    private readonly IStationRepository _repo;
    public StationService(IStationRepository repo) { _repo = repo; }

    public async Task<IEnumerable<StationResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<StationResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<StationResponse> CreateAsync(StationCreateRequest dto)
    {
        var station = new Station
        {
            Code = dto.Code,
            Name = dto.Name,
            City = dto.City
        };
        var created = await _repo.CreateAsync(station);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, StationUpdateRequest dto)
    {
        var station = new Station
        {
            Id = id,
            Code = dto.Code,
            Name = dto.Name,
            City = dto.City
        };
        return await _repo.UpdateAsync(station);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static StationResponse MapToResponse(Station s) => new()
    {
        Id = s.Id,
        Code = s.Code,
        Name = s.Name,
        City = s.City
    };
}