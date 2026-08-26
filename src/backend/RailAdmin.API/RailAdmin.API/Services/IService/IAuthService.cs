using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
}