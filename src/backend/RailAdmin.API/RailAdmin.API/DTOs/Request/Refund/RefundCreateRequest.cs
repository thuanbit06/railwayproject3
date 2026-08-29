using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Refund;

public class RefundCreateRequest
{
    [Required]
    [Range(1, int.MaxValue)]
    public int TicketId { get; set; }
    public int? CancellationRuleId { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? AmountPaid { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? CancellationFee { get; set; }
}
