using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

// =========================================================
// 8. CANCELLATION RULE - Quy tắc phí hủy vé
// =========================================================
[Table("CancellationRules")]
public class CancellationRule
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int HoursBeforeDeparture { get; set; }

    [Required, MaxLength(10)]
    public string FeeType { get; set; } = "PERCENTAGE"; // PERCENTAGE / FLAT

    [Column(TypeName = "decimal(10,2)")]
    public decimal FeeValue { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal MinFee { get; set; } = 0;
}