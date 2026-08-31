import axios from "axios";

// =========================================================
// AXIOS INSTANCE
// =========================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5159/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

// =========================================================
// REQUEST INTERCEPTOR
// GẮN JWT VÀO REQUEST
// =========================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // =====================================================
    // AUTH REQUEST
    //
    // Không tự động logout khi các API này trả lỗi.
    // =====================================================

    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/verify-otp");

    // =====================================================
    // 401 - UNAUTHORIZED
    // =====================================================

    if (status === 401 && !isAuthRequest) {
      console.warn("401 Unauthorized - JWT không hợp lệ hoặc đã hết hạn.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete api.defaults.headers.common["Authorization"];

      // Tránh redirect lặp
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // =====================================================
    // 403 - FORBIDDEN
    // =====================================================

    if (status === 403) {
      console.warn("403 Forbidden - User không có quyền truy cập API:", url);
    }

    // =====================================================
    // 400 - BAD REQUEST
    // =====================================================

    if (status === 400) {
      console.warn("400 Bad Request:", error.response?.data);
    }

    return Promise.reject(error);
  },
);

export default api;
