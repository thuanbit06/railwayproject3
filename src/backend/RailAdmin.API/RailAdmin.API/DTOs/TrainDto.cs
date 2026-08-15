namespace RailAdmin.API.DTOs;

public class TrainDto
{
    public int Id { get; set; }

    public string TrainNo { get; set; } = string.Empty;

    public string TrainName { get; set; } = string.Empty;

    public string FromStation { get; set; } = string.Empty;

    public string ToStation { get; set; } = string.Empty;

    public string DepartureTime { get; set; } = string.Empty;

    public string ArrivalTime { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;
}