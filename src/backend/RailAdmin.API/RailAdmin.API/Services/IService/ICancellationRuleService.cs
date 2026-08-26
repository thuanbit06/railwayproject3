using RailAdmin.API.DTOs.Request.CancellationRule;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ICancellationRuleService
{
    // Rule management
    Task<IEnumerable<CancellationRuleResponse>> GetAllAsync();

    Task<CancellationRuleResponse?> GetByIdAsync(int id);

    Task<CancellationRuleResponse> CreateAsync(
        CancellationRuleCreateRequest dto);

    Task<bool> UpdateAsync(
        int id,
        CancellationRuleUpdateRequest dto);

    Task<bool> DeleteAsync(int id);

    // Business operations
    Task<CancellationRuleResponse?> GetApplicableRuleAsync(
        int hoursBeforeDeparture);

    Task<CancellationCalculationResponse>
        CalculateCancellationAsync(
            int ticketId,
            string pnr,
            decimal amountPaid,
            DateTime departureTime);

    Task<bool> IsCancellationAllowedAsync(
        DateTime departureTime);
}