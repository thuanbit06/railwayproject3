using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs;

public class CreateSupportTicketRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Category { get; set; } = "General";

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    public string Message { get; set; } = string.Empty;

    public int? UserId { get; set; }
}