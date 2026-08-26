using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Ticket;

public class TicketCreateRequest
{
    [Required, MaxLength(10)]
    public string PNR { get; set; } = string.Empty;

    public int? SeatId { get; set; }

    [Required, MaxLength(100)]
    public string PassengerName { get; set; } = string.Empty;

    [Required, Range(0, 120)]
    public int Age { get; set; }

    [Required, MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [Required, Range(0, double.MaxValue)]
    public decimal Fare { get; set; }
}