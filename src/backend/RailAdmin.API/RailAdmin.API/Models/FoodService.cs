using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class FoodService
{
    [Key]
    public int FoodServiceID { get; set; }

    [Required]
    public string ServiceName { get; set; } = string.Empty;

    public string MealType { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    public bool IsAvailable { get; set; } = true;
}