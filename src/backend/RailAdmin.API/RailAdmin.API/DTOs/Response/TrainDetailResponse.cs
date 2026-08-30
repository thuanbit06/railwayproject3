namespace RailAdmin.API.DTOs.Response;

public class TrainDetailResponse
{
    public int Id { get; set; }

    public string TrainNo { get; set; } = string.Empty;

    public string TrainName { get; set; } = string.Empty;

    public string TrainType { get; set; } = string.Empty;

    public int TotalCoaches { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<TrainCoachResponse> Coaches { get; set; } = new();
}

