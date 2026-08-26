namespace RailAdmin.API.DTOs.Response
{
    public class BookingResponse
    {
        public string PNR { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int TripId { get; set; }
        public int TotalPassengers { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
    }
}
