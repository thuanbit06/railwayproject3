import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Railway.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 👇 THÊM STATE CHO OTP
  const [step, setStep] = useState("login"); // "login" | "verify"
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  /* =========================
     LOGIN
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await login(form.email.trim(), form.password);

      if (!result.success) {
        setError(result.message || "Invalid email or password.");
        return;
      }

      // 👇 NẾU CẦN XÁC MINH → CHUYỂN SANG BƯỚC VERIFY
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     XÁC MINH OTP
  ========================= */
  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");

    try {
      // 👇 GỌI API XÁC MINH OTP (BACKEND CẦN HỖ TRỢ)
      const res = await fetch("http://localhost:5159/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid OTP");
      }

      // 👇 THÀNH CÔNG → VÀO HỆ THỐNG
      const { role } = await res.json();
      navigate(role === "Admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "OTP verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003A8C] via-[#0047B3] to-[#1677FF] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 flex items-center justify-center">
            <img
              src={logo}
              alt="RailLink Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {step === "login" ?
          <>
            <h2 className="text-2xl font-bold text-[#003A8C] mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Sign in to continue your journey
            </p>

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
                    className="w-full pl-10 pr-12 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ?
                      <EyeOff size={16} />
                    : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#1677FF] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </>
        : <>
            {/* =========================
                OTP VERIFICATION
            ========================= */}
            <div className="text-center mb-6">
              <ShieldCheck size={48} className="mx-auto text-[#1677FF] mb-2" />
              <h2 className="text-2xl font-bold text-[#003A8C]">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                We've sent a 6-digit code to <b>{form.email}</b>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center tracking-[0.5em] text-xl py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
                required
              />

              <button
                type="submit"
                disabled={otpLoading || otp.length !== 6}
                className="w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60">
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Didn't receive code?{" "}
              <button className="text-[#1677FF] font-semibold">Resend</button>
            </p>
          </>
        }
      </div>
    </div>
  );
};

export default Login;
