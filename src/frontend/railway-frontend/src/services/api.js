import axios from "axios";

// ✅ Tạo instance Axios riêng
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15s timeout
});

/*
========================================
INTERCEPTOR: GẮN TOKEN JWT VÀO MỖI REQUEST
========================================
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/*
========================================
INTERCEPTOR: XỬ LÝ LỖI TỰ ĐỘNG
========================================
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu token hết hạn hoặc chưa đăng nhập (401)
    const isAuthRequest = /\/auth\/(login|register)$/.test(
      error.config?.url || "",
    );

    if (error.response?.status === 401 && !isAuthRequest) {
      console.warn("Token expired or unauthorized. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login"; // Force logout
    }
    return Promise.reject(error);
  },
);

export default api;
