using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.Data;

namespace RailAdmin.API.Controllers
{
    // Ví dụ trong StatsController.cs
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
            // 1. Tính toán các chỉ số
            var totalRevenue = await _db.Bookings.SumAsync(b => b.TotalAmount);
            var ticketsSold = await _db.Bookings.CountAsync();
            var activeTrains = await _db.Trains.CountAsync(t => t.Status == "Active");
            // ... các tính toán khác

            // 2. Dữ liệu cho Revenue Chart (7 ngày gần nhất)
            var revenueData = await _db.Bookings
                .Where(b => b.CreatedAt >= DateTime.UtcNow.AddDays(-7))
                .GroupBy(b => b.CreatedAt.DayOfWeek)
                .Select(g => new { d = g.Key.ToString().Substring(0, 3), r = g.Sum(b => b.TotalAmount) })
                .ToListAsync();

            // 3. Dữ liệu cho Pie Chart
            var confirmedCount = await _db.Bookings.CountAsync(b => b.Status == "Confirmed");
            var waitingCount = await _db.Bookings.CountAsync(b => b.Status == "Waiting");
            var cancelledCount = await _db.Bookings.CountAsync(b => b.Status == "Cancelled");
            var total = confirmedCount + waitingCount + cancelledCount;

            var distributionData = new[]
            {
            new { name = "Confirmed", value = total > 0 ? Math.Round((double)confirmedCount / total * 100) : 0, color = "#22c55e" },
            new { name = "Waiting", value = total > 0 ? Math.Round((double)waitingCount / total * 100) : 0, color = "#f97316" },
            new { name = "Cancelled", value = total > 0 ? Math.Round((double)cancelledCount / total * 100) : 0, color = "#ef4444" }
        };

            // 4. Dữ liệu cho Activities (Lấy 4 cái mới nhất)
            var activitiesData = await _db.Bookings
                .OrderByDescending(b => b.CreatedAt)
                .Take(4)
                .Select(b => new {
                    id = b.Id,
                    icon = "Ticket", // Map sang tên icon
                    color = b.Status == "Confirmed" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50",
                    title = $"Booking #{b.Pnr} confirmed",
                    detail = $"{b.PassengerName} • {b.TrainName}",
                    time = b.CreatedAt.ToString("dd/MM/yyyy")
                })
                .ToListAsync();

            // 5. Trả về tổng hợp
            var response = new
            {
                stats = new[]
                {
                new { label = "Total Revenue", value = $"${totalRevenue:N0}", change = "+12.5%", trend = "up", icon = "TrendingUp", bg = "bg-green-50", color = "text-green-600" },
                new { label = "Tickets Sold", value = ticketsSold.ToString("N0"), change = "+8.2%", trend = "up", icon = "Ticket", bg = "bg-blue-50", color = "text-blue-600" },
                new { label = "Active Trains", value = activeTrains.ToString("N0"), change = "3 cancelled", trend = "down", icon = "Train", bg = "bg-orange-50", color = "text-orange-600" },
                new { label = "Online Users", value = "2,148", change = "+156", trend = "up", icon = "Users", bg = "bg-purple-50", color = "text-purple-600" }
            },
                revenue = revenueData,
                distribution = distributionData,
                activities = activitiesData
            };

            return Ok(response);
        }
    }
}
