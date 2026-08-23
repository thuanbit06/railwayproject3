using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class Refund
{
    [Key]
    public int RefundID { get; set; }

    public int TicketID { get; set; }

    public int? PaymentID { get; set; }

    public int? CancellationRuleID { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalAmountPaid { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal CancellationFee { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal RefundAmount { get; set; }

    public string RefundStatus { get; set; } = "PENDING"; // PENDING / PROCESSED / FAILED

    public DateTime RefundDate { get; set; } = DateTime.UtcNow;

    public int? ProcessedBy { get; set; }

    public string? Reason { get; set; }

    // Navigation
    [ForeignKey("TicketID")]
    public Ticket? Ticket { get; set; }
}