import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Railway.png";

const Login = () => {
  const navigate = useNavigate();

  const { login, verifyOtp } = useAuth();

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // OTP STATE
  // =========================================================

  const [step, setStep] = useState("login");

  const [otp, setOtp] = useState("");

  const [otpLoading, setOtpLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Email và mật khẩu không được để trống.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      console.log("LOGIN RESULT:", result);

      // =====================================================
      // OTP REQUIRED
      // =====================================================

      if (result.requireOtp) {
        setStep("verify");
        setOtp("");

        return;
      }

      // =====================================================
      // TRƯỜNG HỢP BACKEND KHÔNG YÊU CẦU OTP
      // =====================================================

      const role = result.role || result.user?.role;

      if (!role) {
        setError("Không xác định được quyền người dùng.");
        return;
      }

      redirectByRole(role);
    } catch (error) {
      console.error("LOGIN PAGE ERROR:", error);

      setError(error.message || "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otpLoading) return;

    setError("");

    if (otp.length !== 6) {
      setError("OTP phải gồm đúng 6 chữ số.");
      return;
    }

    setOtpLoading(true);

    try {
      const result = await verifyOtp(form.email, otp);

      console.log("VERIFY OTP RESULT:", result);

      const role = result.role || result.user?.role;

      if (!role) {
        setError("Không xác định được quyền người dùng.");
        return;
      }

      redirectByRole(role);
    } catch (error) {
      console.error("VERIFY OTP PAGE ERROR:", error);

      setError(error.message || "Xác minh OTP thất bại.");
    } finally {
      setOtpLoading(false);
    }
  };

  // =========================================================
  // REDIRECT
  // =========================================================

  const redirectByRole = (role) => {
    if (role === "Admin") {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    navigate("/dashboard", {
      replace: true,
    });
  };

  // =========================================================
  // BACK TO LOGIN
  // =========================================================

  const backToLogin = () => {
    setStep("login");
    setOtp("");
    setError("");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003A8C] via-[#0047B3] to-[#1677FF] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 flex items-center justify-center">
            <img
              src={logo}
              alt="RailLink Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* ===================================================
            LOGIN
        =================================================== */}

        {step === "login" && (
          <>
            <h2 className="text-2xl font-bold text-[#003A8C] mb-1">
              Welcome Back
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Sign in to continue your journey
            </p>

            {/* ERROR */}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}

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
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@raillink.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}

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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1677FF]">
                    {showPassword ?
                      <EyeOff size={16} />
                    : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* REGISTER */}

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#1677FF] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </>
        )}

        {/* ===================================================
            OTP
        =================================================== */}

        {step === "verify" && (
          <>
            <button
              type="button"
              onClick={backToLogin}
              disabled={otpLoading}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1677FF] mb-4">
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="text-center mb-6">
              <ShieldCheck size={48} className="mx-auto text-[#1677FF] mb-2" />

              <h2 className="text-2xl font-bold text-[#003A8C]">
                Verify Your Email
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                We've sent a 6-digit code to
              </p>

              <p className="text-sm font-semibold text-[#003A8C] mt-1 break-all">
                {form.email}
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              {/* OTP */}

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                  setOtp(value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="000000"
                disabled={otpLoading}
                required
                className="w-full text-center tracking-[0.5em] text-xl py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
              />

              {/* VERIFY */}

              <button
                type="submit"
                disabled={otpLoading || otp.length !== 6}
                className="w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60">
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              OTP có hiệu lực trong 5 phút.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
