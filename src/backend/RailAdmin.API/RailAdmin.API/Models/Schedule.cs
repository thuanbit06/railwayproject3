using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class Schedule
{
    [Key]
    public int Id { get; set; }   // ✅ ĐÚNG: DB là [Schedules].[Id]

    // FK đến Trains
    [Required]
    public int TrainId { get; set; }

    // FK đến Stations
    [Required]
    public int FromStationId { get; set; }

    [Required]
    public int ToStationId { get; set; }

    // Thời gian
    [Required]
    public TimeSpan DepartureTime { get; set; }

    [Required]
    public TimeSpan ArrivalTime { get; set; }

    [Column(TypeName = "decimal(8,2)")]
    public decimal DistanceKm { get; set; }

    [MaxLength(20)]
    public string DaysOfWeek { get; set; } = "MTWTFSS";

    public bool IsActive { get; set; } = true;

    // Navigation Properties
    [ForeignKey("TrainId")]
    public virtual Train? Train { get; set; }

    [ForeignKey("FromStationId")]
    public virtual Station? FromStation { get; set; }

    [ForeignKey("ToStationId")]
    public virtual Station? ToStation { get; set; }

    public virtual ICollection<ScheduleStop> Stops { get; set; } = new List<ScheduleStop>();
    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}