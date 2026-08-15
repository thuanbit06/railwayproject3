import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Dùng Context
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/Railway.png"; // ✅ Đường dẫn tùy vị trí file

const Login = () => {
  const nav = useNavigate();
  const { login } = useAuth(); // ✅ Lấy hàm login từ Context

  // State quản lý form
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     [1] XỬ LÝ ĐĂNG NHẬP
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gọi hàm login từ Context (đã gọi API bên trong)
      const res = await login(form.email, form.password);

      if (res.success) {
        // Điều hướng theo role
        if (res.role === "Admin") {
          nav("/admin");
        } else {
          nav("/dashboard");
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003A8C] via-[#0047B3] to-[#1677FF] flex items-center justify-center p-6">
      {/* Card đăng nhập */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 flex items-center justify-center">
            <img
              src={logo}
              alt="RailLink Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#003A8C] mb-1">Welcome Back</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to continue your journey
        </p>

        {/* Thông báo lỗi */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="admin@rail.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ?
                  <EyeOff size={16} />
                : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link sang đăng ký */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#1677FF] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

// ✅ BẮT BUỘC CÓ DÒNG NÀY
export default Login;
