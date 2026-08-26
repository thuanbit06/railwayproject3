using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Booking
{
    public class BookingUpdateRequest
    {
        [Required, MaxLength(20)]
        public string BookingStatus { get; set; } = string.Empty; // Confirmed / PartiallyCancelled / Cancelled
    }
}
