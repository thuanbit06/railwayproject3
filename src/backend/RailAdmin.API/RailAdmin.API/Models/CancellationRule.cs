using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class CancellationRule
{
    [Key]
    public int RuleID { get; set; }

    public int HoursBeforeDeparture { get; set; }

    [Required]
    public string CancellationFeeType { get; set; } = "PERCENTAGE"; // PERCENTAGE / FLAT

    [Column(TypeName = "decimal(10,2)")]
    public decimal FeeValue { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal MinFee { get; set; } = 0;

    public string? CoachType { get; set; } // NULL = áp dụng chung
}