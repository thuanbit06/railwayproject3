using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class Seat
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CoachId { get; set; } // FK đến Coach (nếu có)

    [Required]
    [MaxLength(5)]
    public string SeatNo { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string ClassType { get; set; } = "Economy"; // 2AC, SL, Hard Sleeper...

    public bool IsBooked { get; set; } = false;

    public DateTime? BookedUntil { get; set; }

    // Navigation
    [ForeignKey("CoachId")]
    public virtual Coach? Coach { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}