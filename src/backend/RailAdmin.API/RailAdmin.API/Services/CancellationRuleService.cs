using RailAdmin.API.DTOs.Request.CancellationRule;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class CancellationRuleService : ICancellationRuleService
{
    private readonly ICancellationRuleRepository _repo;
    public CancellationRuleService(ICancellationRuleRepository repo) { _repo = repo; }

    public async Task<IEnumerable<CancellationRuleResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<CancellationRuleResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<CancellationRuleResponse> CreateAsync(CancellationRuleCreateRequest dto)
    {
        var rule = new CancellationRule
        {
            HoursBeforeDeparture = dto.HoursBeforeDeparture,
            FeeType = dto.FeeType,
            FeeValue = dto.FeeValue,
            MinFee = dto.MinFee
        };
        var created = await _repo.CreateAsync(rule);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, CancellationRuleUpdateRequest dto)
    {
        var rule = new CancellationRule
        {
            Id = id,
            HoursBeforeDeparture = dto.HoursBeforeDeparture,
            FeeType = dto.FeeType,
            FeeValue = dto.FeeValue,
            MinFee = dto.MinFee
        };
        return await _repo.UpdateAsync(rule);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static CancellationRuleResponse MapToResponse(CancellationRule r) => new()
    {
        Id = r.Id,
        HoursBeforeDeparture = r.HoursBeforeDeparture,
        FeeType = r.FeeType,
        FeeValue = r.FeeValue,
        MinFee = r.MinFee
    };
}