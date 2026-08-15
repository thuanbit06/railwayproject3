import api from "./api";

// Lấy tất cả vé (Admin)
export const getTickets = () => api.get("/admin/tickets");

// Lấy vé của user hiện tại
export const getMyTickets = () => api.get("/tickets/my-tickets");

// Xem chi tiết 1 vé theo PNR
export const getTicketByPNR = (pnr) => api.get(`/tickets/${pnr}`);

// Xóa hẳn vé (hard delete – admin)
export const deleteTicket = (id) => api.delete(`/admin/tickets/${id}`);

// Hủy vé (soft delete – cập nhật trạng thái)
export const cancelTicket = (pnr, reason) =>
  api.put(`/tickets/${pnr}/cancel`, { reason });
