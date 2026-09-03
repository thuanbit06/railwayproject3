using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RailAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBerthTypeToSeats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SeatId1",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BerthType",
                table: "Seats",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_SeatId1",
                table: "Tickets",
                column: "SeatId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Seats_SeatId1",
                table: "Tickets",
                column: "SeatId1",
                principalTable: "Seats",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Seats_SeatId1",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_SeatId1",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "SeatId1",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "BerthType",
                table: "Seats");
        }
    }
}
