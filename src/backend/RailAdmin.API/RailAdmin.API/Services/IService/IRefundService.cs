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
    Task<RefundResponse> CreateAsync(RefundCreateRequest dto);

    Task<RefundResponse> ProcessAsync(int refundId, CancellationToken cancellationToken = default);

    Task<bool> MarkAsFailedAsync(int refundId, string reason);

    // Admin
    Task<bool> DeleteAsync(int id);

    Task<bool> UpdateAsync(int id, RefundUpdateRequest dto);
}