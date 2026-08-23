using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("SupportTickets")]
public class SupportTicket
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Category { get; set; } = "General";

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    public string Status { get; set; } = "Open"; // Open, InProgress, Resolved, Closed

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }

    // Optional: link to User if logged in
    public int? UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}