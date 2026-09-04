namespace RailAdmin.API.DTOs.Response
{
    public class RefundGatewayResult
    {
        public bool IsSuccess { get; init; }

        public bool IsFailure { get; init; }

        public bool IsUnknown { get; init; }

        public string? RefundTransactionId { get; init; }

        public string? ErrorMessage { get; init; }

        public static RefundGatewayResult Success(
            string refundTransactionId)
        {
            return new RefundGatewayResult
            {
                IsSuccess = true,
                RefundTransactionId = refundTransactionId
            };
        }

        public static RefundGatewayResult Failed(
            string message)
        {
            return new RefundGatewayResult
            {
                IsFailure = true,
                ErrorMessage = message
            };
        }

        public static RefundGatewayResult Unknown(
            string message)
        {
            return new RefundGatewayResult
            {
                IsUnknown = true,
                ErrorMessage = message
            };
        }
    }
}
