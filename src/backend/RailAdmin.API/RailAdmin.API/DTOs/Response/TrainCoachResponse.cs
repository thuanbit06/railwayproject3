namespace RailAdmin.API.DTOs.Response;

public class TrainCoachResponse
{
    public int Id { get; set; }
    public int TrainId { get; set; }
    public string CoachNo { get; set; } = string.Empty;
    public string ClassType { get; set; } = string.Empty;
    public int TotalSeats { get; set; }
    public decimal FareMultiplier { get; set; }
}