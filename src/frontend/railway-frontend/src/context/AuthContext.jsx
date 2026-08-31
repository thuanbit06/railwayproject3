import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // RESTORE LOGIN WHEN RELOAD
  // =========================================================
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Gắn token vào Axios
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Kiểm tra token còn hợp lệ bằng API /me
        const response = await api.get("/auth/me");

        const userData = response.data;

        const normalizedUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        };

        localStorage.setItem("user", JSON.stringify(normalizedUser));

        setUser(normalizedUser);
      } catch (error) {
        console.error("RESTORE SESSION ERROR:", error);

        // Token hết hạn / không hợp lệ
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        delete api.defaults.headers.common["Authorization"];

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      /*
       Backend hiện tại:

       {
         success: true,
         message: "...",
         requireOtp: true,
         role: "User"
       }

       KHÔNG có token ở bước này.
       */

      if (!data.success) {
        throw new Error(data.message || "Email hoặc mật khẩu không đúng.");
      }

      return {
        success: true,
        requireOtp: data.requireOtp === true,
        role: data.role || null,
        user: data.user || null,
        message: data.message,
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Email hoặc mật khẩu không đúng.";

      throw new Error(message);
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================
  const verifyOtp = async (email, otp) => {
    try {
      console.log("VERIFY OTP REQUEST:", {
        email,
        otp,
        otpLength: otp.length,
      });

      const response = await api.post("/auth/verify-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      const data = response.data;

      console.log("VERIFY OTP RESPONSE:", data);

      if (!data.success) {
        throw new Error(data.message || "Mã OTP không hợp lệ.");
      }

      /*
       Backend VerifyOtp trả:

       {
         success: true,
         message: "...",
         token: "...",
         role: "...",
         requireOtp: false,
         user: {...}
       }
      */

      if (!data.token) {
        throw new Error(
          "Xác thực OTP thành công nhưng server không trả JWT token.",
        );
      }

      const user = data.user;

      if (!user) {
        throw new Error(
          "Xác thực OTP thành công nhưng server không trả thông tin user.",
        );
      }

      const normalizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || data.role,
      };

      // =====================================================
      // CHỈ LƯU TOKEN SAU KHI OTP ĐÚNG
      // =====================================================

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // Gắn JWT cho Axios
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Cập nhật React state
      setUser(normalizedUser);

      return {
        success: true,
        token: data.token,
        role: normalizedUser.role,
        user: normalizedUser,
        message: data.message,
      };
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Mã OTP không hợp lệ.";

      throw new Error(message);
    }
  };

  // =========================================================
  // REGISTER
  // =========================================================
  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Đăng ký thất bại.");
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      const message =
        error.response?.data?.message || error.message || "Đăng ký thất bại.";

      throw new Error(message);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  };

  // =========================================================
  // GET CURRENT USER
  // =========================================================
  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      const userData = response.data;

      const normalizedUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));

      setUser(normalizedUser);

      return normalizedUser;
    } catch (error) {
      console.error("GET CURRENT USER ERROR:", error);

      logout();

      return null;
    }
  };

  // =========================================================
  // CHECK AUTHENTICATED
  // =========================================================
  const isAuthenticated = !!user && !!localStorage.getItem("token");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,

        login,
        verifyOtp,
        register,
        logout,
        getCurrentUser,
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// =========================================================
// useAuth
// =========================================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthContext;
