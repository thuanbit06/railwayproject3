using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Coach;

public class TrainCoachUpdateRequest
{
    [Required, MaxLength(20)]
    public string ClassType { get; set; } = string.Empty;

    [Required, Range(1, 200)]
    public int TotalSeats { get; set; }

    [Range(0.1, 10)]
    public decimal FareMultiplier { get; set; }
}