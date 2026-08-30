using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Train;

public class TrainCreateRequest
{
    [Required]
    [MaxLength(10)]
    public string TrainNo { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string TrainName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string TrainType { get; set; } = string.Empty;

    public int TotalCoaches { get; set; }

    public bool IsActive { get; set; } = true;
}