using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.Models;

public class Role
{
    [Key]
    public int RoleID { get; set; }

    [Required, MaxLength(50)]
    public string RoleName { get; set; } = string.Empty;

    public string? Description { get; set; }
}