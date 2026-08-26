namespace RailAdmin.API.DTOs.Response
{
    public class CancellationRuleResponse
    {
        public int Id { get; set; }
        public int HoursBeforeDeparture { get; set; }
        public string FeeType { get; set; } = string.Empty;
        public decimal FeeValue { get; set; }
        public decimal MinFee { get; set; }
    }
}
