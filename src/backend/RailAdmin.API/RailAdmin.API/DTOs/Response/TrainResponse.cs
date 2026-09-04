using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Response;

public class TrainResponse
{
    public int Id { get; set; }

    public string TrainNo { get; set; } = string.Empty;

    public string TrainName { get; set; } = string.Empty;

    public string TrainType { get; set; } = string.Empty;

    [Range(1, 100)]
    public int TotalCoaches { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}