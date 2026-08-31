namespace RailAdmin.API.DTOs.Response;

public class CancellationFeeResult
{
    public int? CancellationRuleId { get; set; }

    public decimal AmountPaid { get; set; }

    public decimal CancellationFee { get; set; }

    public decimal RefundAmount { get; set; }

    public int HoursBeforeDeparture { get; set; }
}