using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Waitlist;

public class WaitListUpdateRequest
{
    [Required, MaxLength(20)]
    public string Status { get; set; } = string.Empty; // WAITING / CONFIRMED / EXPIRED

    public DateTime? ExpiresAt { get; set; }
}