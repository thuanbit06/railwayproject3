using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RailAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAuthAndUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // OTP và OTPExpiry đã tồn tại trong database.
            // Không cần AddColumn.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Không xóa OTP và OTPExpiry vì chúng đã tồn tại
            // trước migration này.
        }
    }
}