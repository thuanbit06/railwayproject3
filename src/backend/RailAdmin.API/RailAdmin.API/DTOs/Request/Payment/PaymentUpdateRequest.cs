using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Payment;

public class PaymentUpdateRequest
{
    [Required, MaxLength(20)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? TransactionId { get; set; }
}