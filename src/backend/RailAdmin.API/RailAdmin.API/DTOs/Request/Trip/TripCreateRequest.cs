using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Trip
{
    public class TripCreateRequest
    {
        [Required]
        public int TrainId { get; set; }

        [Required]
        public int FromStationId { get; set; }

        [Required]
        public int ToStationId { get; set; }

        [Required]
        public DateTime JourneyDate { get; set; }

        [Required]
        public TimeSpan DepartureTime { get; set; }

        [Required]
        public TimeSpan ArrivalTime { get; set; }

        [Required]
        public int TotalCapacity { get; set; }
    }
}
