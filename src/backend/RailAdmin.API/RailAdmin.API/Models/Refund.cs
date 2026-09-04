using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace RailAdmin.API.Models;

[Index(nameof(IdempotencyKey), IsUnique = true)]
[Index(nameof(RefundTransactionId), IsUnique = true, Name = "UX_Refund_RefundTransactionId", AllDescending = false)]
[Table("Refunds")]
public class Refund
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int TicketId { get; set; }

    [Required]
    public int PaymentId { get; set; }

    public int? CancellationRuleId { get; set; }

    [Column(TypeName = "decimal(12,2)")]
    public decimal? AmountPaid { get; set; }

    [Column(TypeName = "decimal(12,2)")]
    public decimal? CancellationFee { get; set; }

    [Column(TypeName = "decimal(12,2)")]
    public decimal? RefundAmount { get; set; }

    [Required]
    [MaxLength(20)]
    public string RefundStatus { get; set; } = "PENDING";

    [Required]
    [MaxLength(100)]
    public string IdempotencyKey { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? RefundTransactionId { get; set; }

    [MaxLength(500)]
    public string? FailureReason { get; set; }

    public DateTime RefundDate { get; set; } = DateTime.UtcNow;

    public DateTime? ProcessedAt { get; set; }

    public int RetryCount { get; set; }

    [ForeignKey(nameof(TicketId))]
    public virtual Ticket? Ticket { get; set; }

    [ForeignKey(nameof(CancellationRuleId))]
    public virtual CancellationRule? CancellationRule { get; set; }
}