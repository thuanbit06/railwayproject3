import api from "./api";

// Tạo ticket hỗ trợ mới
export const createSupportTicket = (data) => api.post("/support/ticket", data);

// Lấy danh sách ticket của 1 email
export const getTicketsByEmail = (email) =>
  api.get(`/support/tickets?email=${encodeURIComponent(email)}`);

// Lấy chi tiết 1 ticket theo ID
export const getTicketById = (id) => api.get(`/support/ticket/${id}`);

// Cập nhật trạng thái ticket (admin xử lý xong)
export const updateTicketStatus = (id, status) =>
  api.put(`/support/ticket/${id}/status`, { status });

// Xóa ticket (admin)
export const deleteTicket = (id) => api.delete(`/support/ticket/${id}`);
