namespace RailAdmin.API.DTOs.Request.CancellationRule;
using System.ComponentModel.DataAnnotations;


public class CancellationRequest
{
    [Required]
    [Range(1, int.MaxValue)]
    public int TicketId { get; set; }

    [MaxLength(500)]
    public string? CancelReason { get; set; }
}
