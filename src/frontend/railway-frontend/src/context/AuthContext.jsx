import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =======================
  // PHỤC HỒI USER KHI RELOAD
  // =======================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(userData);
      } catch (error) {
        console.error("Invalid saved user:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // =======================
  // LOGIN
  // =======================
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      // Lưu JWT
      localStorage.setItem("token", token);

      // Lưu user
      localStorage.setItem("user", JSON.stringify(userData));

      // Gắn JWT vào Axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Cập nhật React state
      setUser(userData);

      console.log("LOGIN USER:", userData);

      return {
        success: true,
        role: userData.role,
        user: userData,
      };
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      return {
        success: false,
        message: err.response?.data?.message || "Invalid credentials",
      };
    }
  };

  // =======================
  // REGISTER
  // =======================
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // =======================
  // LOGOUT
  // =======================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
