using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Seat;

public class SeatCreateRequest
{
    [Required]
    public int CoachId { get; set; }

    [Required, MaxLength(10)]
    public string SeatNo { get; set; } = string.Empty;
}