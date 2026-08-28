namespace RailAdmin.API.DTOs.Response
{
    public class CancellationCalculationResponse
    {
        public int TicketId { get; set; }

        public decimal Fare { get; set; }

        public string PNR { get; set; } = string.Empty;

        public decimal AmountPaid { get; set; }

        public int HoursBeforeDeparture { get; set; }

        public int CancellationRuleId { get; set; }

        public string FeeType { get; set; } = string.Empty;

        public decimal FeeValue { get; set; }

        public decimal CancellationFee { get; set; }

        public decimal RefundAmount { get; set; }

        public bool CancellationAllowed { get; set; }

        public string Message { get; set; } = string.Empty;

        public decimal MinFee { get; set; }

        public bool IsCancellationAllowed { get; set; }

    }
}
