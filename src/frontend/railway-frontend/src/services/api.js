import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5159/api", // ⚠️ Đổi theo port .NET 8 của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Tự động gắn JWT token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("raillink_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Tự động logout nếu token hết hạn (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("raillink_token");
      localStorage.removeItem("raillink_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
