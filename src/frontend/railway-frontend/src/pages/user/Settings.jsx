import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, Bell, Camera, Eye, EyeOff } from "lucide-react";
import { updateProfile, changePassword } from "../../services/userService";

const Settings = () => {
  const { user, login } = useAuth();

  // Quản lý tab hiện tại: "Profile" | "Security" | "Preferences"
  const [tab, setTab] = useState("Profile");

  // Trạng thái đang lưu (để hiển thị loading)
  const [saving, setSaving] = useState(false);

  // Thông báo (thành công / lỗi)
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Dữ liệu form Profile
  const [profile, setProfile] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@rail.com",
  });

  // Dữ liệu form Đổi mật khẩu
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Dữ liệu Preferences (Tùy chọn)
  const [prefs, setPrefs] = useState({
    darkMode: false,
    emailNoti: true,
    smsAlerts: false,
  });

  /* =======================
     [1] LƯU THÔNG TIN CÁ NHÂN
  ======================== */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      // Gọi API cập nhật profile
      const res = await updateProfile(user.id, profile);
      // Cập nhật lại Context để đồng bộ UI
      login(res.data.token, res.data.user);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    }
  };

  /* =======================
     [2] ĐỔI MẬT KHẨU
  ======================== */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận có khớp không
    if (pwd.new !== pwd.confirm) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    // Kiểm tra độ dài mật khẩu
    if (pwd.new.length < 6) {
      setMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      await changePassword(user.id, pwd.current, pwd.new);
      setMsg({ type: "success", text: "Password changed successfully!" });
      setPwd({ current: "", new: "", confirm: "" }); // Reset form
    } catch (err) {
      setMsg({ type: "error", text: "Current password is incorrect." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    }
  };

  /* =======================
     [3] LƯU TÙY CHỌN (PREFERENCES)
  ======================== */
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Giả lập gọi API (thực tế sẽ gọi API save preferences)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMsg({ type: "success", text: "Preferences saved!" });
    setSaving(false);
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  /* =======================
     [4] RENDER NỘI DUNG TAB
  ======================== */
  const renderTabContent = () => {
    switch (tab) {
      case "Profile":
        return (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {profile.name[0]}
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium">
                <Camera size={16} /> Change Photo
              </button>
            </div>

            {/* Input Họ tên & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(v) => setProfile({ ...profile, name: v })}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(v) => setProfile({ ...profile, email: v })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-60">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        );

      case "Security":
        return (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            {["current", "new", "confirm"].map((k) => (
              <Input
                key={k}
                label={`${k.charAt(0).toUpperCase() + k.slice(1)} Password`}
                type={showPassword ? "text" : "password"}
                value={pwd[k]}
                onChange={(v) => setPwd({ ...pwd, [k]: v })}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ?
                      <EyeOff size={16} />
                    : <Eye size={16} />}
                  </button>
                }
              />
            ))}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-60">
              {saving ? "Updating..." : "Change Password"}
            </button>
          </form>
        );

      case "Preferences":
        return (
          <form onSubmit={handleSavePreferences} className="space-y-4">
            {[
              {
                label: "Dark Mode",
                desc: "Switch to darker theme",
                key: "darkMode",
              },
              {
                label: "Email Notifications",
                desc: "Booking confirmations",
                key: "emailNoti",
              },
              {
                label: "SMS Alerts",
                desc: "Real-time delays",
                key: "smsAlerts",
              },
            ].map((p) => (
              <ToggleSwitch
                key={p.key}
                label={p.label}
                desc={p.desc}
                checked={prefs[p.key]}
                onChange={() => setPrefs({ ...prefs, [p.key]: !prefs[p.key] })}
              />
            ))}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-60">
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  /* =======================
     [5] GIAO DIỆN CHÍNH
  ======================== */
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Thông báo */}
      {msg.text && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar Tab */}
        <aside className="w-full md:w-64 space-y-2">
          {[
            { id: "Profile", icon: User },
            { id: "Security", icon: Lock },
            { id: "Preferences", icon: Bell },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${tab === t.id ? "bg-orange-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
              <t.icon size={18} /> {t.id}
            </button>
          ))}
        </aside>

        {/* Nội dung Tab */}
        <main className="flex-1">{renderTabContent()}</main>
      </div>
    </div>
  );
};

/* =======================
    COMPONENT PHỤ
======================== */
const Input = ({ label, value, onChange, type = "text", icon }) => (
  <div>
    <label className="text-sm font-medium block mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      />
      {icon}
    </div>
  </div>
);

const ToggleSwitch = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div>
      <h4 className="font-semibold">{label}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`${checked ? "bg-blue-600" : "bg-gray-300"} relative inline-flex h-6 w-11 rounded-full transition`}>
      <span
        className={`${checked ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </button>
  </div>
);

export default Settings;
