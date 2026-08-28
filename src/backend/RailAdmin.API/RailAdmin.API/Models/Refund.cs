using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("Refunds")]
public class Refund
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int TicketId { get; set; }

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

    public DateTime RefundDate { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(TicketId))]
    public virtual Ticket? Ticket { get; set; }

    [ForeignKey(nameof(CancellationRuleId))]
    public virtual CancellationRule? CancellationRule { get; set; }
}