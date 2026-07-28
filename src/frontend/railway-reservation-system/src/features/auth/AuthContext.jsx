import React, { createContext, useState, useEffect } from "react";
import { authService } from "../../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("railway_token");
    if (token) {
      authService
        .getMe()
        .then((data) => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("railway_token");
          setLoading(false);
        });
    } else setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    localStorage.setItem("railway_token", res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("railway_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
