// DTOs/PnrStatusDto.cs
using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs;

public class PnrStatusDto
{
    public string PnrNumber { get; set; } = string.Empty;
    public string TrainNo { get; set; } = string.Empty;
    public string TrainName { get; set; } = string.Empty;
    public string FromStation { get; set; } = string.Empty;
    public string ToStation { get; set; } = string.Empty;
    public string DateOfJourney { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Confirmed / RAC / Waiting / Cancelled
    public int TotalPassengers { get; set; }
    public int ConfirmedCount { get; set; }
    public int WaitingCount { get; set; }
    public List<PnrPassengerDto> Passengers { get; set; } = new();
}

public class PnrPassengerDto
{
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string SeatNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // CNF / RAC / WL/12
}