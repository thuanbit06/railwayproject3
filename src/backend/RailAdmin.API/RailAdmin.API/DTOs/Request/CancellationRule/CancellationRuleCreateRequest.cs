using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.CancellationRule
{
    public class CancellationRuleCreateRequest
    {
        [Required, Range(0, 1000)]
        public int HoursBeforeDeparture { get; set; }

        [Required, MaxLength(10)]
        public string FeeType { get; set; } = "PERCENTAGE"; // PERCENTAGE / FLAT

        [Required, Range(0, double.MaxValue)]
        public decimal FeeValue { get; set; }

        [Range(0, double.MaxValue)]
        public decimal MinFee { get; set; } = 0;
    }
}
