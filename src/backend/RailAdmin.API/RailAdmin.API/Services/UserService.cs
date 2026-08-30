using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Request.User;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserResponse?> GetAllUsersAsync()
    {
        // Trả về list users (tuỳ bạn định nghĩa DTO list)
        return null; // tạm thời
    }

    public async Task<AuthResponse?> CreateUserAsync(UserCreateRequest req, string adminEmail)
    {
        // Logic tạo user (hoặc gọi AuthService nếu muốn)
        return new AuthResponse
        {
            Success = false,
            Message = "Chưa implement."
        };
    }

    public async Task<AuthResponse?> UpdateUserAsync(int id, UserCreateRequest req)
    {
        return new AuthResponse
        {
            Success = false,
            Message = "Chưa implement."
        };
    }

    public async Task<AuthResponse?> DeleteUserAsync(int id)
    {
        return new AuthResponse
        {
            Success = false,
            Message = "Chưa implement."
        };
    }
}