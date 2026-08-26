namespace RailAdmin.API.DTOs.Response
{
    public class RefundResponse
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public int? CancellationRuleId { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal CancellationFee { get; set; }
        public decimal RefundAmount { get; set; }
        public string RefundStatus { get; set; } = string.Empty;
        public DateTime RefundDate { get; set; }
    }
}
