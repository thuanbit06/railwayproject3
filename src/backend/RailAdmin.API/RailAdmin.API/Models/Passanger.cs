using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("Passengers")] // ✅ Ánh xạ đúng tên bảng DB
public class Passenger
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Range(1, 120)]
    public int Age { get; set; }

    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? IDProofType { get; set; }

    [MaxLength(50)]
    public string? IDProofNo { get; set; }

    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }
}