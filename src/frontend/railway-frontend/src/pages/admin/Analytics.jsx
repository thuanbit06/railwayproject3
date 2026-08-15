import React, { useState } from "react";
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

const Analytics = () => {
  const [range, setRange] = useState("Month");

  const rev = {
    Week: [
      { n: "Mon", r: 8200 },
      { n: "Tue", r: 9500 },
      { n: "Wed", r: 11000 },
      { n: "Thu", r: 9800 },
      { n: "Fri", r: 12500 },
      { n: "Sat", r: 15200 },
      { n: "Sun", r: 11200 },
    ],
    Month: [
      { n: "Jan", r: 42000 },
      { n: "Feb", r: 51000 },
      { n: "Mar", r: 47000 },
      { n: "Apr", r: 63000 },
      { n: "May", r: 58000 },
      { n: "Jun", r: 72000 },
    ],
    Year: [
      { n: "2021", r: 480000 },
      { n: "2022", r: 560000 },
      { n: "2023", r: 620000 },
      { n: "2024", r: 720000 },
    ],
  };

  const vol = {
    Week: [
      { n: "Mon", t: 220 },
      { n: "Tue", t: 310 },
      { n: "Wed", t: 280 },
      { n: "Thu", t: 350 },
      { n: "Fri", t: 410 },
      { n: "Sat", t: 520 },
      { n: "Sun", t: 390 },
    ],
    Month: [
      { n: "Jan", t: 1200 },
      { n: "Feb", t: 1450 },
      { n: "Mar", t: 1380 },
      { n: "Apr", t: 1890 },
      { n: "May", t: 1740 },
      { n: "Jun", t: 2100 },
    ],
    Year: [
      { n: "2021", t: 14500 },
      { n: "2022", t: 16800 },
      { n: "2023", t: 18200 },
      { n: "2024", t: 21000 },
    ],
  };

  const dist = [
    { name: "AC First", value: 22, color: "#2563eb" },
    { name: "AC Second", value: 35, color: "#f97316" },
    { name: "Sleeper", value: 43, color: "#78350f" },
  ];

  const totalRev = rev[range]?.reduce((s, i) => s + i.r, 0) || 0;
  const totalTkt = vol[range]?.reduce((s, i) => s + i.t, 0) || 0;

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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Revenue",
            value: `$${totalRev.toLocaleString()}`,
            icon: TrendingUp,
            bg: "bg-green-100",
            c: "text-green-600",
          },
          {
            label: "Tickets Sold",
            value: totalTkt.toLocaleString(),
            icon: Ticket,
            bg: "bg-blue-100",
            c: "text-blue-600",
          },
          {
            label: "Occupancy Rate",
            value: "84%",
            icon: Percent,
            bg: "bg-orange-100",
            c: "text-orange-600",
          },
          {
            label: "Active Users",
            value: "2,148",
            icon: Users,
            bg: "bg-purple-100",
            c: "text-purple-600",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm border flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}>
              <s.icon size={20} className={s.c} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4">Revenue Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rev[range]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="n" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4">Class Distribution</h3>
          <div className="relative h-40 w-40 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dist}
                  innerRadius={50}
                  outerRadius={65}
                  dataKey="value">
                  {dist.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black">100%</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {dist.map((d, i) => (
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

      {/* Ticket Volume Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h3 className="font-bold mb-4">Ticket Volume</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vol[range]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="n" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="t" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
