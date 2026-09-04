using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _context;

    public AnalyticsService(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET ANALYTICS
    // =========================================================

    public async Task<object> GetAnalyticsAsync(string? range = "Month")
    {
        // =====================================================
        // 1. NORMALIZE RANGE
        // =====================================================

        range = NormalizeRange(range);

        var today = DateTime.UtcNow.Date;

        DateTime fromDate;
        DateTime toDate;

        switch (range)
        {
            case "Week":
                fromDate = today.AddDays(-6);
                toDate = today.AddDays(1);
                break;

            case "Year":
                fromDate = new DateTime(today.Year, 1, 1);
                toDate = fromDate.AddYears(1);
                break;

            case "Month":
            default:
                fromDate = new DateTime(
                    today.Year,
                    today.Month,
                    1
                );

                toDate = fromDate.AddMonths(1);
                break;
        }

        // =====================================================
        // 2. TOTAL REVENUE
        // Payment Success
        // =====================================================

        var totalRevenue =
            await _context.Payments
                .AsNoTracking()
                .Where(p =>
                    p.Status == "Success" &&
                    p.PaidAt >= fromDate &&
                    p.PaidAt < toDate)
                .SumAsync(p => (decimal?)p.Amount)
            ?? 0m;

        // =====================================================
        // 3. TICKETS SOLD
        // Không tính Cancelled
        // =====================================================

        var ticketsSold =
            await _context.Tickets
                .AsNoTracking()
                .Where(t =>
                    t.Status != "Cancelled" &&
                    t.Booking != null &&
                    t.Booking.BookingDate >= fromDate &&
                    t.Booking.BookingDate < toDate)
                .CountAsync();

        // =====================================================
        // 4. ACTIVE USERS
        //
        // User được tạo trong khoảng thời gian
        // =====================================================

        var activeUsers =
            await _context.Users
                .AsNoTracking()
                .Where(u =>
                    u.Role == "User" &&
                    u.CreatedAt >= fromDate &&
                    u.CreatedAt < toDate)
                .CountAsync();

        // =====================================================
        // 5. CLASS DISTRIBUTION
        //
        // Ticket
        //   -> Seat
        //      -> TrainCoach
        //         -> ClassType
        // =====================================================

        var classRaw =
            await _context.Tickets
                .AsNoTracking()
                .Where(t =>
                    t.Status != "Cancelled" &&
                    t.Seat != null &&
                    t.Seat.Coach != null &&
                    t.Booking != null &&
                    t.Booking.BookingDate >= fromDate &&
                    t.Booking.BookingDate < toDate)
                .GroupBy(t => t.Seat!.Coach!.ClassType)
                .Select(g => new AnalyticsClassItem
                {
                    Name = g.Key ?? "Unknown",
                    Value = g.Count()
                })
                .ToListAsync();

        var totalClassTickets =
            classRaw.Sum(x => x.Value);

        var classDistribution =
            classRaw
                .Select(x => new
                {
                    name = FormatClassName(x.Name),

                    value = CalculatePercentage(
                        x.Value,
                        totalClassTickets
                    )
                })
                .OrderByDescending(x => x.value)
                .ToList();

        // =====================================================
        // 6. OCCUPANCY RATE
        //
        // Tổng số ghế vật lý của toàn bộ hệ thống
        // =====================================================

        var totalSeats =
            await _context.TrainCoaches
                .AsNoTracking()
                .SumAsync(c => (int?)c.TotalSeats)
            ?? 0;

        var occupancyRate =
            totalSeats > 0
                ? Math.Round(
                    ticketsSold * 100m / totalSeats,
                    2
                )
                : 0m;

        // =====================================================
        // 7. REVENUE CHART
        // =====================================================

        var revenueRaw =
            await _context.Payments
                .AsNoTracking()
                .Where(p =>
                    p.Status == "Success" &&
                    p.PaidAt >= fromDate &&
                    p.PaidAt < toDate)
                .GroupBy(p => p.PaidAt.Date)
                .Select(g => new AnalyticsRevenueItem
                {
                    Date = g.Key,
                    Revenue = g.Sum(x => x.Amount)
                })
                .ToListAsync();

        var revenue =
            BuildRevenueChart(
                revenueRaw,
                fromDate,
                toDate,
                range
            );

        // =====================================================
        // 8. TICKET VOLUME
        // =====================================================

        var ticketVolumeRaw =
            await _context.Tickets
                .AsNoTracking()
                .Where(t =>
                    t.Status != "Cancelled" &&
                    t.Booking != null &&
                    t.Booking.BookingDate >= fromDate &&
                    t.Booking.BookingDate < toDate)
                .GroupBy(t => t.Booking!.BookingDate.Date)
                .Select(g => new AnalyticsTicketVolumeItem
                {
                    Date = g.Key,
                    Tickets = g.Count()
                })
                .ToListAsync();

        var ticketVolume =
            BuildTicketVolumeChart(
                ticketVolumeRaw,
                fromDate,
                toDate,
                range
            );

        // =====================================================
        // 9. RESPONSE
        // =====================================================

        return new
        {
            totalRevenue,
            ticketsSold,
            activeUsers,
            occupancyRate,

            classDistribution,

            revenue,

            ticketVolume
        };
    }

    // =========================================================
    // NORMALIZE RANGE
    // =========================================================

    private static string NormalizeRange(string? range)
    {
        if (string.IsNullOrWhiteSpace(range))
            return "Month";

        return range.Trim().ToLowerInvariant() switch
        {
            "week" => "Week",
            "month" => "Month",
            "year" => "Year",

            _ => "Month"
        };
    }

    // =========================================================
    // REVENUE CHART
    // =========================================================

    private static List<object> BuildRevenueChart(
        IEnumerable<AnalyticsRevenueItem> rawData,
        DateTime fromDate,
        DateTime toDate,
        string range)
    {
        var result = new List<object>();

        var data = rawData.ToDictionary(
            x => x.Date.Date,
            x => x.Revenue
        );

        // =====================================================
        // YEAR
        // 12 MONTHS
        // =====================================================

        if (range.Equals(
            "Year",
            StringComparison.OrdinalIgnoreCase))
        {
            for (var month = 1; month <= 12; month++)
            {
                var date = new DateTime(
                    fromDate.Year,
                    month,
                    1
                );

                var revenue = data
                    .Where(x =>
                        x.Key.Year == date.Year &&
                        x.Key.Month == date.Month)
                    .Sum(x => x.Value);

                result.Add(new
                {
                    name = date.ToString("MMM"),
                    revenue
                });
            }

            return result;
        }

        // =====================================================
        // WEEK / MONTH
        // DAILY DATA
        // =====================================================

        for (
            var date = fromDate.Date;
            date < toDate.Date;
            date = date.AddDays(1))
        {
            data.TryGetValue(
                date,
                out var revenueValue
            );

            result.Add(new
            {
                name = date.ToString("dd/MM"),
                revenue = revenueValue
            });
        }

        return result;
    }

    // =========================================================
    // TICKET VOLUME CHART
    // =========================================================

    private static List<object> BuildTicketVolumeChart(
        IEnumerable<AnalyticsTicketVolumeItem> rawData,
        DateTime fromDate,
        DateTime toDate,
        string range)
    {
        var result = new List<object>();

        var data = rawData.ToDictionary(
            x => x.Date.Date,
            x => x.Tickets
        );

        // =====================================================
        // YEAR
        // 12 MONTHS
        // =====================================================

        if (range.Equals(
            "Year",
            StringComparison.OrdinalIgnoreCase))
        {
            for (var month = 1; month <= 12; month++)
            {
                var date = new DateTime(
                    fromDate.Year,
                    month,
                    1
                );

                var tickets = data
                    .Where(x =>
                        x.Key.Year == date.Year &&
                        x.Key.Month == date.Month)
                    .Sum(x => x.Value);

                result.Add(new
                {
                    name = date.ToString("MMM"),
                    tickets
                });
            }

            return result;
        }

        // =====================================================
        // WEEK / MONTH
        // DAILY DATA
        // =====================================================

        for (
            var date = fromDate.Date;
            date < toDate.Date;
            date = date.AddDays(1))
        {
            data.TryGetValue(
                date,
                out var ticketsValue
            );

            result.Add(new
            {
                name = date.ToString("dd/MM"),
                tickets = ticketsValue
            });
        }

        return result;
    }

    // =========================================================
    // FORMAT CLASS NAME
    // =========================================================

    private static string FormatClassName(
        string? classType)
    {
        if (string.IsNullOrWhiteSpace(classType))
            return "Unknown";

        var words = classType
            .Replace("_", " ")
            .Trim()
            .ToLowerInvariant()
            .Split(
                ' ',
                StringSplitOptions.RemoveEmptyEntries
            );

        return string.Join(
            " ",
            words.Select(word =>
                char.ToUpperInvariant(word[0]) +
                word[1..])
        );
    }

    // =========================================================
    // CALCULATE PERCENTAGE
    // =========================================================

    private static int CalculatePercentage(
        int value,
        int total)
    {
        if (total <= 0)
            return 0;

        return (int)Math.Round(
            value * 100.0 / total,
            MidpointRounding.AwayFromZero
        );
    }

    // =========================================================
    // INTERNAL DTO
    // =========================================================

    private sealed class AnalyticsRevenueItem
    {
        public DateTime Date { get; set; }

        public decimal Revenue { get; set; }
    }

    private sealed class AnalyticsTicketVolumeItem
    {
        public DateTime Date { get; set; }

        public int Tickets { get; set; }
    }

    private sealed class AnalyticsClassItem
    {
        public string Name { get; set; } = "Unknown";

        public int Value { get; set; }
    }
}