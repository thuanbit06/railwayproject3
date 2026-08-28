namespace RailAdmin.API.Services.IService;
using global::RailAdmin.API.DTOs.Request.CancellationRule;
using global::RailAdmin.API.DTOs.Response;


public interface ICancellationService
{
    Task<IEnumerable<CancellationRuleResponse>> GetAllAsync();

    Task<CancellationRuleResponse?> GetByIdAsync(int id);

    Task<CancellationRuleResponse> CreateAsync(
        CancellationRuleCreateRequest dto);

    Task<bool> UpdateAsync(
        int id,
        CancellationRuleUpdateRequest dto);

    Task<bool> DeleteAsync(int id);

    Task<CancellationRuleResponse?> GetApplicableRuleAsync(
        int ticketId);

    Task<CancellationCalculationResponse?> CalculateCancellationAsync(
        int ticketId);

    Task<bool> IsCancellationAllowedAsync(
        int ticketId);
}
