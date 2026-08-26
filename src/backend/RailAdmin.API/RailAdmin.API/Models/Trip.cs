using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models
{
// =========================================================
// 5. TRIP - Một chuyến chạy cụ thể (theo ngày)
// =========================================================
[Table("Trips")]
    public class Trip
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int TrainId { get; set; }

        [Required]
        public int FromStationId { get; set; }

        [Required]
        public int ToStationId { get; set; }

        [Required]
        public DateTime JourneyDate { get; set; }

        [Required]
        public TimeSpan DepartureTime { get; set; }

        [Required]
        public TimeSpan ArrivalTime { get; set; }

        [MaxLength(20)]
        public string Status { get; set; } = "Scheduled"; // Scheduled / Departed / Arrived / Cancelled

        public int TotalCapacity { get; set; }

        public int AvailableSeats { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(TrainId))]
        public virtual Train? Train { get; set; }

        [ForeignKey(nameof(FromStationId))]
        public virtual Station? FromStation { get; set; }

        [ForeignKey(nameof(ToStationId))]
        public virtual Station? ToStation { get; set; }

        public virtual ICollection<TripStop>? Stops { get; set; }
    }

}
