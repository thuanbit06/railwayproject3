using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Otp;

public class VerifyOtpRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(6, MinimumLength = 6)]
    public string Otp { get; set; } = string.Empty;
}