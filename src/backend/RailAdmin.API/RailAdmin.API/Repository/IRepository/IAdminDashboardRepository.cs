using RailAdmin.API.Models;

namespace RailAdmin.API.Services.IRepository;

public interface IAdminDashboardRepository
{
    Task<int> GetTotalTrainsAsync();

    Task<int> GetTotalReservationsAsync();

    Task<int> GetTicketsSoldAsync();

    Task<decimal> GetTotalRevenueAsync();

    Task<List<Booking>> GetRecentReservationsAsync(int count);

    Task<List<(DateTime Date, decimal Revenue)>> GetRevenueOverviewAsync(int days);
}