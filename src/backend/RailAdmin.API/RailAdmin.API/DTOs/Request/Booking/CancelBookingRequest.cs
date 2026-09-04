using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Booking;

public class CancelBookingRequest
{
    [MaxLength(500)]
    public string? Reason { get; set; }
}