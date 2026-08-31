using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs;
using RailAdmin.API.DTOs.Request.Otp;
using RailAdmin.API.DTOs.Request.User;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Services.IService;
using System.Security.Claims;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(request);
        if (result == null || !result.Success)
            return BadRequest(result ?? new AuthResponse { Success = false, Message = "Đăng ký thất bại." });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new AuthResponse { Success = false, Message = "Email và mật khẩu không được để trống." });

        var result = await _authService.LoginAsync(request);
        if (result == null || !result.Success)
            return Unauthorized(result ?? new AuthResponse { Success = false, Message = "Đăng nhập thất bại." });

        return Ok(result);
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Otp))
            return BadRequest(new AuthResponse { Success = false, Message = "Email và OTP không được để trống." });

        var result = await _authService.VerifyOtpAsync(req);
        if (result == null || !result.Success)
            return BadRequest(result ?? new AuthResponse { Success = false, Message = "Xác minh OTP thất bại." });

        return Ok(result);
    }

    [HttpPost("create-user")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] UserCreateRequest req)
    {
        var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(adminEmail))
            return Unauthorized(new AuthResponse { Success = false, Message = "Không xác định được Admin." });

        var result = await _authService.CreateUserAsync(req, adminEmail);
        if (result == null || !result.Success)
            return BadRequest(result ?? new AuthResponse { Success = false, Message = "Tạo user thất bại." });

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { success = false, message = "Token không hợp lệ." });

        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null)
            return NotFound(new { success = false, message = "User không tồn tại." });

        return Ok(user);
    }
}