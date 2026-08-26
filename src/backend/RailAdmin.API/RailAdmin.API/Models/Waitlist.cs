using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

// =========================================================
// 14. WAITLIST - Danh sách chờ khi hết chỗ
// =========================================================
[Table("WaitLists")]
public class WaitList
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int TripId { get; set; }

    [Required]
    public int TicketId { get; set; }

    [MaxLength(20)]
    public string RequestedClass { get; set; } = "Economy";

    [Required]
    public int Position { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "WAITING"; // WAITING / CONFIRMED / EXPIRED

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ExpiresAt { get; set; }

    [ForeignKey(nameof(TripId))]
    public virtual Trip? Trip { get; set; }

    [ForeignKey(nameof(TicketId))]
    public virtual Ticket? Ticket { get; set; }
}