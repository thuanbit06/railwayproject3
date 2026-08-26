using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Services.IService;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RailAdmin.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    // =========================
    // REGISTER
    // =========================
    public async Task<AuthResponse?> RegisterAsync(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return null;

        var user = new User
        {
            Name = req.Name,
            Email = req.Email,

            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(req.Password),

            // User đăng ký luôn là User
            Role = "User"
        };

        _db.Users.Add(user);

        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Success = true,
            Message = "Register successful",
            Token = GenerateJwtToken(user),
            Role = user.Role,
            User = MapToDto(user)
        };
    }

    // =========================
    // LOGIN
    // =========================
    public async Task<AuthResponse?> LoginAsync(LoginRequest req)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == req.Email);

        if (user == null)
            return null;

        var passwordValid =
            BCrypt.Net.BCrypt.Verify(
                req.Password,
                user.PasswordHash);

        if (!passwordValid)
            return null;

        return new AuthResponse
        {
            Success = true,
            Message = "Login successful",
            Token = GenerateJwtToken(user),
            Role = user.Role,
            User = MapToDto(user)
        };
    }

    // =========================
    // JWT
    // =========================
    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _config["Jwt:Key"]!));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role
            )
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }

    // =========================
    // USER DTO
    // =========================
    private UserResponse MapToDto(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }
}