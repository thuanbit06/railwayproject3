namespace RailAdmin.API.DTOs.Request.Refund;
using System.ComponentModel.DataAnnotations;


public class RefundProcessRequest
{
    [Required]
    public int RefundId { get; set; }
}
