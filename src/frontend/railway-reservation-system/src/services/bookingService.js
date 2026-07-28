import { apiClient } from "./apiClient";

export const bookingService = {
  bookTicket: (data) => apiClient.post("/bookings", data),
  getByPNR: (pnr) => apiClient.get(`/bookings/pnr/${pnr}`),
  cancelTicket: (pnr) => apiClient.post("/bookings/cancel", { pnr }),
  getDailyCash: (date) => apiClient.get(`/bookings/daily-cash?date=${date}`),
};
