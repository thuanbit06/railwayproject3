using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Ticket;

public class TicketUpdateRequest
{
    public int? SeatId { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = string.Empty; // Confirmed / Waiting / Cancelled

    [MaxLength(500)]
    public string? CancelReason { get; set; }
}