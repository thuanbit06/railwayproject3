using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

// =========================================================
// 11. TICKET - Vé của từng hành khách trong 1 Booking
// =========================================================
[Table("Tickets")]
public class Ticket
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required, MaxLength(10)]
    public string PNR { get; set; } = string.Empty;

    public int? SeatId { get; set; }

    [Required, MaxLength(100)]
    public string PassengerName { get; set; } = string.Empty;

    [Required]
    public int Age { get; set; }

    [Required, MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(12,2)")]
    public decimal Fare { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Confirmed"; // Confirmed / Waiting / Cancelled

    public string? CancelReason { get; set; }

    public DateTime? CancelledAt { get; set; }

    [ForeignKey(nameof(PNR))]
    public virtual Booking? Booking { get; set; }

    [ForeignKey(nameof(SeatId))]
    public virtual Seat? Seat { get; set; }
}
