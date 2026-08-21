import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Ticket,
  Train,
  Users,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardStats } from "../../services/statsService"; // 👈 1. Import service

// Icon mapping (để map string từ API thành Component)
const iconMap = {
  TrendingUp,
  Ticket,
  Train,
  Users,
};

const DashboardHome = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  // 👇 2. Tạo state để lưu dữ liệu từ API
  const [stats, setStats] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [activities, setActivities] = useState([]);

  // 👇 3. Gọi API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        // Giả sử API trả về đúng cấu trúc này
        setStats(data.stats || []);
        setRevenue(data.revenue || []);
        setDistribution(data.distribution || []);
        setActivities(data.activities || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        // Có thể chuyển hướng về login nếu lỗi 401
        if (error.response?.status === 401) {
          nav("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nav]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading Dashboard...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, Admin 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening today.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-blue-200">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const IconComponent = iconMap[s.icon]; // 👈 Map icon từ string sang Component
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${s.bg}`}>
                {IconComponent && (
                  <IconComponent size={20} className={s.color} />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
                <p
                  className={`text-[10px] font-bold ${
                    s.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}>
                  {s.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Revenue This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                {" "}
                {/* 👈 Dùng dữ liệu thật */}
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="d" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="r"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Ticket Status</h3>
          <div className="relative h-40 w-40 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution} // 👈 Dùng dữ liệu thật
                  innerRadius={48}
                  outerRadius={65}
                  dataKey="value">
                  {distribution.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black">100%</span>
              <span className="text-[10px] text-gray-500 uppercase">Total</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {distribution.map((d, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: d.color }}
                  />
                  {d.name}
                </span>
                <span className="font-bold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {activities.map((a) => {
            // 👈 Dùng dữ liệu thật
            const ActivityIcon = iconMap[a.icon];
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                <div className={`p-2 rounded-lg ${a.color}`}>
                  {ActivityIcon && <ActivityIcon size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.detail}</p>
                </div>
                <span className="text-[10px] text-gray-400">{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
