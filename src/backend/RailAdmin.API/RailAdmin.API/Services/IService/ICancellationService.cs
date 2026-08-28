namespace RailAdmin.API.Services.IService;
using global::RailAdmin.API.DTOs.Request.CancellationRule;
using global::RailAdmin.API.DTOs.Response;


public interface ICancellationService
{
    Task<IEnumerable<CancellationCalculationResponse>>
        GetAllAsync();

    Task<CancellationCalculationResponse?>
        GetByIdAsync(int ticketId);

    Task<CancellationCalculationResponse>
        CreateAsync(
            CancellationRequest dto);

    Task<bool> UpdateAsync(
        int ticketId,
        CancellationRequest dto);

    Task<bool> DeleteAsync(int ticketId);

    Task<CancellationRuleResponse?>
        GetApplicableRuleAsync(
            int hoursBeforeDeparture);

    Task<CancellationCalculationResponse>
        CalculateCancellationAsync(
            int ticketId);

    Task<bool>
        IsCancellationAllowedAsync(
            int ticketId);

    Task<CancellationCalculationResponse>
        CancelTicketAsync(
            CancellationRequest dto);
}
