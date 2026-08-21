using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class Ticket
{
    [Key]
    public int Id { get; set; }   // ✅ DB: Id (PK)

    [Required]
    [MaxLength(20)]
    public string PNR { get; set; } = string.Empty;   // ✅ DB: PNR (Unique)

    [Required]
    public int ReservationId { get; set; }   // ✅ DB: ReservationId

    [Required]
    public int SeatId { get; set; }   // ✅ DB: SeatId

    [Required]
    [MaxLength(20)]
    public string CoachClass { get; set; } = string.Empty;   // ✅ DB: CoachClass

    [Column(TypeName = "decimal(10,2)")]
    public decimal Fare { get; set; }   // ✅ DB: Fare

    [Column(TypeName = "decimal(10,2)")]
    public decimal GSTAmount { get; set; } = 0;   // ✅ DB: GSTAmount

    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalAmount { get; set; }   // ✅ DB: TotalAmount

    [MaxLength(20)]
    public string PaymentStatus { get; set; } = "Paid";   // ✅ DB: PaymentStatus

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;   // ✅ DB: IssuedAt

    // Navigation Properties
    [ForeignKey("ReservationId")]
    public virtual Reservation? Reservation { get; set; }

    [ForeignKey("SeatId")]
    public virtual Seat? Seat { get; set; }
}