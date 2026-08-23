// src/services/statsService.js
import api from "./api"; // Dùng instance axios đã cấu hình sẵn

/**
 * Lấy dữ liệu tổng quan cho Dashboard
 * @returns {Promise<Object>}
 */
export const getDashboardStats = async () => {
  try {
    // Backend cần có endpoint này
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error; // Ném lỗi ra để component xử lý
  }
};

/**
 * Lấy thông tin User hiện tại (đã có API sẵn)
 * @returns {Promise<Object>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};
