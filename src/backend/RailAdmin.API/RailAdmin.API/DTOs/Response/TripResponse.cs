namespace RailAdmin.API.DTOs.Response
{
    public class TripResponse
    {
        public int Id { get; set; }
        public int TrainId { get; set; }
        public int FromStationId { get; set; }
        public int ToStationId { get; set; }
        public DateTime JourneyDate { get; set; }
        public TimeSpan DepartureTime { get; set; }
        public TimeSpan ArrivalTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int TotalCapacity { get; set; }
        public int AvailableSeats { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
