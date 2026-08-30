import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Download, TrendingUp, Ticket, Users, Percent } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import analyticsService from "../../services/analyticsService";

const Analytics = () => {
  const [range, setRange] = useState("Month");

  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    activeUsers: 0,
    occupancyRate: null,
    classDistribution: [],
    revenue: [],
    ticketVolume: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await analyticsService.getAnalytics(range);

      setAnalytics({
        totalRevenue: data.totalRevenue ?? 0,
        ticketsSold: data.ticketsSold ?? 0,
        activeUsers: data.activeUsers ?? 0,
        occupancyRate: data.occupancyRate ?? null,
        classDistribution: data.classDistribution ?? [],
        revenue: data.revenue ?? [],
        ticketVolume: data.ticketVolume ?? [],
      });
    } catch (err) {
      console.error("Analytics API Error:", err);

      setError(
        err.response?.data?.message || "Không thể tải dữ liệu Analytics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const stats = [
    {
      label: "Total Revenue",
      value: `$${Number(analytics.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      bg: "bg-green-100",
      c: "text-green-600",
    },
    {
      label: "Tickets Sold",
      value: Number(analytics.ticketsSold || 0).toLocaleString(),
      icon: Ticket,
      bg: "bg-blue-100",
      c: "text-blue-600",
    },
    {
      label: "Occupancy Rate",
      value:
        analytics.occupancyRate !== null ?
          `${analytics.occupancyRate}%`
        : "N/A",
      icon: Percent,
      bg: "bg-orange-100",
      c: "text-orange-600",
    },
    {
      label: "Active Users",
      value: Number(analytics.activeUsers || 0).toLocaleString(),
      icon: Users,
      bg: "bg-purple-100",
      c: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Detailed insights into railway operations."
        actions={[
          {
            label: "Export Report",
            icon: <Download size={16} />,
            primary: true,
          },
        ]}
      />

      {/* Filter */}
      <div className="flex justify-end">
        <div className="bg-white p-1 rounded-xl border border-gray-100 flex gap-1">
          {["Week", "Month", "Year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              disabled={loading}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                range === r ?
                  "bg-orange-500 text-white shadow"
                : "text-gray-500 hover:bg-gray-50"
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border p-6 text-center text-gray-500">
          Loading analytics...
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm border flex items-center gap-4 min-w-0">
            <div className={`p-3 rounded-xl flex-shrink-0 ${s.bg}`}>
              <s.icon size={20} className={s.c} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {s.label}
              </p>

              <p className="text-lg font-bold break-all leading-tight tracking-tight mt-0.5">
                {loading ? "..." : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4">Revenue Overview</h3>

          <div className="h-72">
            {analytics.revenue.length > 0 ?
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                  <XAxis dataKey="name" fontSize={12} />

                  <YAxis fontSize={12} />

                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            : <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No revenue data available.
              </div>
            }
          </div>
        </div>

        {/* Class Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4">Class Distribution</h3>

          {analytics.classDistribution.length > 0 ?
            <>
              <div className="relative h-40 w-40 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.classDistribution}
                      innerRadius={50}
                      outerRadius={65}
                      dataKey="value">
                      {analytics.classDistribution.map((item, index) => (
                        <Cell
                          key={index}
                          fill={
                            [
                              "#2563eb",
                              "#f97316",
                              "#78350f",
                              "#16a34a",
                              "#9333ea",
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-3">
                {analytics.classDistribution.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: [
                            "#2563eb",
                            "#f97316",
                            "#78350f",
                            "#16a34a",
                            "#9333ea",
                          ][index % 5],
                        }}
                      />

                      {item.name}
                    </span>

                    <span className="font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          : <div className="h-40 flex items-center justify-center text-gray-400 text-sm text-center">
              Class distribution data
              <br />
              is not available.
            </div>
          }
        </div>
      </div>

      {/* Ticket Volume */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h3 className="font-bold mb-4">Ticket Volume</h3>

        <div className="h-72">
          {analytics.ticketVolume.length > 0 ?
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.ticketVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />

                <Tooltip />

                <Bar dataKey="tickets" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          : <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No ticket volume data available.
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Analytics;
