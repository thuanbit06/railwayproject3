import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  Train,
  Calendar,
  Ticket,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Plus,
  RefreshCw,
} from "lucide-react";

import logo from "../../assets/Railway.png";
import api from "../../services/api";
import { getRecentReservations } from "../../services/adminReservationService";

const AdminDashboard = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, logout } = useAuth();

  // =========================================================
  // STATE
  // =========================================================

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTrains: 0,
      totalReservations: 0,
      ticketsSold: 0,
      totalRevenue: 0,
    },
    revenue: [],
    distribution: [],
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [statsError, setStatsError] = useState("");

  // =========================================================
  // MENU
  // =========================================================

  const items = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: Train,
      label: "Train Schedule",
      path: "/admin/trains",
    },
    {
      icon: Calendar,
      label: "Reservations",
      path: "/admin/reservations",
    },
    {
      icon: Ticket,
      label: "Tickets",
      path: "/admin/tickets",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  // =========================================================
  // PAGE TITLE
  // =========================================================

  const pageTitle = useMemo(() => {
    if (loc.pathname.includes("/trains")) {
      return "Train Schedule";
    }

    if (loc.pathname.includes("/reservations")) {
      return "Reservations";
    }

    if (loc.pathname.includes("/tickets")) {
      return "Tickets";
    }

    if (loc.pathname.includes("/analytics")) {
      return "Analytics";
    }

    if (loc.pathname.includes("/settings")) {
      return "Settings";
    }

    return "Dashboard";
  }, [loc.pathname]);

  // =========================================================
  // GET DASHBOARD STATISTICS
  // =========================================================

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      setStatsError("");

      const response = await api.get("/admin/stats");

      const data = response.data || {};

      setDashboardData({
        stats: {
          totalTrains: Number(data.stats?.totalTrains || 0),
          totalReservations: Number(data.stats?.totalReservations || 0),
          ticketsSold: Number(data.stats?.ticketsSold || 0),
          totalRevenue: Number(data.stats?.totalRevenue || 0),
        },

        revenue: Array.isArray(data.revenue) ? data.revenue : [],

        distribution: Array.isArray(data.distribution) ? data.distribution : [],
      });
    } catch (error) {
      console.error("Failed to load dashboard statistics:", error);

      setStatsError(
        error.response?.data?.message || "Failed to load dashboard statistics.",
      );
    } finally {
      setLoadingStats(false);
    }
  };

  // =========================================================
  // GET RECENT RESERVATIONS
  // =========================================================

  const fetchRecentReservations = async () => {
    try {
      setLoadingRecent(true);

      const response = await getRecentReservations(5);

      const data = response.data;

      setRecent(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load recent reservations:", error);
      setRecent([]);
    } finally {
      setLoadingRecent(false);
    }
  };

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {
    if (loc.pathname === "/admin/dashboard") {
      fetchDashboardStats();
      fetchRecentReservations();
    }
  }, [loc.pathname]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    await Promise.all([fetchDashboardStats(), fetchRecentReservations()]);
  };

  // =========================================================
  // SIDEBAR
  // =========================================================

  const Sidebar = () => (
    <aside className="h-full flex flex-col justify-between">
      {/* =========================
          TOP
      ========================== */}

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* LOGO */}

        <div className="relative flex items-center justify-center mb-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="lg:hidden absolute right-0 top-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
            <X size={22} />
          </button>

          <div
            className="group flex items-center justify-center cursor-pointer"
            onClick={() => {
              nav("/admin/dashboard");
              setOpen(false);
            }}>
            <img
              src={logo}
              alt="RailLink Premium"
              className="h-14 sm:h-16 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="space-y-1.5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Management
          </p>

          {items.map((item) => {
            const active =
              loc.pathname === item.path ||
              loc.pathname.startsWith(`${item.path}/`);

            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  nav(item.path);
                  setOpen(false);
                }}
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    active ?
                      "bg-[#004ac6] text-white shadow-md shadow-blue-200"
                    : "text-[#434655] hover:bg-[#eff4ff] hover:text-[#004ac6]"
                  }
                `}>
                <Icon size={19} strokeWidth={2} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* =========================
          BOTTOM
      ========================== */}

      <div className="shrink-0 border-t border-gray-200 pt-4 mt-4 space-y-1.5">
        <button
          type="button"
          onClick={() => {
            nav("/admin/help");
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-[#eff4ff] hover:text-[#004ac6] transition">
          <HelpCircle size={19} />

          <span>Help & Support</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition">
          <LogOut size={19} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* OVERLAY */}

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}

          <aside className="relative z-10 w-[280px] max-w-[85vw] h-full bg-white p-6 shadow-2xl">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          fixed
          top-0
          left-0
          right-0
          z-40
          h-[72px]
          bg-white/95
          backdrop-blur-xl
          border-b
          border-[#c3c6d7]
          shadow-sm
        ">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-[#eff4ff] text-gray-700">
            <Menu size={23} />
          </button>

          {/* PAGE TITLE */}

          <div className="hidden sm:block min-w-0">
            <h1
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontWeight: 800,
                textTransform: "uppercase",
                color: "#0000ff",
                WebkitTextStroke: "2px #0000ff",
                WebkitTextFillColor: "transparent",
              }}
              className="text-lg lg:text-xl truncate">
              {pageTitle}
            </h1>
          </div>

          {/* SEARCH */}

          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trains, tickets, reservations..."
                className="
                  w-full
                  pl-11
                  pr-4
                  py-2.5
                  bg-[#eff4ff]
                  border
                  border-transparent
                  rounded-full
                  text-sm
                  outline-none
                  focus:bg-white
                  focus:border-[#004ac6]
                  focus:ring-2
                  focus:ring-blue-100
                  transition
                "
              />
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2 sm:gap-4">
            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              className="p-2.5 rounded-full hover:bg-[#eff4ff] transition"
              title="Refresh dashboard">
              <RefreshCw size={19} className="text-[#434655]" />
            </button>

            {/* NOTIFICATION */}

            <button
              type="button"
              className="relative p-2.5 rounded-full hover:bg-[#eff4ff] transition">
              <Bell size={20} className="text-[#434655]" />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* USER */}

            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  rounded-full
                  bg-gradient-to-br
                  from-[#004ac6]
                  to-[#2563eb]
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  shadow-sm
                ">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#0b1c30]">
                  {user?.name || "Admin"}
                </p>

                <p className="text-[11px] text-gray-500">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        className="
          hidden
          lg:flex
          fixed
          left-0
          top-[72px]
          bottom-0
          w-[280px]
          bg-white
          border-r
          border-[#c3c6d7]
          p-6
          z-30
        ">
        <Sidebar />
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="lg:ml-[280px] pt-[72px] min-h-screen">
        <main className="min-h-[calc(100vh-72px)]">
          {/* =================================================
              DASHBOARD
          ================================================== */}

          {loc.pathname === "/admin/dashboard" && (
            <>
              {/* DASHBOARD HEADER */}

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-[1440px] mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
                        Dashboard
                      </h2>

                      <p className="text-sm text-[#434655] mt-1">
                        Welcome back, {user?.name || "Admin"}. Here's what's
                        happening today.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => nav("/admin/reservations")}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          px-5
                          py-3
                          bg-[#004ac6]
                          hover:bg-[#003ea8]
                          text-white
                          rounded-xl
                          font-semibold
                          text-sm
                          shadow-md
                          shadow-blue-200
                          transition
                        ">
                        <Plus size={18} />
                        New Reservation
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ERROR */}

              {statsError && (
                <div className="px-4 sm:px-6 lg:px-8 mb-6">
                  <div className="max-w-[1440px] mx-auto rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {statsError}
                  </div>
                </div>
              )}

              {/* =================================================
                  STATISTICS
              ================================================== */}

              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Trains</p>

                      <h3 className="text-3xl font-bold text-[#0b1c30] mt-2">
                        {loadingStats ?
                          "..."
                        : dashboardData.stats.totalTrains.toLocaleString()}
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        Active railway fleet
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Train size={24} className="text-[#004ac6]" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Reservations</p>

                      <h3 className="text-3xl font-bold text-[#0b1c30] mt-2">
                        {loadingStats ?
                          "..."
                        : dashboardData.stats.totalReservations.toLocaleString()
                        }
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        Total bookings
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Calendar size={24} className="text-orange-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Tickets Sold</p>

                      <h3 className="text-3xl font-bold text-[#0b1c30] mt-2">
                        {loadingStats ?
                          "..."
                        : dashboardData.stats.ticketsSold.toLocaleString()}
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        Issued tickets
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Ticket size={24} className="text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Total Revenue</p>

                      <h3 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] mt-2 truncate">
                        {loadingStats ?
                          "..."
                        : `${dashboardData.stats.totalRevenue.toLocaleString(
                            "vi-VN",
                          )} ₫`
                        }
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        Booking revenue
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <BarChart3 size={24} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  DASHBOARD GRID
              ================================================== */}

              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
                {/* REVENUE */}

                <div className="xl:col-span-2 bg-white rounded-2xl border border-[#c3c6d7] shadow-sm p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Revenue Overview</h3>

                      <p className="text-sm text-gray-500">
                        Revenue performance over the last 7 days
                      </p>
                    </div>

                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none">
                      <option>Last 7 days</option>
                      <option>This year</option>
                    </select>
                  </div>

                  {/* CHART */}

                  {dashboardData.revenue.length > 0 ?
                    <div className="h-64 flex items-end gap-3 sm:gap-5 border-b border-gray-200 px-2">
                      {dashboardData.revenue.map((item, index) => {
                        const values = dashboardData.revenue.map((x) =>
                          Number(x.revenue || 0),
                        );

                        const maxRevenue = Math.max(...values, 1);

                        const height =
                          (Number(item.revenue || 0) / maxRevenue) * 100;

                        return (
                          <div
                            key={item.date || index}
                            className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                            <div
                              style={{
                                height: `${Math.max(height, 5)}%`,
                              }}
                              className="
                                w-full
                                max-w-[55px]
                                bg-gradient-to-t
                                from-[#004ac6]
                                to-[#60a5fa]
                                rounded-t-lg
                                hover:opacity-80
                                transition
                                cursor-pointer
                              "
                              title={`${Number(
                                item.revenue || 0,
                              ).toLocaleString("vi-VN")} ₫`}
                            />

                            <span className="text-[10px] sm:text-xs text-gray-400">
                              {item.label || item.date || `Day ${index + 1}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  : <div className="h-64 flex items-center justify-center text-sm text-gray-400">
                      No revenue data available.
                    </div>
                  }
                </div>

                {/* QUICK ACTIONS */}

                <div className="bg-white rounded-2xl border border-[#c3c6d7] shadow-sm p-5 lg:p-6">
                  <h3 className="text-lg font-bold mb-1">Quick Actions</h3>

                  <p className="text-sm text-gray-500 mb-5">
                    Frequently used management tools
                  </p>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => nav("/admin/trains")}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#eff4ff] hover:bg-blue-100 text-left transition">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Train size={20} className="text-[#004ac6]" />
                      </div>

                      <div>
                        <p className="font-semibold text-sm">Manage Trains</p>

                        <p className="text-xs text-gray-500">
                          Add or edit trains
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => nav("/admin/reservations")}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-left transition">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Calendar size={20} className="text-orange-500" />
                      </div>

                      <div>
                        <p className="font-semibold text-sm">Reservations</p>

                        <p className="text-xs text-gray-500">Manage bookings</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => nav("/admin/tickets")}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-left transition">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Ticket size={20} className="text-purple-600" />
                      </div>

                      <div>
                        <p className="font-semibold text-sm">Tickets</p>

                        <p className="text-xs text-gray-500">
                          View issued tickets
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </section>

              {/* =================================================
                  RECENT RESERVATIONS
              ================================================== */}

              <section className="mt-6 mx-4 sm:mx-6 lg:mx-8 bg-white rounded-2xl border border-[#c3c6d7] shadow-sm overflow-hidden">
                <div className="p-5 lg:p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Recent Reservations</h3>

                    <p className="text-sm text-gray-500">
                      Latest booking activity
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => nav("/admin/reservations")}
                    className="text-sm font-semibold text-[#004ac6] hover:underline">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr className="bg-[#eff4ff] text-left">
                        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                          Passenger
                        </th>

                        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                          Train
                        </th>

                        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                          Date
                        </th>

                        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                          PNR
                        </th>

                        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {loadingRecent ?
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-10 text-center text-sm text-gray-400">
                            Loading reservations...
                          </td>
                        </tr>
                      : recent.length === 0 ?
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-10 text-center text-sm text-gray-400">
                            No recent reservations found.
                          </td>
                        </tr>
                      : recent.map((r, index) => (
                          <tr
                            key={r.id || index}
                            className="hover:bg-[#f8f9ff] transition">
                            <td className="px-5 py-4">
                              <p className="font-semibold text-sm">
                                {r.passengerName ||
                                  r.userName ||
                                  "Unknown Passenger"}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                              {r.trainName || "Unknown Train"}

                              {r.trainNo && (
                                <span className="text-gray-400 ml-1">
                                  ({r.trainNo})
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                              {r.journeyDate || r.travelDate || "-"}
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-[#004ac6]">
                              {r.pnr || "-"}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`
                                  inline-flex
                                  px-3
                                  py-1
                                  rounded-full
                                  text-xs
                                  font-semibold

                                  ${
                                    r.status === "Confirmed" ?
                                      "bg-emerald-50 text-emerald-600"
                                    : r.status === "Waiting" ?
                                      "bg-orange-50 text-orange-600"
                                    : "bg-red-50 text-red-600"
                                  }
                                `}>
                                {r.status || "Unknown"}
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* =================================================
              CHILD ROUTES
          ================================================== */}

          {loc.pathname !== "/admin/dashboard" && (
            <div className="px-4 sm:px-6 lg:px-8 pb-8">
              <div className="max-w-[1440px] mx-auto">
                <Outlet />
              </div>
            </div>
          )}
        </main>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="border-t border-[#c3c6d7] bg-white px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#004ac6]">RailLink Premium</p>

              <p className="text-xs text-gray-500 mt-1">
                Railway Management System
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-500">
              <button type="button" className="hover:text-[#004ac6]">
                About
              </button>

              <button type="button" className="hover:text-[#004ac6]">
                Contact
              </button>

              <button type="button" className="hover:text-[#004ac6]">
                Policies
              </button>

              <button type="button" className="hover:text-[#004ac6]">
                Terms
              </button>

              <button type="button" className="hover:text-[#004ac6]">
                Privacy
              </button>
            </div>

            <p className="text-xs text-gray-400">© 2026 RailLink Premium</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
