using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RailAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tickets_PNR",
                table: "Tickets");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_PNR_SeatId",
                table: "Tickets",
                columns: new[] { "PNR", "SeatId" },
                unique: true,
                filter: "[Status] <> 'Cancelled' AND [SeatId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tickets_PNR_SeatId",
                table: "Tickets");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_PNR",
                table: "Tickets",
                column: "PNR");
        }
    }
}
