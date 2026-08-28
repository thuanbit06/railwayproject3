using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Refund;

public class RefundCreateRequest
{
    [Required]
    [Range(1, int.MaxValue)]
    public int TicketId { get; set; }
}
