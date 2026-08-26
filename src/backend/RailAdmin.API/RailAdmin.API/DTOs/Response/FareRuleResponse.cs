namespace RailAdmin.API.DTOs.Response
{
    public class FareRuleResponse
    {
        public int Id { get; set; }
        public string SeatClass { get; set; } = string.Empty;
        public string TrainType { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
