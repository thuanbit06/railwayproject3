//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using RailAdmin.API.Data;
//using RailAdmin.API.DTOs;

//namespace RailAdmin.API.Controllers;

//[ApiController]
//[Route("api/[controller]")]
//public class AnalyticsController : ControllerBase
//{
//    private readonly AppDbContext _context;

//    public AnalyticsController(AppDbContext context)
//    {
//        _context = context;
//    }

//    [HttpGet]
//    public async Task<ActionResult<AnalyticsDto>> GetAnalytics(
//        [FromQuery] string range = "Month")
//    {
//        range = range.Trim();

//        if (!new[] { "Week", "Month", "Year" }.Contains(range, StringComparer.OrdinalIgnoreCase))
//        {
//            return BadRequest(new { message = "Range must be Week, Month or Year." });
//        }

//        var today = DateTime.UtcNow.Date;

//        var ticketsQuery = _context.Tickets
//            .AsNoTracking()
//            .Where(t => t.PaymentStatus == "Paid" && t.Reservation != null);

//        var result = new AnalyticsDto();

//        DateTime startDate;
//        DateTime endDate;

//        // ==================== 1. DATE RANGE ====================
//        if (range.Equals("Week", StringComparison.OrdinalIgnoreCase))
//        {
//            startDate = today.AddDays(-6);
//            endDate = today.AddDays(1);
//        }
//        else if (range.Equals("Month", StringComparison.OrdinalIgnoreCase))
//        {
//            startDate = new DateTime(today.Year, 1, 1);
//            endDate = startDate.AddYears(1);
//        }
//        else
//        {
//            var startYear = today.Year - 4;
//            startDate = new DateTime(startYear, 1, 1);
//            endDate = new DateTime(today.Year + 1, 1, 1);
//        }

//        var filteredTickets = await ticketsQuery
//            .Where(t => t.Reservation!.JourneyDate >= startDate && t.Reservation.JourneyDate < endDate)
//            .Select(t => new
//            {
//                JourneyDate = t.Reservation!.JourneyDate,
//                Amount = t.TotalAmount ?? 0,   // ✅ FIX: ép null về 0 ngay tại đây
//                Class = t.CoachClass
//            })
//            .ToListAsync();

//        result.TotalRevenue = filteredTickets.Sum(t => t.Amount);  // ✅ Giờ Amount là decimal, không còn lỗi
//        result.TicketsSold = filteredTickets.Count;

//        // ==================== 2. TIMELINE METRICS ====================
//        if (range.Equals("Week", StringComparison.OrdinalIgnoreCase))
//        {
//            result.Revenue = Enumerable.Range(0, 7).Select(i =>
//            {
//                var date = startDate.AddDays(i);
//                return new RevenueDataDto
//                {
//                    Name = date.ToString("ddd"),
//                    Revenue = filteredTickets.Where(t => t.JourneyDate.Date == date).Sum(t => t.Amount) // ✅ OK
//                };
//            }).ToList();

//            result.TicketVolume = Enumerable.Range(0, 7).Select(i =>
//            {
//                var date = startDate.AddDays(i);
//                return new TicketVolumeDto
//                {
//                    Name = date.ToString("ddd"),
//                    Tickets = filteredTickets.Count(t => t.JourneyDate.Date == date)
//                };
//            }).ToList();
//        }
//        else if (range.Equals("Month", StringComparison.OrdinalIgnoreCase))
//        {
//            result.Revenue = Enumerable.Range(1, 12).Select(month => new RevenueDataDto
//            {
//                Name = new DateTime(today.Year, month, 1).ToString("MMM"),
//                Revenue = filteredTickets.Where(t => t.JourneyDate.Month == month).Sum(t => t.Amount) // ✅ OK
//            }).ToList();

//            result.TicketVolume = Enumerable.Range(1, 12).Select(month => new TicketVolumeDto
//            {
//                Name = new DateTime(today.Year, month, 1).ToString("MMM"),
//                Tickets = filteredTickets.Count(t => t.JourneyDate.Month == month)
//            }).ToList();
//        }
//        else
//        {
//            var startYear = today.Year - 4;
//            result.Revenue = Enumerable.Range(startYear, 5).Select(year => new RevenueDataDto
//            {
//                Name = year.ToString(),
//                Revenue = filteredTickets.Where(t => t.JourneyDate.Year == year).Sum(t => t.Amount) // ✅ OK
//            }).ToList();

//            result.TicketVolume = Enumerable.Range(startYear, 5).Select(year => new TicketVolumeDto
//            {
//                Name = year.ToString(),
//                Tickets = filteredTickets.Count(t => t.JourneyDate.Year == year)
//            }).ToList();
//        }

//        // ==================== 3. CLASS DISTRIBUTION ====================
//        result.ClassDistribution = filteredTickets
//            .GroupBy(t => string.IsNullOrWhiteSpace(t.Class) ? "Standard" : t.Class)
//            .Select(g => new ClassDistributionDto
//            {
//                Name = g.Key,
//                Value = g.Count()
//            })
//            .ToList();

//        // ==================== 4. USERS & SYSTEM STATS ====================
//        result.TotalUsers = await _context.Users
//            .AsNoTracking()
//            .CountAsync();

//        result.OccupancyRate = null;

//        return Ok(result);
//    }
//}