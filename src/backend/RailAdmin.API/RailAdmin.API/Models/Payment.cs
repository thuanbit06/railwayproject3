using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

// =========================================================
// 12. PAYMENT - Thanh toán theo Booking
// =========================================================
[Table("Payments")]
public class Payment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required, MaxLength(10)]
    public string PNR { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(12,2)")]
    public decimal Amount { get; set; }

    [Required, MaxLength(20)]
    public string Method { get; set; } = "Online"; // Cash / Online / Card

    [MaxLength(20)]
    public string Status { get; set; } = "Success"; // Success / Failed / Pending

    [MaxLength(100)]
    public string? TransactionId { get; set; }

    public DateTime PaidAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(PNR))]
    public virtual Booking? Booking { get; set; }
}