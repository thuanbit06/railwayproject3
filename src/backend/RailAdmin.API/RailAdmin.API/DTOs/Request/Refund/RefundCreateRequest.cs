using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Refund
{
    public class RefundCreateRequest
    {
        [Required]
        public int TicketId { get; set; }

        public int? CancellationRuleId { get; set; }

        [Required, Range(0, double.MaxValue)]
        public decimal AmountPaid { get; set; }

        [Required, Range(0, double.MaxValue)]
        public decimal CancellationFee { get; set; }
    }
}
