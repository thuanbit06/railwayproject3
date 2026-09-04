namespace RailAdmin.API.DTOs.Request.Refund
{
    public class RefundGatewayRequest
    {
        public string OriginalTransactionId { get; init; }
            = string.Empty;

        public decimal Amount { get; init; }

        public string IdempotencyKey { get; init; }
            = string.Empty;
    }
}
