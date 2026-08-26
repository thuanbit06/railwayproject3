using RailAdmin.API.DTOs.Request.FareRule;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IFareRuleService
{
    Task<IEnumerable<FareRuleResponse>> GetAllAsync();
    Task<FareRuleResponse?> GetByIdAsync(int id);
    Task<FareRuleResponse> CreateAsync(FareRuleCreateRequest dto);
    Task<bool> UpdateAsync(int id, FareRuleUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}