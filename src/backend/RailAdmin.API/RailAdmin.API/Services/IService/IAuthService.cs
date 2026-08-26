using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Request.Otp;
using RailAdmin.API.DTOs.Request.User;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IAuthService
{
    // Register
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);

    // Login
    Task<AuthResponse?> LoginAsync(LoginRequest request);

    // Verify OTP
    Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request);

    // Get current user
    Task<UserResponse?> GetUserByIdAsync(int id);

    // Admin create user
    Task<AuthResponse?> CreateUserAsync(
        UserCreateRequest request,
        string adminEmail
    );
}