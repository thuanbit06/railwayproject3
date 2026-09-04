using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Request.Otp;
using RailAdmin.API.DTOs.Request.User;
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

    // ✅ Method 1: GetUserByIdAsync
    public async Task<UserResponse?> GetUserByIdAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return null;
        return MapToDto(user);
    }

    // ✅ Method 2: VerifyOtpAsync
    public async Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLower());

        if (user == null)
            return new AuthResponse { Success = false, Message = "Người dùng không tồn tại." };

        if (string.IsNullOrEmpty(user.OTP) || user.OTP != req.Otp || user.OTPExpiry < DateTime.UtcNow)
            return new AuthResponse { Success = false, Message = "Mã OTP không hợp lệ hoặc đã hết hạn." };

        user.OTP = null;
        user.OTPExpiry = null;
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Success = true,
            Message = "Xác minh thành công.",
            Token = GenerateJwtToken(user),
            Role = user.Role,
            RequireOtp = false,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email.ToLower()))
            return new AuthResponse { Success = false, Message = "Email đã được sử dụng." };

        var user = new User
        {
            Name = req.Name,
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = "User"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Success = true,
            Message = "Đăng ký thành công.",
            Token = GenerateJwtToken(user),
            Role = user.Role,
            RequireOtp = false,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLower());

        if (user == null)
            return new AuthResponse { Success = false, Message = "Email hoặc mật khẩu không đúng." };

        var passwordValid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
        if (!passwordValid)
            return new AuthResponse { Success = false, Message = "Email hoặc mật khẩu không đúng." };

        var otp = Random.Shared.Next(100000, 999999).ToString();
        user.OTP = otp;
        user.OTPExpiry = DateTime.UtcNow.AddMinutes(5);
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Success = true,
            Message = "Mã OTP đã được gửi đến email của bạn.",
            RequireOtp = true,
            Role = user.Role
        };
    }

    public async Task<AuthResponse?> CreateUserAsync(UserCreateRequest req, string adminEmail)
    {
        var admin = await _db.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
        if (admin == null || admin.Role != "Admin")
            return new AuthResponse { Success = false, Message = "Chỉ Admin mới được tạo user." };

        if (await _db.Users.AnyAsync(u => u.Email == req.Email.ToLower()))
            return new AuthResponse { Success = false, Message = "Email đã tồn tại." };

        var defaultPassword = $"Rail@202{Random.Shared.Next(1000, 9999)}";

        var user = new User
        {
            Name = req.Name,
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword),
            Role = req.Role
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Success = true,
            Message = $"Tạo user thành công. Mật khẩu mặc định: {defaultPassword}",
            Role = user.Role,
            User = MapToDto(user)
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private UserResponse MapToDto(User user) => new()
    {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        Role = user.Role
    };
}