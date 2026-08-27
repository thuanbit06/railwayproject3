// File: DTOs/UserCreateRequest.cs
using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.User;

public class UserCreateRequest
{
    [Required(ErrorMessage = "Tên không được để trống.")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống.")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role không được để trống.")]
    public string Role { get; set; } = "User"; // Admin / User / Staff
}