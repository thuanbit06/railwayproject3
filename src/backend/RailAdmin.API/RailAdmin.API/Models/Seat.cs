using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

// =========================================================
// 4. SEAT - Ghế / giường vật lý
// =========================================================
[Table("Seats")]
public class Seat
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int CoachId { get; set; }

    [Required, MaxLength(10)]
    public string SeatNo { get; set; } = string.Empty;

    [ForeignKey(nameof(CoachId))]
    public virtual TrainCoach? Coach { get; set; }
}