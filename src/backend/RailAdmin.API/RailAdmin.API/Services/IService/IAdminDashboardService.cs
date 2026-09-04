using RailAdmin.API.DTOs.Response.AdminDashboard;

namespace RailAdmin.API.Services.IService
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardResponse> GetDashboardAsync();

        Task<List<RecentReservationResponse>> GetRecentReservationsAsync(
            int count = 5
        );
    }
}