using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.User
{
    public class UserUpdateRequest
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Role { get; set; } = string.Empty;
    }
}
