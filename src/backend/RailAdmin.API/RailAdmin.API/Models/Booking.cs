using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models
{
    // =========================================================
    // 10. BOOKING - Đơn đặt vé (PNR)
    // =========================================================
    [Table("Bookings")]
    public class Booking
    {
        [Key]
        [MaxLength(10)]
        public string PNR { get; set; } = string.Empty;

        [Required]
        public int UserId { get; set; }

        [Required]
        public int TripId { get; set; }

        [Required]
        public int TotalPassengers { get; set; }

        [Required]
        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; }

        [MaxLength(20)]
        public string BookingStatus { get; set; } = "Pending"; // Confirmed / PartiallyCancelled / Cancelled

        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }

        [ForeignKey(nameof(TripId))]
        public virtual Trip? Trip { get; set; }

        public virtual ICollection<Ticket>? Tickets { get; set; }
    }

}
