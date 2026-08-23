using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("Reservations")] // ✅ Ánh xạ đúng tên bảng DB
public class Reservation
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }   // ✅ DB: Id (PK, Identity)

    [Required]
    [MaxLength(20)]
    public string PNR { get; set; } = string.Empty;   // ✅ DB: PNR (Unique)

    public int ScheduleId { get; set; }   // ✅ DB: ScheduleId (FK → Schedules.Id)

    public int PassengerId { get; set; }   // ✅ DB: PassengerId (FK → Passengers.Id)

    public DateTime JourneyDate { get; set; }   // ✅ DB: JourneyDate (DATE)

    [Required]
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;   // ✅ DB: BookingDate (DATETIME2)

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Confirmed";   // ✅ DB: Status (Default: 'Confirmed')

    public int BookedByUserId { get; set; }   // ✅ DB: BookedByUserId (FK → Users.Id)

    // ===============================
    // NAVIGATION PROPERTIES
    // ===============================

    [ForeignKey("ScheduleId")]
    public virtual Schedule? Schedule { get; set; }

    [ForeignKey("PassengerId")]
    public virtual Passenger? Passenger { get; set; }

    [ForeignKey("BookedByUserId")]
    public virtual User? BookedByUser { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}