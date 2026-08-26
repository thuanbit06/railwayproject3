using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Trip
{
    public class TripUpdateRequest
    {
        [Required]
        public DateTime JourneyDate { get; set; }

        [Required]
        public TimeSpan DepartureTime { get; set; }

        [Required]
        public TimeSpan ArrivalTime { get; set; }

        [Required, MaxLength(20)]
        public string Status { get; set; } = string.Empty;

        [Required]
        public int TotalCapacity { get; set; }

        [Required]
        public int AvailableSeats { get; set; }
    }
}
