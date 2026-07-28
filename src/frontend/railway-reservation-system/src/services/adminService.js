import { apiClient } from "./apiClient";

export const adminService = {
  getStats: () => apiClient.get("/admin/stats"),
  getUsers: () => apiClient.get("/admin/users"),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  getAllTrains: () => apiClient.get("/admin/trains"),
  getDailyCash: (date) => apiClient.get(`/bookings/daily-cash?date=${date}`),
};
