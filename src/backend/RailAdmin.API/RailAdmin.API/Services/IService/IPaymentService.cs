using RailAdmin.API.DTOs.Request.Payment;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IPaymentService
{
    Task<IEnumerable<PaymentResponse>> GetAllAsync();
    Task<PaymentResponse?> GetByIdAsync(int id);
    Task<PaymentResponse?> GetByPNRAsync(string pnr);
    Task<PaymentResponse> CreateAsync(PaymentCreateRequest dto);
    Task<bool> UpdateAsync(int id, PaymentUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> RefundAsync(string pnr);
}