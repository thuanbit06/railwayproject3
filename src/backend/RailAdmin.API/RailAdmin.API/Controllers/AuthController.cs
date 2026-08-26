using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RailAdmin.API.Data;
using RailAdmin.API.Dtos;
using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext db,
        IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    // =========================================================
    // REGISTER
    // POST: /api/auth/register
    // =========================================================

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                success = false,
                message = "Email is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                success = false,
                message = "Password is required."
            });
        }

        if (request.Password.Length < 6)
        {
            return BadRequest(new
            {
                success = false,
                message = "Password must be at least 6 characters."
            });
        }

        var email = request.Email.Trim().ToLower();

        var existingUser = await _db.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        if (existingUser != null)
        {
            return BadRequest(new
            {
                success = false,
                message = "Email already exists."
            });
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email,

            // Không lưu password dạng text
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                request.Password
            ),

            Role = "User"
        };

        _db.Users.Add(user);

        await _db.SaveChangesAsync();

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Registration successful.",
            Role = user.Role,

            User = new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }
        });
    }

    // =========================================================
    // LOGIN
    // POST: /api/auth/login
    // =========================================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Email and password are required."
            });
        }

        var email = request.Email.Trim().ToLower();

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        Console.WriteLine("=================================");
        Console.WriteLine($"LOGIN EMAIL: {email}");
        Console.WriteLine($"USER FOUND: {user != null}");

        if (user != null)
        {
            Console.WriteLine($"USER ID: {user.Id}");
            Console.WriteLine($"USER NAME: {user.Name}");
            Console.WriteLine($"USER EMAIL: {user.Email}");
            Console.WriteLine($"USER ROLE: {user.Role}");
            Console.WriteLine($"PASSWORD HASH: {user.PasswordHash}");
        }

        Console.WriteLine("=================================");

        if (user == null)
        {
            return Unauthorized(new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password."
            });
        }

        var passwordValid =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );
        Console.WriteLine($"PASSWORD VALID: {passwordValid}");

        if (!passwordValid)
        {
            return Unauthorized(new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password."
            });
        }

        var token = GenerateJwtToken(user);

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Login successful.",
            Token = token,
            Role = user.Role,


            User = new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }
        });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpDto dto)
    {
        // Demo: giả sử OTP đúng là 123456
        if (dto.Otp != "123456")
        {
            return BadRequest(new { message = "Invalid OTP" });
        }

        // ✅ PHẢI LẤY ĐÚNG ROLE TỪ DB DỰA TRÊN EMAIL
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

        if (user == null)
        {
            return BadRequest(new { message = "User not found" });
        }

        // Trả về đúng Role của user
        return Ok(new { role = user.Role });
    }
    // =========================================================
    // GET CURRENT USER
    // GET: /api/auth/me
    // =========================================================

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userIdClaim =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token."
            });
        }

        var user = await _db.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound(new
            {
                success = false,
                message = "User not found."
            });
        }

        return Ok(new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        });
    }

    // =========================================================
    // JWT
    // =========================================================

    private string GenerateJwtToken(User user)
    {
        var key = _configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException(
                "JWT Key is not configured."
            );
        }

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                user.Name
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

        var securityKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)
            );

        var credentials =
            new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256
            );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}