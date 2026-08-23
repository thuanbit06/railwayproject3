using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Models;

namespace RailAdmin.API.Data;

public static class AdminSeeder
{
    public static async Task SeedAdminAsync(
        AppDbContext db,
        IConfiguration configuration)
    {
        var email = configuration["SeedAdmin:Email"];
        var password = configuration["SeedAdmin:Password"];

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        var existing = await db.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existing == null)
        {
            var admin = new User
            {
                Name = "System Administrator",
                Email = email,
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Admin"
            };

            db.Users.Add(admin);
        }
        else
        {
            existing.Role = "Admin";

            // Reset password vì bạn quên mật khẩu
            existing.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(password);
        }

        await db.SaveChangesAsync();
    }
}