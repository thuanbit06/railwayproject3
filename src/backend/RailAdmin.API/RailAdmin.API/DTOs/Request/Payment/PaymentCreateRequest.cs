using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Payment;

public class PaymentCreateRequest
{
    [Required]
    [MaxLength(10)]
    public string PNR { get; set; } = string.Empty;

    [Required]
    [Range(typeof(decimal), "0.01", "9999999999.99")]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(20)]
    public string Method { get; set; } = string.Empty;
}