using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RailAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFareRule_AddConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ArrivalStation",
                table: "FareRules",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "FareRules",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "DepartureStation",
                table: "FareRules",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "FareRules",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SeatClass",
                table: "FareRules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TrainType",
                table: "FareRules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ArrivalStation",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "ArrivalTime",
                table: "Bookings",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "CoachNumber",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DepartureStation",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "DepartureTime",
                table: "Bookings",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<DateTime>(
                name: "JourneyDate",
                table: "Bookings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "PassengerEmail",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PassengerName",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PassengerPhone",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Pnr",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SeatClass",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SeatNumber",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TrainName",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TrainNumber",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TransactionId",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users_UserId",
                table: "Bookings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users_UserId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "ArrivalStation",
                table: "FareRules");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "FareRules");

            migrationBuilder.DropColumn(
                name: "DepartureStation",
                table: "FareRules");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "FareRules");

            migrationBuilder.DropColumn(
                name: "SeatClass",
                table: "FareRules");

            migrationBuilder.DropColumn(
                name: "TrainType",
                table: "FareRules");

            migrationBuilder.DropColumn(
                name: "ArrivalStation",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "ArrivalTime",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "CoachNumber",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "DepartureStation",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "DepartureTime",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "JourneyDate",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PassengerEmail",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PassengerName",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PassengerPhone",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Pnr",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "SeatClass",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "SeatNumber",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "TrainName",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "TrainNumber",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Bookings");
        }
    }
}
