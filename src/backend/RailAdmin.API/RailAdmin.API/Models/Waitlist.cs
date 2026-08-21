using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class WaitList
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string PNR { get; set; } = string.Empty;

    [Required]
    public int ScheduleId { get; set; }

    [Required]
    public int PassengerId { get; set; }

    [Required]
    [MaxLength(20)]
    public string RequestedClass { get; set; } = "Economy";

    [Required]
    public int Position { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "WAITING";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ExpiresAt { get; set; }

    public DateTime? NotifiedAt { get; set; }

    // ✅ Navigation Properties (RẤT QUAN TRỌNG)
    [ForeignKey("ScheduleId")]
    public virtual Schedule? Schedule { get; set; }

    [ForeignKey("PassengerId")]
    public virtual Passenger? Passenger { get; set; }
}