using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Waitlist;

public class WaitListCreateRequest
{
    [Required]
    public int TripId { get; set; }

    [Required]
    public int TicketId { get; set; }

    [Required, MaxLength(20)]
    public string RequestedClass { get; set; } = string.Empty;
}