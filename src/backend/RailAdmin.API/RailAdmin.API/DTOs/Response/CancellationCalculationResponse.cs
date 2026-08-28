namespace RailAdmin.API.DTOs.Response;

public class CancellationCalculationResponse
{
    public int TicketId { get; set; }

    public string PNR { get; set; } = string.Empty;

    public decimal Fare { get; set; }

    public DateTime DepartureTime { get; set; }

    public DateTime CancellationTime { get; set; }

    public decimal HoursBeforeDeparture { get; set; }

    public bool CanCancel { get; set; }

    public string? RejectReason { get; set; }

    public int? CancellationRuleId { get; set; }

    public string? FeeType { get; set; }

    public decimal FeeValue { get; set; }

    public decimal MinFee { get; set; }

    public decimal CancellationFee { get; set; }

    public decimal RefundAmount { get; set; }
}