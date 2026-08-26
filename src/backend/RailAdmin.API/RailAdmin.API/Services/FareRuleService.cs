using RailAdmin.API.DTOs.Request.FareRule;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class FareRuleService : IFareRuleService
{
    private readonly IFareRuleRepository _repo;
    public FareRuleService(IFareRuleRepository repo) { _repo = repo; }

    public async Task<IEnumerable<FareRuleResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<FareRuleResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<FareRuleResponse> CreateAsync(FareRuleCreateRequest dto)
    {
        var rule = new FareRule
        {
            SeatClass = dto.SeatClass,
            TrainType = dto.TrainType,
            BasePrice = dto.BasePrice,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(rule);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, FareRuleUpdateRequest dto)
    {
        var rule = new FareRule
        {
            Id = id,
            BasePrice = dto.BasePrice,
            IsActive = dto.IsActive
        };
        return await _repo.UpdateAsync(rule);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static FareRuleResponse MapToResponse(FareRule f) => new()
    {
        Id = f.Id,
        SeatClass = f.SeatClass,
        TrainType = f.TrainType,
        BasePrice = f.BasePrice,
        IsActive = f.IsActive,
        CreatedAt = f.CreatedAt
    };
}