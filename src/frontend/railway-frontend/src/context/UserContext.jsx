import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api"; // 👈 Đường dẫn đến file api.js của anh

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Gọi API lấy thông tin user từ token
        const res = await api.get("/auth/me");
        setUser(res.data); // Ví dụ: { id: 1, name: "Arjun S.", email: "...", role: "Admin" }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token"); // Xóa token nếu hết hạn
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để dễ dùng ở các component khác
export const useUser = () => useContext(UserContext);
