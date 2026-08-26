using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

// =========================================================
// 2. TRAIN - Thông tin tàu (tĩnh)
// =========================================================
[Table("Trains")]
public class Train
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required, MaxLength(10)]
    public string TrainNo { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string TrainName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string TrainType { get; set; } = string.Empty;

    public int TotalCoaches { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual ICollection<TrainCoach>? Coaches { get; set; }
}