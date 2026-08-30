using System.ComponentModel.DataAnnotations;
using RailAdmin.API.Validators;

namespace RailAdmin.API.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "Tên không được để trống.")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống.")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu không được để trống.")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên.")]
    [AlphaNumeric(ErrorMessage = "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số.")]
    public string Password { get; set; } = string.Empty;
}