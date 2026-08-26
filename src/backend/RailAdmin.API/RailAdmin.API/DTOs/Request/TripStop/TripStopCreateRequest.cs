using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.TripStop
{
    public class TripStopCreateRequest
    {
        [Required]
        public int TripId { get; set; }

        [Required]
        public int StationId { get; set; }

        [Required]
        public int StopSequence { get; set; }

        public TimeSpan? ArrivalTime { get; set; }

        public TimeSpan? DepartureTime { get; set; }
    }
}
