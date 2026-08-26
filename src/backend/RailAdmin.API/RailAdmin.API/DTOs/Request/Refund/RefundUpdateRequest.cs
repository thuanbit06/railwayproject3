using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Refund
{
    public class RefundUpdateRequest
    {
        [Required, MaxLength(20)]
        public string RefundStatus { get; set; } = string.Empty; // PENDING / PROCESSED / FAILED
    }
}
