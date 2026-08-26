using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Seat;

public class SeatUpdateRequest
{
    [Required, MaxLength(10)]
    public string SeatNo { get; set; } = string.Empty;
}