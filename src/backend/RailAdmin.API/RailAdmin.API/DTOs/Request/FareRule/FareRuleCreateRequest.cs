using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.FareRule
{
    public class FareRuleCreateRequest
    {
        [Required, MaxLength(20)]
        public string SeatClass { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string TrainType { get; set; } = string.Empty;

        [Required, Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }
    }
}
