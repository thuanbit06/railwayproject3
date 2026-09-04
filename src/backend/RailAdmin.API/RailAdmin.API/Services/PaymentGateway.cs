using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services
{
    public class PaymentGateway : IPaymentGateway
    {
        private readonly ILogger<PaymentGateway> _logger;

        public PaymentGateway(
            ILogger<PaymentGateway> logger)
        {
            _logger = logger;
        }

        public async Task<RefundGatewayResult> RefundAsync(RefundGatewayRequest request, CancellationToken cancellationToken = default)
        {
            if (request.Amount <= 0)
            {
                return RefundGatewayResult.Failed(
                    "Refund amount must be greater than zero.");
            }

            if (string.IsNullOrWhiteSpace(
                request.IdempotencyKey))
            {
                return RefundGatewayResult.Failed(
                    "Idempotency key is required.");
            }

            try
            {
                _logger.LogInformation(
                    "Refunding transaction {TransactionId}, " +
                    "Amount={Amount}, IdempotencyKey={Key}",
                    request.OriginalTransactionId,
                    request.Amount,
                    request.IdempotencyKey);

                // TODO:
                // HttpClient gọi payment gateway thật.

                await Task.Delay(
                    100,
                    cancellationToken);

                return RefundGatewayResult.Success(
                    $"RF-{Guid.NewGuid():N}");
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(
                    ex,
                    "Payment gateway timeout.");

                return RefundGatewayResult.Unknown(
                    "Payment gateway timeout.");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(
                    ex,
                    "Payment gateway communication error.");

                return RefundGatewayResult.Unknown(
                    "Payment gateway communication error.");
            }
        }
    }
}
