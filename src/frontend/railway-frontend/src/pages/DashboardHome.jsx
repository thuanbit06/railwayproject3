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
// import { getDashboardStats } from "../../services/statsService"; // Bật khi có API

// Dữ liệu giả lập (Mock Data) - Sẽ được thay thế bằng API
const mockStats = [
  {
    label: "Total Revenue",
    value: "$352,000",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
    bg: "bg-green-50",
    color: "text-green-600",
  },
  {
    label: "Tickets Sold",
    value: "9,760",
    change: "+8.2%",
    trend: "up",
    icon: Ticket,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    label: "Active Trains",
    value: "142",
    change: "3 cancelled",
    trend: "down",
    icon: Train,
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  {
    label: "Online Users",
    value: "2,148",
    change: "+156",
    trend: "up",
    icon: Users,
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
];

const mockRevenue = [
  { d: "Mon", r: 8200 },
  { d: "Tue", r: 9500 },
  { d: "Wed", r: 11000 },
  { d: "Thu", r: 9800 },
  { d: "Fri", r: 12500 },
  { d: "Sat", r: 15200 },
  { d: "Sun", r: 11200 },
];

const mockDistribution = [
  { name: "Confirmed", value: 68, color: "#22c55e" },
  { name: "Waiting", value: 18, color: "#f97316" },
  { name: "Cancelled", value: 14, color: "#ef4444" },
];

const mockActivities = [
  {
    id: 1,
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
    title: "Booking #48291054 confirmed",
    detail: "Jane Doe • Express 202",
    time: "5 min ago",
  },
  {
    id: 2,
    icon: AlertTriangle,
    color: "text-orange-600 bg-orange-50",
    title: "Train #12002 delayed 15 mins",
    detail: "Bhopal Shatabdi",
    time: "12 min ago",
  },
  {
    id: 3,
    icon: Ticket,
    color: "text-blue-600 bg-blue-50",
    title: "New reservation created",
    detail: "Michael Smith",
    time: "28 min ago",
  },
  {
    id: 4,
    icon: XCircle,
    color: "text-red-600 bg-red-50",
    title: "Booking cancelled",
    detail: "Refund $85.50",
    time: "1 hour ago",
  },
];

const DashboardHome = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  // Giả lập việc gọi API khi component mount
  useEffect(() => {
    // Trong thực tế: getDashboardStats().then(data => setStats(data))
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="p-6">Loading Dashboard...</div>;
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
        {mockStats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p
                className={`text-[10px] font-bold ${s.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                {s.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Revenue This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenue}>
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
                  data={mockDistribution}
                  innerRadius={48}
                  outerRadius={65}
                  dataKey="value">
                  {mockDistribution.map((d, i) => (
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
            {mockDistribution.map((d, i) => (
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
          {mockActivities.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
              <div className={`p-2 rounded-lg ${a.color}`}>
                <a.icon size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-gray-500">{a.detail}</p>
              </div>
              <span className="text-[10px] text-gray-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
