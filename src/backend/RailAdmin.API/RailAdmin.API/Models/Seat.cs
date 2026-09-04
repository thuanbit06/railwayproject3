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

    /// <summary>
    /// Số ghế (ví dụ: 1, 2, 12A, 15B...)
    /// </summary>
    [Required, MaxLength(10)]
    public string SeatNo { get; set; } = string.Empty;

    /// <summary>
    /// Loại berth (nếu có): Lower / Middle / Upper / SideLower / SideUpper...
    /// Có thể để null nếu ghế thường không phân biệt berth.
    /// </summary>
    [MaxLength(20)]
    public string? BerthType { get; set; }

    // =====================================================
    // NAVIGATION
    // =====================================================

    [ForeignKey(nameof(CoachId))]
    public virtual TrainCoach? Coach { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}