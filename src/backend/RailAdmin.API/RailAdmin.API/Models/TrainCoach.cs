using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

// =========================================================
// 3. TRAIN COACH - Toa tàu
// =========================================================
[Table("Coaches")]
public class TrainCoach
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int TrainId { get; set; }

    [Required, MaxLength(10)]
    public string CoachNo { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string ClassType { get; set; } = string.Empty; // VD: SOFT_SEAT_AC, SLEEPER_4

    [Required]
    public int TotalSeats { get; set; }

    [Column(TypeName = "decimal(4,2)")]
    public decimal FareMultiplier { get; set; } = 1.0m;

    [ForeignKey(nameof(TrainId))]
    public virtual Train? Train { get; set; }

    public virtual ICollection<Seat>? Seats { get; set; }
}