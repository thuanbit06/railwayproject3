namespace RailAdmin.API.Models;

public class Ticket
{
    public int Id { get; set; }
    public string PNR { get; set; } = string.Empty;
    public string TrainNo { get; set; } = string.Empty;
    public string TrainName { get; set; } = string.Empty;
    public string FromStation { get; set; } = string.Empty;
    public string ToStation { get; set; } = string.Empty;
    public DateTime JourneyDate { get; set; }
    public string PassengerName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Seat { get; set; } = string.Empty;
    public string Coach { get; set; } = string.Empty;
    public decimal Fare { get; set; }
    public string Status { get; set; } = "Confirmed";
    public string? CancelReason { get; set; }

    public DateTime? CancelledAt { get; set; }
}