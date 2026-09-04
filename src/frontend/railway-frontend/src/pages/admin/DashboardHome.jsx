import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Train,
  Calendar,
  Ticket,
  BarChart3,
  Users,
  AlertTriangle,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getDashboardStatistics } from "../../services/statsService";

const DashboardHome = () => {
  const nav = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    stats: {
      totalTrains: 0,
      totalReservations: 0,
      ticketsSold: 0,
      totalRevenue: 0,
      todayBookings: 0,
      newCustomers: 0,
      waitingBookings: 0,
    },
    revenue: [],
    distribution: [],
  });

  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const result = await getDashboardStatistics();

        setData({
          stats: {
            totalTrains: Number(result?.stats?.totalTrains ?? 0),
            totalReservations: Number(result?.stats?.totalReservations ?? 0),
            ticketsSold: Number(result?.stats?.ticketsSold ?? 0),
            totalRevenue: Number(result?.stats?.totalRevenue ?? 0),
            todayBookings: Number(result?.stats?.todayBookings ?? 0),
            newCustomers: Number(result?.stats?.newCustomers ?? 0),
            waitingBookings: Number(result?.stats?.waitingBookings ?? 0),
          },

          revenue: Array.isArray(result?.revenue) ? result.revenue : [],

          distribution:
            Array.isArray(result?.distribution) ? result.distribution : [],
        });
      } catch (err) {
        console.error("Dashboard error:", err);

        if (err?.response?.status === 401) {
          nav("/login", { replace: true });
          return;
        }

        if (err?.response?.status === 403) {
          setError("You do not have permission to access the admin dashboard.");
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [nav],
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US");
  };

  const formatCurrency = (value) => {
    return `${Number(value || 0).toLocaleString("vi-VN")} ₫`;
  };

  // =========================================================
  // STATS CARDS
  // =========================================================

  const statsCards = [
    {
      title: "Total Trains",
      value: data.stats.totalTrains,
      description: "Active railway fleet",
      icon: Train,
      iconBg: "bg-blue-50",
      iconColor: "text-[#004ac6]",
    },
    {
      title: "Reservations",
      value: data.stats.totalReservations,
      description: "Total bookings",
      icon: Calendar,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "Tickets Sold",
      value: data.stats.ticketsSold,
      description: "Issued tickets",
      icon: Ticket,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data.stats.totalRevenue),
      description: "Successful payments",
      icon: BarChart3,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      currency: true,
    },
  ];

  // =========================================================
  // PIE TOTAL
  // =========================================================

  const ticketTotal = data.distribution.reduce(
    (sum, item) => sum + Number(item?.value || 0),
    0,
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-52 bg-gray-200 rounded-lg" />
            <div className="h-4 w-72 bg-gray-200 rounded mt-3" />
          </div>

          <div className="h-11 w-40 bg-gray-200 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 bg-white rounded-2xl border border-gray-200"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-80 bg-white rounded-2xl border border-gray-200" />
          <div className="h-80 bg-white rounded-2xl border border-gray-200" />
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
            Dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Railway management overview
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-gray-800">
            Unable to load dashboard
          </h3>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <button
            type="button"
            onClick={() => loadDashboard()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#003ea8] transition">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER (GIAO DIỆN ĐÃ ĐƯỢC CHỈNH SỬA CLASS TAILWIND)
  // =========================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
            Dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening across RailLink Premium.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-60">
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => nav("/admin/reservations")}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-200 transition">
            <Plus size={18} />
            New Reservation
          </button>
        </div>
      </div>

      {/* STATISTICS - SỬA LỖI TRÀN CHỮ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {statsCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.title}-${index}`}
              className="bg-white rounded-2xl border border-[#c3c6d7] p-4 sm:p-5 shadow-sm hover:shadow-md transition flex items-center justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                  {item.title}
                </p>

                <h3
                  className={`font-bold text-[#0b1c30] mt-1 sm:mt-2 leading-tight tracking-tight break-words ${
                    item.currency ?
                      "text-lg sm:text-xl xl:text-2xl"
                    : "text-2xl sm:text-3xl"
                  }`}>
                  {item.currency ? item.value : formatNumber(item.value)}
                </h3>

                <p className="text-xs text-emerald-600 mt-1.5 sm:mt-2 font-medium">
                  {item.description}
                </p>
              </div>

              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={22} className={item.iconColor} />
              </div>
            </div>
          );
        })}
      </section>

      {/* EXTRA DAILY STATS - SỬA LỖI TRÀN CHỮ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-[#004ac6]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Today's Bookings
              </p>

              <p className="text-lg sm:text-xl font-bold text-[#0b1c30] leading-tight break-words">
                {formatNumber(data.stats.todayBookings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Users size={20} className="text-purple-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                New Customers Today
              </p>

              <p className="text-lg sm:text-xl font-bold text-[#0b1c30] leading-tight break-words">
                {formatNumber(data.stats.newCustomers)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-orange-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Waiting Bookings
              </p>

              <p className="text-lg sm:text-xl font-bold text-[#0b1c30] leading-tight break-words">
                {formatNumber(data.stats.waitingBookings)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHARTS */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* REVENUE */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#c3c6d7] shadow-sm p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Revenue Overview
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Successful payment revenue over the last 7 days
              </p>
            </div>

            <div className="px-3 py-2 rounded-lg bg-[#eff4ff] text-xs font-semibold text-[#004ac6] self-start sm:self-auto">
              Last 7 Days
            </div>
          </div>

          {data.revenue.length === 0 ?
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No revenue data available.
            </div>
          : <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.revenue}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop
                        offset="5%"
                        stopColor="#004ac6"
                        stopOpacity={0.25}
                      />

                      <stop offset="95%" stopColor="#004ac6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `${(Number(value) / 1000000).toFixed(1)}M`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#004ac6"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          }
        </div>

        {/* TICKET STATUS */}
        <div className="bg-white rounded-2xl border border-[#c3c6d7] shadow-sm p-5 lg:p-6">
          <h3 className="text-lg font-bold text-[#0b1c30]">Ticket Status</h3>

          <p className="text-sm text-gray-500 mt-1">
            Current ticket distribution
          </p>

          {data.distribution.length === 0 ?
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No ticket data available.
            </div>
          : <>
              <div className="relative h-48 w-48 mx-auto mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.distribution}
                      innerRadius={58}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                      fill="#004ac6"
                      stroke="#ffffff"
                      strokeWidth={2}>
                      {data.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#000033]">
                    {ticketTotal}%
                  </span>

                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Total
                  </span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {data.distribution.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />

                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>

                    <span className="text-sm font-bold text-[#0b1c30]">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          }
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="bg-white rounded-2xl border border-[#c3c6d7] shadow-sm p-5 lg:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-[#0b1c30]">Quick Actions</h3>

          <p className="text-sm text-gray-500 mt-1">
            Frequently used management tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => nav("/admin/trains")}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#eff4ff] hover:bg-blue-100 text-left transition">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0">
              <Train size={21} className="text-[#004ac6]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-[#0b1c30]">
                Manage Trains
              </p>

              <p className="text-xs text-gray-500 mt-1">Add or edit trains</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => nav("/admin/reservations")}
            className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-left transition">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0">
              <Calendar size={21} className="text-orange-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-[#0b1c30]">
                Reservations
              </p>

              <p className="text-xs text-gray-500 mt-1">Manage bookings</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => nav("/admin/tickets")}
            className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-left transition">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0">
              <Ticket size={21} className="text-purple-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-[#0b1c30]">Tickets</p>

              <p className="text-xs text-gray-500 mt-1">View issued tickets</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
