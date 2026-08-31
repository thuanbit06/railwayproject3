using RailAdmin.API.DTOs.Request.CancellationRule;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ICancellationRuleService
{
    Task<IEnumerable<CancellationRuleResponse>> GetAllAsync();

    Task<CancellationRuleResponse?> GetByIdAsync(int id);

    Task<CancellationRuleResponse> CreateAsync(
        CancellationRuleCreateRequest dto);

    Task<bool> UpdateAsync(
        int id,
        CancellationRuleUpdateRequest dto);

    Task<bool> DeleteAsync(int id);

    Task<CancellationRuleResponse?>
        GetApplicableRuleAsync(
            int hoursBeforeDeparture);

    Task<CancellationCalculationResponse>
        CalculateCancellationAsync(
            decimal fare,
            int hoursBeforeDeparture);

    Task<bool>
        IsCancellationAllowedAsync(
            int hoursBeforeDeparture);
}