namespace RailAdmin.API.Models;

public class Train
{
    public int Id { get; set; }
    public string TrainNo { get; set; } = string.Empty;
    public string TrainName { get; set; } = string.Empty;
    public string FromStation { get; set; } = string.Empty;
    public string ToStation { get; set; } = string.Empty;
    public TimeSpan DepartureTime { get; set; }
    public TimeSpan ArrivalTime { get; set; }
    public string Status { get; set; } = "On Time";
}