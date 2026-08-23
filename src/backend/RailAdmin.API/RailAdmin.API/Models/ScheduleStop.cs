using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class ScheduleStop
{
    [Key]
    public int StopID { get; set; }   // ✅ ĐÚNG: DB là StopID

    [Required]
    public int ScheduleID { get; set; }   // ✅ ĐÚNG: DB là ScheduleID

    [Required]
    public int StationID { get; set; }    // ✅ ĐÚNG: DB là StationID

    [Required]
    public int StopSequence { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal DistanceFromOrigin { get; set; } = 0;

    public TimeSpan? ArrivalTime { get; set; }

    public TimeSpan? DepartureTime { get; set; }

    public int? HaltDurationMinutes { get; set; } = 0;

    // Navigation
    [ForeignKey("ScheduleID")]
    public virtual Schedule? Schedule { get; set; }

    [ForeignKey("StationID")]
    public virtual Station? Station { get; set; }
}