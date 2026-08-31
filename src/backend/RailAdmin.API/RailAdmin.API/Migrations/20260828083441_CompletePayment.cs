using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RailAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class CompletePayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Payments_PNR",
                table: "Payments");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PNR",
                table: "Payments",
                column: "PNR",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Payments_PNR",
                table: "Payments");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PNR",
                table: "Payments",
                column: "PNR");
        }
    }
}
