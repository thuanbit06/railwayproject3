using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IRefundService
{
    Task<IEnumerable<RefundResponse>> GetAllAsync();
    Task<RefundResponse?> GetByIdAsync(int id);
    Task<RefundResponse?> GetByTicketIdAsync(int ticketId);
    Task<RefundResponse> CreateAsync(RefundCreateRequest dto);
    Task<bool> UpdateAsync(int id, RefundUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}