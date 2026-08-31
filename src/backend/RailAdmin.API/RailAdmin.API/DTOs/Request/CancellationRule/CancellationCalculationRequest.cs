using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.CancellationRule;

public class CancellationCalculationRequest
{
    [Required]
    [Range(1, int.MaxValue)]
    public int TicketId { get; set; }

    [Required]
    public string PNR { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal AmountPaid { get; set; }

    [Required]
    public DateTime DepartureTime { get; set; }

    public decimal fare { get; internal set; }

    public int hoursBeforeDeparture { get; set; }
}