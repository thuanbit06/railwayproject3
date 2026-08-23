import api from "./api";

// =====================================================
// ADMIN - Lấy tất cả vé
// GET /api/admin/tickets
// =====================================================
export const getTickets = () => api.get("/admin/tickets");

// =====================================================
// USER - Lấy vé của user hiện tại
// GET /api/tickets/my-tickets
// =====================================================
export const getMyTickets = () => api.get("/tickets/my-tickets");

// =====================================================
// Lấy chi tiết vé theo PNR
// GET /api/tickets/pnr/{pnr}
// =====================================================
export const getTicketByPNR = (pnr) => api.get(`/tickets/pnr/${pnr}`);

// =====================================================
// ADMIN - Xóa vé
// DELETE /api/admin/tickets/{id}
// =====================================================
export const deleteTicket = (id) => api.delete(`/admin/tickets/${id}`);

// =====================================================
// Hủy vé
// PUT /api/tickets/{pnr}/cancel
// =====================================================
export const cancelTicket = (pnr, reason = "Cancelled by admin") =>
  api.put(`/tickets/${pnr}/cancel`, {
    reason,
  });

// =====================================================
// Kiểm tra trạng thái PNR
// GET /api/tickets/pnr/{pnr}
// =====================================================
export const checkPnrStatus = (pnr) => api.get(`/tickets/pnr/${pnr}`);
