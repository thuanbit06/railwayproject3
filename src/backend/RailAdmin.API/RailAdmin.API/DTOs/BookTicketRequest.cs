namespace RailAdmin.API.DTOs
{
    public class BookTicketRequest
    {
        public int ScheduleId { get; set; }
        public int PassengerId { get; set; }
        public int SeatId { get; set; }
        public DateTime JourneyDate { get; set; }
        public string CoachClass { get; set; } = "Economy";
        public decimal Fare { get; set; }
        public int UserId { get; set; }
    }
}
