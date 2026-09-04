import api from "./api";

/**
 * Lấy dữ liệu thống kê Dashboard Admin
 *
 * Backend:
 * GET /api/admin/stats
 *
 * Response:
 * {
 *   stats: {
 *     totalTrains,
 *     totalReservations,
 *     ticketsSold,
 *     totalRevenue,
 *     todayBookings,
 *     newCustomers,
 *     waitingBookings
 *   },
 *   revenue: [],
 *   distribution: []
 * }
 */
export const getDashboardStatistics = async () => {
  try {
    const response = await api.get("/admin/stats");

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch dashboard statistics:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
