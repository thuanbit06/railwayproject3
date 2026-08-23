using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("Coaches")] // ✅ Ánh xạ đúng tên bảng DB
public class Coach
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }   // ✅ DB: Id (PK, Identity)

    [Required]
    public int TrainId { get; set; }   // ✅ DB: TrainId (FK → Trains.Id)

    [Required]
    [MaxLength(10)]
    public string CoachNo { get; set; } = string.Empty;   // ✅ DB: CoachNo

    [Required]
    [MaxLength(20)]
    public string ClassType { get; set; } = string.Empty;   // ✅ DB: ClassType

    [Required]
    public int TotalSeats { get; set; }   // ✅ DB: TotalSeats

    [Column(TypeName = "decimal(4,2)")]
    public decimal FareMultiplier { get; set; } = 1.0m;   // ✅ DB: FareMultiplier

    // ✅ Navigation Properties
    [ForeignKey("TrainId")]
    public virtual Train? Train { get; set; }

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}