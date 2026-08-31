using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs.Response.AdminDashboard;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly AppDbContext _context;

        public AdminDashboardService(AppDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // DASHBOARD
        // =========================================================
        public async Task<AdminDashboardResponse> GetDashboardAsync()
        {
            // -----------------------------
            // BASIC STATISTICS
            // -----------------------------

            var totalTrains = await _context.Trains
                .CountAsync();

            var totalReservations = await _context.Bookings
                .CountAsync();

            var ticketsSold = await _context.Tickets
                .CountAsync(t => t.Status != "Cancelled");

            var totalRevenue = await _context.Bookings
                .Where(b => b.BookingStatus != "Cancelled")
                .SumAsync(b => (decimal?)b.TotalAmount) ?? 0m;


            // -----------------------------
            // REVENUE - LAST 7 DAYS
            // -----------------------------

            var today = DateTime.UtcNow.Date;
            var startDate = today.AddDays(-6);

            var revenueData = await _context.Bookings
                .Where(b =>
                    b.BookingDate.Date >= startDate &&
                    b.BookingDate.Date <= today &&
                    b.BookingStatus != "Cancelled"
                )
                .GroupBy(b => b.BookingDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();


            var revenue = Enumerable
                .Range(0, 7)
                .Select(i =>
                {
                    var date = startDate.AddDays(i);

                    var item = revenueData
                        .FirstOrDefault(x => x.Date == date);

                    return new RevenueResponse
                    {
                        Date = date,

                        Label = date.ToString("dd/MM"),

                        Revenue = item?.Revenue ?? 0m
                    };
                })
                .ToList();


            // -----------------------------
            // TICKET DISTRIBUTION
            // -----------------------------

            var distribution = await _context.Tickets
                .GroupBy(t => t.Status)
                .Select(g => new DistributionResponse
                {
                    Label = g.Key,

                    Value = g.Count()
                })
                .ToListAsync();


            // -----------------------------
            // RETURN
            // -----------------------------

            return new AdminDashboardResponse
            {
                Stats = new DashboardStatsResponse
                {
                    TotalTrains = totalTrains,

                    TotalReservations = totalReservations,

                    TicketsSold = ticketsSold,

                    TotalRevenue = totalRevenue
                },

                Revenue = revenue,

                Distribution = distribution
            };
        }


        // =========================================================
        // RECENT RESERVATIONS
        // =========================================================
        public async Task<List<RecentReservationResponse>>
            GetRecentReservationsAsync(int count = 5)
        {
            var result = await _context.Bookings
                .AsNoTracking()
                .Include(b => b.User)
                .Include(b => b.Trip)
                    .ThenInclude(t => t!.Train)
                .Include(b => b.Tickets)
                .OrderByDescending(b => b.BookingDate)
                .Take(count)
                .Select(b => new RecentReservationResponse
                {
                    PNR = b.PNR,

                    PassengerName =
                        b.Tickets != null &&
                        b.Tickets.Any()
                            ? b.Tickets.First().PassengerName
                            : b.User != null
                                ? b.User.Name
                                : "Unknown",

                    TrainName =
                        b.Trip != null &&
                        b.Trip.Train != null
                            ? b.Trip.Train.TrainName
                            : "Unknown",

                    TrainNo =
                        b.Trip != null &&
                        b.Trip.Train != null
                            ? b.Trip.Train.TrainNo
                            : "N/A",

                    JourneyDate =
                        b.Trip != null
                            ? b.Trip.JourneyDate
                            : DateTime.MinValue,

                    Amount = b.TotalAmount,

                    Status = b.BookingStatus
                })
                .ToListAsync();

            return result;
        }
    }
}