using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

[Table("TrainOperatingDays")]
public class TrainOperatingDay
{
    [Column("TrainID")]
    public int TrainID { get; set; }

    [Column("DayOfWeek")]
    public int DayOfWeek { get; set; } // 1=Monday ... 7=Sunday

    [Column("IsActive")]
    public bool IsActive { get; set; } = true;

    [ForeignKey(nameof(TrainID))]
    public Train? Train { get; set; }
}