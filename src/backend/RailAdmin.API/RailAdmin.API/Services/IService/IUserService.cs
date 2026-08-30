using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Request.User;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IUserService
{
    Task<UserResponse?> GetAllUsersAsync();
    Task<AuthResponse?> CreateUserAsync(UserCreateRequest req, string adminEmail);
    Task<AuthResponse?> UpdateUserAsync(int id, UserCreateRequest req);
    Task<AuthResponse?> DeleteUserAsync(int id);
}