using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Payment;

public class PaymentCreateRequest
{
    [Required, MaxLength(10)]
    public string PNR { get; set; } = string.Empty;

    [Required, Range(0, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required, MaxLength(20)]
    public string Method { get; set; } = string.Empty; // Cash / Online / Card
}