import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import logo from "../../assets/Railway.png";

const Register = () => {
  const nav = useNavigate();
  const { register } = useAuth();
  const nameRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* =======================
     AUTO FOCUS
  ======================== */
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  /* =======================
     INPUT HANDLER
  ======================== */
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  }, []);

  /* =======================
     VALIDATION
  ======================== */
  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }

    if (name.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  /* =======================
     SUBMIT
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
      );

      if (result.success) {
        setSuccess(true);

        setTimeout(() => {
          nav("/login", {
            state: {
              registered: true,
            },
          });
        }, 2000);
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     SUCCESS SCREEN
  ======================== */
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003A8C] via-[#0047B3] to-[#1677FF] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
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

          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-[#003A8C] mb-1">
            Registration Successful
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Your account has been created successfully.
            <br />
            Redirecting to login...
          </p>

          <Link
            to="/login"
            className="block w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl transition">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  /* =======================
     REGISTER UI
  ======================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003A8C] via-[#0047B3] to-[#1677FF] flex items-center justify-center p-6">
      {/* Card đăng ký */}
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#003A8C] mb-1">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Join us to start your journey
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Full Name
            </label>

            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                ref={nameRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Arjun Sharma"
                className="w-full pl-10 pr-4 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@rail.com"
                className="w-full pl-10 pr-4 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
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

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPwd ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirmPwd ?
                  <EyeOff size={16} />
                : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#1677FF] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
