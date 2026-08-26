namespace RailAdmin.API.DTOs.Response;

public class AuthResponse
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public UserResponse? User { get; set; }
}

