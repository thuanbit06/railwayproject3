import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Train, MapPin, Calendar, ArrowRight, AlertCircle } from "lucide-react";

const SearchTrain = () => {
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    from: "New Delhi (NDLS)",
    to: "Mumbai (BCT)",
    date: new Date().toISOString().split("T")[0], // Mặc định là hôm nay
    cls: "Executive Class",
  });

  const handleSearch = () => {
    setError("");

    // 1. Validation: Kiểm tra ngày đi
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset giờ để so sánh ngày

    if (selectedDate < today) {
      setError("Departure date cannot be in the past.");
      return;
    }

    if (form.from === form.to) {
      setError("Departure and arrival stations cannot be the same.");
      return;
    }

    // 2. Truyền dữ liệu sang trang kết quả
    // (Trong thực tế ở đây sẽ gọi API: searchTrains(form))
    nav("/trains", {
      state: {
        searchParams: form,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-2">Search Trains</h1>
        <p className="text-sm text-gray-500 mb-6">
          Find the perfect journey across the railway network.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-600">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            icon={<MapPin />}
            label="From"
            value={form.from}
            onChange={(v) => setForm({ ...form, from: v })}
          />
          <Input
            icon={<MapPin />}
            label="To"
            value={form.to}
            onChange={(v) => setForm({ ...form, to: v })}
          />
          <Input
            icon={<Calendar />}
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => setForm({ ...form, date: v })}
            // Giới hạn không chọn ngày quá khứ
            min={new Date().toISOString().split("T")[0]}
          />
          <Input
            icon={<Train />}
            label="Class"
            value={form.cls}
            onChange={(v) => setForm({ ...form, cls: v })}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="mt-6 w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition">
          Search Trains <ArrowRight size={18} />
        </button>

        {/* Note for Demo */}
        <p className="text-center text-xs text-gray-400 mt-4">
          💡 This form simulates a search query. Results are mocked in the next
          screen.
        </p>
      </div>
    </div>
  );
};

/* =======================
    REUSABLE INPUT
======================== */
const Input = ({ icon, label, value, onChange, type = "text", min }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 mb-1 block">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        className="w-full pl-10 pr-4 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition"
      />
    </div>
  </div>
);

export default SearchTrain;
