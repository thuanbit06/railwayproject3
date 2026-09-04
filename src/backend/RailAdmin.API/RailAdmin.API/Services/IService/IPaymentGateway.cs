using RailAdmin.API.DTOs.Response;
using RailAdmin.API.DTOs.Request.Refund;

namespace RailAdmin.API.Services.IService
{
    public interface IPaymentGateway
    {
        Task<RefundGatewayResult> RefundAsync(RefundGatewayRequest request, CancellationToken cancellationToken = default);
    }
}
