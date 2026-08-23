using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("Trains")]
public class Train
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(10)]
    public string TrainNo { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string TrainName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string TrainType { get; set; } = string.Empty;

    public int TotalCoaches { get; set; } = 12;

    public int? MaxSpeed { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
}