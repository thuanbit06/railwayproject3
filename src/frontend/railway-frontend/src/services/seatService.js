// src/services/seatService.js
import api from "./api"; // hoặc "../api/api" tùy cấu trúc thư mục của bạn

// =========================================================
// SEAT SERVICE
// =========================================================

const seatService = {
  // Lấy tất cả ghế
  getAll: () => {
    return api.get("/seats");
  },

  // Lấy ghế theo ID
  getById: (id) => {
    return api.get(`/seats/${id}`);
  },

  // Lấy ghế theo Coach
  getByCoachId: (coachId) => {
    return api.get(`/seats/coach/${coachId}`);
  },

  // Tạo ghế mới
  create: (data) => {
    return api.post("/seats", data);
  },

  // Cập nhật ghế
  update: (id, data) => {
    return api.put(`/seats/${id}`, data);
  },

  // Xóa ghế
  remove: (id) => {
    return api.delete(`/seats/${id}`);
  },
};

export default seatService;
