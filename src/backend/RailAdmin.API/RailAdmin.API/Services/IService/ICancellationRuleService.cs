using RailAdmin.API.DTOs.Request.CancellationRule;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ICancellationRuleService
{
    Task<IEnumerable<CancellationRuleResponse>>
        GetAllAsync();

    Task<CancellationRuleResponse?>
        GetByIdAsync(int id);

    Task<CancellationRuleResponse>
        CreateAsync(
            CancellationRuleCreateRequest dto);

    Task<bool> UpdateAsync(
        int id,
        CancellationRuleUpdateRequest dto);

    Task<bool> DeleteAsync(int id);

    Task<CancellationFeeResult>
        CalculateCancellationFeeAsync(
            decimal fare,
            DateTime departureTime);
}