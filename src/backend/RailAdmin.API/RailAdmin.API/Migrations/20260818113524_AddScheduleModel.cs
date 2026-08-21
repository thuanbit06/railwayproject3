using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RailAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class AddScheduleModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ScheduleID",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CancellationRules",
                columns: table => new
                {
                    RuleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HoursBeforeDeparture = table.Column<int>(type: "int", nullable: false),
                    CancellationFeeType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FeeValue = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    MinFee = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CoachType = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CancellationRules", x => x.RuleID);
                });

            migrationBuilder.CreateTable(
                name: "FoodServices",
                columns: table => new
                {
                    FoodServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MealType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodServices", x => x.FoodServiceID);
                });

            migrationBuilder.CreateTable(
                name: "Refunds",
                columns: table => new
                {
                    RefundID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketID = table.Column<int>(type: "int", nullable: false),
                    PaymentID = table.Column<int>(type: "int", nullable: true),
                    CancellationRuleID = table.Column<int>(type: "int", nullable: true),
                    TotalAmountPaid = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CancellationFee = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    RefundAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    RefundStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RefundDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProcessedBy = table.Column<int>(type: "int", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Refunds", x => x.RefundID);
                    table.ForeignKey(
                        name: "FK_Refunds_Tickets_TicketID",
                        column: x => x.TicketID,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    ScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrainNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrainName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrainType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartureStation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArrivalStation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JourneyDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DepartureTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ArrivalTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "time", nullable: true),
                    TotalDistance = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AverageDelayMinutes = table.Column<int>(type: "int", nullable: true),
                    TotalCapacity = table.Column<int>(type: "int", nullable: false),
                    AvailableSeats = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.ScheduleID);
                });

            migrationBuilder.CreateTable(
                name: "TrainOperatingDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrainID = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainOperatingDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainOperatingDays_Trains_TrainID",
                        column: x => x.TrainID,
                        principalTable: "Trains",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScheduleStops",
                columns: table => new
                {
                    StopID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleID = table.Column<int>(type: "int", nullable: false),
                    StationID = table.Column<int>(type: "int", nullable: false),
                    StopSequence = table.Column<int>(type: "int", nullable: false),
                    DistanceFromOrigin = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    ArrivalTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    DepartureTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    HaltDurationMinutes = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleStops", x => x.StopID);
                    table.ForeignKey(
                        name: "FK_ScheduleStops_Schedules_ScheduleID",
                        column: x => x.ScheduleID,
                        principalTable: "Schedules",
                        principalColumn: "ScheduleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScheduleStops_Stations_StationID",
                        column: x => x.StationID,
                        principalTable: "Stations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ScheduleID",
                table: "Tickets",
                column: "ScheduleID");

            migrationBuilder.CreateIndex(
                name: "IX_Refunds_TicketID",
                table: "Refunds",
                column: "TicketID");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleStops_ScheduleID",
                table: "ScheduleStops",
                column: "ScheduleID");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleStops_StationID",
                table: "ScheduleStops",
                column: "StationID");

            migrationBuilder.CreateIndex(
                name: "IX_TrainOperatingDays_TrainID",
                table: "TrainOperatingDays",
                column: "TrainID");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleID",
                table: "UserRoles",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserID",
                table: "UserRoles",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Schedules_ScheduleID",
                table: "Tickets",
                column: "ScheduleID",
                principalTable: "Schedules",
                principalColumn: "ScheduleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Schedules_ScheduleID",
                table: "Tickets");

            migrationBuilder.DropTable(
                name: "CancellationRules");

            migrationBuilder.DropTable(
                name: "FoodServices");

            migrationBuilder.DropTable(
                name: "Refunds");

            migrationBuilder.DropTable(
                name: "ScheduleStops");

            migrationBuilder.DropTable(
                name: "TrainOperatingDays");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_ScheduleID",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ScheduleID",
                table: "Tickets");
        }
    }
}
