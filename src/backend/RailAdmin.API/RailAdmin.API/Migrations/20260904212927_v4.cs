using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RailAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class v4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "FailureReason",
                table: "Refunds",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdempotencyKey",
                table: "Refunds",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PaymentId",
                table: "Refunds",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ProcessedAt",
                table: "Refunds",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RefundTransactionId",
                table: "Refunds",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RetryCount",
                table: "Refunds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Refunds_IdempotencyKey",
                table: "Refunds",
                column: "IdempotencyKey",
                unique: true,
                filter: "[IdempotencyKey] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Refunds_PaymentId",
                table: "Refunds",
                column: "PaymentId",
                filter: "[IdempotencyKey] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Refunds_RefundTransactionId",
                table: "Refunds",
                column: "RefundTransactionId",
                unique: true,
                filter: "[RefundTransactionId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Refunds_Payments_PaymentId",
                table: "Refunds",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refunds_Payments_PaymentId",
                table: "Refunds");

            migrationBuilder.DropIndex(
                name: "IX_Refunds_IdempotencyKey",
                table: "Refunds");

            migrationBuilder.DropIndex(
                name: "IX_Refunds_PaymentId",
                table: "Refunds");

            migrationBuilder.DropIndex(
                name: "IX_Refunds_RefundTransactionId",
                table: "Refunds");

            migrationBuilder.DropIndex(
                name: "UX_Refund_RefundTransactionId",
                table: "Refunds");

            migrationBuilder.DropColumn(
                name: "FailureReason",
                table: "Refunds");

            migrationBuilder.DropColumn(
                name: "IdempotencyKey",
                table: "Refunds");

            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "Refunds");

            migrationBuilder.DropColumn(
                name: "ProcessedAt",
                table: "Refunds");

            migrationBuilder.DropColumn(
                name: "RefundTransactionId",
                table: "Refunds");

            migrationBuilder.DropColumn(
                name: "RetryCount",
                table: "Refunds");

            migrationBuilder.AddColumn<int>(
                name: "SeatId1",
                table: "Tickets",
                type: "int",
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
    }
}
