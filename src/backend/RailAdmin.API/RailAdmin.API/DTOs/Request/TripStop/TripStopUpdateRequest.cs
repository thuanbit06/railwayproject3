using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.TripStop
{
    public class TripStopUpdateRequest
    {
        [Required]
        public int StopSequence { get; set; }

        public TimeSpan? ArrivalTime { get; set; }

        public TimeSpan? DepartureTime { get; set; }
    }

}
