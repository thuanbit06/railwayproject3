using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IRefundService
{
    // Query
    Task<IEnumerable<RefundResponse>> GetAllAsync();

    Task<RefundResponse?> GetByIdAsync(int id);

    Task<RefundResponse?> GetByTicketIdAsync(
        int ticketId);

    // Business
    Task<RefundResponse> CreateAsync(
        RefundCreateRequest dto);

    Task<RefundResponse> ProcessAsync(
        int refundId);

    Task<bool> MarkAsFailedAsync(
        int refundId);

    // Admin
    Task<bool> DeleteAsync(int id);

    Task<RefundResponse> CreateFromCalculationAsync(int ticketId);
}