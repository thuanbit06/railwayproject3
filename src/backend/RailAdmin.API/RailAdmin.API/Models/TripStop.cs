using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models
{
    // =========================================================
    // 6. TRIP STOP - Ga dừng dọc đường (phục vụ tính giá theo chặng)
    // =========================================================
    [Table("TripStops")]
    public class TripStop
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int TripId { get; set; }

        [Required]
        public int StationId { get; set; }

        [Required]
        public int StopSequence { get; set; }

        public TimeSpan? ArrivalTime { get; set; }

        public TimeSpan? DepartureTime { get; set; }

        [ForeignKey(nameof(TripId))]
        public virtual Trip? Trip { get; set; }

        [ForeignKey(nameof(StationId))]
        public virtual Station? Station { get; set; }
    }
}
