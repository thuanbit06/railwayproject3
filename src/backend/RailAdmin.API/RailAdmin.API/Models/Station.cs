using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("Stations")] // ✅ Ánh xạ đúng tên bảng DB
public class Station
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }   // ✅ DB: Id (PK, Identity)

    [Required]
    [MaxLength(10)]
    public string Code { get; set; } = string.Empty;   // ✅ DB: Code (UNIQUE)

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;   // ✅ DB: Name

    [Required]
    [MaxLength(50)]
    public string City { get; set; } = string.Empty;   // ✅ DB: City

    [MaxLength(50)]
    public string? State { get; set; }   // ✅ DB: State (nullable)

    [Required]
    public int PlatformCount { get; set; } = 1;   // ✅ DB: PlatformCount (default 1)

    [Column(TypeName = "decimal(10,7)")]
    public decimal? Latitude { get; set; }   // ✅ DB: Latitude (nullable)

    [Column(TypeName = "decimal(10,7)")]
    public decimal? Longitude { get; set; }   // ✅ DB: Longitude (nullable)

    [Required]
    public bool IsActive { get; set; } = true;   // ✅ DB: IsActive (BIT, default 1)

    // ✅ Navigation Properties
    public virtual ICollection<ScheduleStop> Stops { get; set; } = new List<ScheduleStop>();
}