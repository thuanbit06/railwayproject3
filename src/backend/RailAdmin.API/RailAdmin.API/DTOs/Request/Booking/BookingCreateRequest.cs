using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Booking
{
    public class BookingCreateRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int TripId { get; set; }

        [Required, Range(1, 20)]
        public int TotalPassengers { get; set; }
    }
}
