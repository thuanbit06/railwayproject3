using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Seat;

public class SeatCreateRequest
{
    public int CoachId { get; set; }

    public string SeatNo { get; set; } = string.Empty;

    public string? BerthType { get; set; }
}