using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class UserRole
{
    [Key]
    public int Id { get; set; } // Dùng Id thay vì composite key cho dễ EF

    public int UserID { get; set; }

    public int RoleID { get; set; }

    public DateTime AssignedDate { get; set; } = DateTime.UtcNow;

    [ForeignKey("UserID")]
    public User? User { get; set; }

    [ForeignKey("RoleID")]
    public Role? Role { get; set; }
}