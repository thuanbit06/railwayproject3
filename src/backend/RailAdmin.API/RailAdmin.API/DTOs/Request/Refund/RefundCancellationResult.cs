namespace RailAdmin.API.DTOs.Request.Refund
{
    public class RefundCancellationResult
    {
        public int TicketId { get; set; }

        public int? CancellationRuleId { get; set; }

        public decimal AmountPaid { get; set; }

        public decimal CancellationFee { get; set; }

        public decimal RefundAmount { get; set; }

        public int HoursBeforeDeparture { get; set; }

        public bool IsAllowed { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}
