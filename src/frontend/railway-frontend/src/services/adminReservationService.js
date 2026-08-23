import api from "./api";

// Lấy reservation gần nhất
export const getRecentReservations = (count = 5) =>
  api.get(`/admin/reservations/recent?count=${count}`);

// Lấy thống kê reservation
export const getReservationStats = () => api.get(`/admin/reservations/stats`);
