using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Coach;

public class TrainCoachCreateRequest
{
    [Required]
    public int TrainId { get; set; }

    [Required, MaxLength(10)]
    public string CoachNo { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string ClassType { get; set; } = string.Empty;

    [Required, Range(1, 200)]
    public int TotalSeats { get; set; }

    [Range(0.1, 10)]
    public decimal FareMultiplier { get; set; } = 1.0m;
}