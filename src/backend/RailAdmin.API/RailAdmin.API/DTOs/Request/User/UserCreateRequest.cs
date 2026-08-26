using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.User
{
    public class UserCreateRequest
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty; // sẽ được hash ở service, không lưu trực tiếp

        [MaxLength(20)]
        public string Role { get; set; } = "User";
    }
}
