namespace RailAdmin.API.DTOs.Response
{
    public class TicketAdminResponseDto
    {
        public int Id { get; set; }
        public string Pnr { get; set; } = string.Empty;
        public string PassengerName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
        public int? SeatId { get; set; }
        public string SeatNo { get; set; } = "N/A";
        public string CoachNo { get; set; } = "N/A";
        public decimal Fare { get; set; }
        public string Status { get; set; } = string.Empty;

        // Thông tin chuyến đi từ Trip & Train
        public string TrainName { get; set; } = "N/A";
        public string TrainNo { get; set; } = "N/A";
        public string FromStation { get; set; } = "N/A";
        public string ToStation { get; set; } = "N/A";
        public DateTime? JourneyDate { get; set; }
        public TimeSpan? DepartureTime { get; set; }

        // Thông tin người đặt
        public string BookingStatus { get; set; } = "N/A";
        public string BookedBy { get; set; } = "N/A";
    }

}