namespace RailAdmin.API.DTOs.Response;

public class PaymentResponse
{
    public int Id { get; set; }
    public string PNR { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public DateTime PaidAt { get; set; }
}