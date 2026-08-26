using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.FareRule
{
    public class FareRuleUpdateRequest
    {
        [Required, Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        public bool IsActive { get; set; }
    }
}
