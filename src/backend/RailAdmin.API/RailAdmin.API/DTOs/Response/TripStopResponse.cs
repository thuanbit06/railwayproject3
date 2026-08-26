namespace RailAdmin.API.DTOs.Response
{
    public class TripStopResponse
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public int StationId { get; set; }
        public int StopSequence { get; set; }
        public TimeSpan? ArrivalTime { get; set; }
        public TimeSpan? DepartureTime { get; set; }
    }
}
