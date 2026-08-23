using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StatsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        // ==========================================
        // 1. BASIC STATISTICS
        // ==========================================

        var totalRevenue = await _db.Tickets
            .Where(t => t.PaymentStatus == "Paid")
            .SumAsync(t => (decimal?)t.TotalAmount) ?? 0;

        var ticketsSold = await _db.Tickets
            .CountAsync();

        var totalTrains = await _db.Trains
            .CountAsync();

        var activeTrains = await _db.Trains
            .CountAsync(t => t.IsActive);

        var totalReservations = await _db.Reservations
            .CountAsync();

        var confirmedCount = await _db.Reservations
            .CountAsync(r => r.Status == "Confirmed");

        var cancelledCount = await _db.Reservations
            .CountAsync(r => r.Status == "Cancelled");

        var waitingCount = await _db.Reservations
            .CountAsync(r => r.Status == "Waiting");


        // ==========================================
        // 2. REVENUE - 7 DAYS
        // ==========================================

        var sevenDaysAgo = DateTime.UtcNow.Date.AddDays(-6);

        var revenueRaw = await _db.Tickets
            .Where(t =>
                t.IssuedAt >= sevenDaysAgo &&
                t.PaymentStatus == "Paid"
            )
            .GroupBy(t => t.IssuedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Revenue = g.Sum(t => t.TotalAmount)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        var revenueData = revenueRaw.Select(x => new
        {
            date = x.Date.ToString("yyyy-MM-dd"),
            label = x.Date.ToString("dd/MM"),
            revenue = x.Revenue
        });


        // ==========================================
        // 3. RESERVATION DISTRIBUTION
        // ==========================================

        var totalStatuses =
            confirmedCount +
            waitingCount +
            cancelledCount;

        var distributionData = new[]
        {
            new
            {
                name = "Confirmed",
                value = totalStatuses > 0
                    ? Math.Round(
                        (double)confirmedCount /
                        totalStatuses * 100
                    )
                    : 0,
                color = "#22c55e"
            },

            new
            {
                name = "Waiting",
                value = totalStatuses > 0
                    ? Math.Round(
                        (double)waitingCount /
                        totalStatuses * 100
                    )
                    : 0,
                color = "#f97316"
            },

            new
            {
                name = "Cancelled",
                value = totalStatuses > 0
                    ? Math.Round(
                        (double)cancelledCount /
                        totalStatuses * 100
                    )
                    : 0,
                color = "#ef4444"
            }
        };


        // ==========================================
        // 4. RESPONSE
        // ==========================================

        var response = new
        {
            stats = new
            {
                totalTrains = activeTrains,
                totalReservations = totalReservations,
                ticketsSold = ticketsSold,
                totalRevenue = totalRevenue
            },

            revenue = revenueData,

            distribution = distributionData
        };

        return Ok(response);
    }
}