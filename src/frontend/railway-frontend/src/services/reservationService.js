import api from "./api";

export const getReservations = () => api.get("/admin/reservations");
export const confirmReservation = (id) =>
  api.put(`/admin/reservations/${id}/confirm`);
export const cancelReservation = (id) =>
  api.put(`/admin/reservations/${id}/cancel`);
