import React, { useState } from "react";
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
} from "lucide-react";
import logo from "../../assets/Railway.png";

const AdminDashboard = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  /*
   * ============================
   * API READY
   * ============================
   *
   * Sau này có thể gọi:
   *
   * GET /api/admin/dashboard
   * GET /api/admin/trains
   * GET /api/admin/reservations
   * GET /api/admin/tickets
   *
   * Không cần thay đổi layout.
   */

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const Sidebar = () => (
    <aside className="h-full flex flex-col justify-between">
      {/* PHẦN TRÊN: LOGO & NAVIGATION (Có cuộn nếu màn hình ngắn) */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
        {/* LOGO */}
        <div className="relative shrink-0 flex items-center justify-center mb-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="lg:hidden absolute right-0 top-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition z-10">
            <X size={22} />
          </button>

          <div
            className="group flex items-center justify-center cursor-pointer"
            onClick={() => nav("/admin/dashboard")}>
            {/* Giảm kích thước logo về mức hợp lý (h-14 đến h-16) */}
            <img
              src={logo}
              alt="RailLink Admin"
              className="h-14 sm:h-16 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-1.5 mt-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Management
          </p>

          {items.map((item, index) => {
            const active =
              loc.pathname === item.path ||
              loc.pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <button
                key={index}
                onClick={() => {
                  nav(item.path);
                  setOpen(false);
                }}
                className={`
                w-full flex items-center gap-3
                px-4 py-2.5
                rounded-xl
                text-sm font-medium
                transition-all duration-200
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

      {/* PHẦN DƯỚI: NÚT SUPPORT & LOGOUT (Cố định ở đáy sidebar) */}
      <div className="shrink-0 border-t border-gray-200 pt-4 mt-3 space-y-1.5">
        <button
          onClick={() => nav("/admin/help")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-[#eff4ff] hover:text-[#004ac6] transition">
          <HelpCircle size={19} />
          <span>Help & Support</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition">
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <aside className="relative z-10 w-[280px] max-w-[85vw] h-full bg-white p-5 shadow-2xl">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* =====================================================
          TOP NAVBAR — fixed, full width, tràn lên trên sidebar
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
              className="text-lg lg:text-xl font-bold text-[#0b1c30] truncate">
              {loc.pathname.includes("trains") ?
                "Train Schedule"
              : loc.pathname.includes("reservations") ?
                "Reservations"
              : loc.pathname.includes("tickets") ?
                "Tickets"
              : loc.pathname.includes("analytics") ?
                "Analytics"
              : "Dashboard"}
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
                    pl-11 pr-4 py-2.5
                    bg-[#eff4ff]
                    border border-transparent
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
            {/* Notification */}

            <button className="relative p-2.5 rounded-full hover:bg-[#eff4ff] transition">
              <Bell size={20} className="text-[#434655]" />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* User */}

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#004ac6] to-[#2563eb] flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#0b1c30]">Admin</p>

                <p className="text-[11px] text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          DESKTOP SIDEBAR — bắt đầu dưới header (top-[72px])
      ====================================================== */}

      <aside className="hidden lg:flex fixed left-0 top-[72px] bottom-0 w-[280px] bg-white border-r border-[#c3c6d7] p-6 z-30">
        <Sidebar />
      </aside>

      {/* =====================================================
          MAIN AREA — margin trái cho sidebar, padding top cho header
      ====================================================== */}

      <div className="lg:ml-[280px] pt-[72px] min-h-screen">
        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <main className="min-h-[calc(100vh-72px)]">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
            {/* Dashboard Header */}

            {loc.pathname === "/admin/dashboard" && (
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
                      Dashboard
                    </h2>

                    <p className="text-sm text-[#434655] mt-1">
                      Welcome back, Admin. Here's what's happening today.
                    </p>
                  </div>

                  <button
                    onClick={() => nav("/admin/reservations")}
                    className="
                    flex items-center justify-center gap-2
                    px-5 py-3
                    bg-[#004ac6]
                    hover:bg-[#003ea8]
                    text-white
                    rounded-xl
                    font-semibold
                    text-sm
                    shadow-md shadow-blue-200
                    transition
                  ">
                    <Plus size={18} />
                    New Reservation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              DASHBOARD STATISTICS
          ================================================== */}

          {loc.pathname === "/admin/dashboard" && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
                {/* Total Trains */}

                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Trains</p>

                      <h3 className="text-3xl font-bold text-[#0b1c30] mt-2">
                        128
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        +8.2% this month
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Train size={24} className="text-[#004ac6]" />
                    </div>
                  </div>
                </div>

                {/* Reservations */}

                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Reservations</p>

                      <h3 className="text-3xl font-bold text-[#0b1c30] mt-2">
                        1,248
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        +12.5% this month
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Calendar size={24} className="text-orange-500" />
                    </div>
                  </div>
                </div>

                {/* Tickets */}

                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Tickets Sold</p>

                      <h3 className="text-3xl font-bold text-[#0b1c30] mt-2">
                        3,842
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        +18.7% this month
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Ticket size={24} className="text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Revenue */}

                <div className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>

                      <h3 className="text-3xl font-bold text-[#0b1c30] mt-2">
                        $84.2K
                      </h3>

                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        +15.4% this month
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <BarChart3 size={24} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  MAIN DASHBOARD GRID
              ================================================== */}

              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
                {/* Revenue */}

                <div className="xl:col-span-2 bg-white rounded-2xl border border-[#c3c6d7] shadow-sm p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Revenue Overview</h3>

                      <p className="text-sm text-gray-500">
                        Monthly revenue performance
                      </p>
                    </div>

                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none">
                      <option>Last 7 months</option>
                      <option>This year</option>
                    </select>
                  </div>

                  {/* Simple Chart Placeholder */}

                  <div className="h-64 flex items-end gap-3 sm:gap-5 border-b border-gray-200 px-2">
                    {[45, 62, 52, 75, 68, 88, 96].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                        <div
                          style={{
                            height: `${height}%`,
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
                            "
                        />

                        <span className="text-[10px] sm:text-xs text-gray-400">
                          {
                            ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][
                              index
                            ]
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}

                <div className="bg-white rounded-2xl border border-[#c3c6d7] shadow-sm p-5 lg:p-6">
                  <h3 className="text-lg font-bold mb-1">Quick Actions</h3>

                  <p className="text-sm text-gray-500 mb-5">
                    Frequently used management tools
                  </p>

                  <div className="space-y-3">
                    <button
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

              <section className="mt-6 bg-white rounded-2xl border border-[#c3c6d7] shadow-sm overflow-hidden mx-4 sm:mx-6 lg:mx-8 max-w-[1440px] lg:mx-auto">
                <div className="p-5 lg:p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Recent Reservations</h3>

                    <p className="text-sm text-gray-500">
                      Latest booking activity
                    </p>
                  </div>

                  <button
                    onClick={() => nav("/admin/reservations")}
                    className="text-sm font-semibold text-[#004ac6] hover:underline">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
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
                          Amount
                        </th>

                        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {[
                        {
                          name: "Nguyen Van An",
                          train: "RL101 Express",
                          date: "18 Aug 2026",
                          amount: "$120",
                          status: "Confirmed",
                        },
                        {
                          name: "Tran Minh Anh",
                          train: "RL205 Premium",
                          date: "18 Aug 2026",
                          amount: "$185",
                          status: "Confirmed",
                        },
                        {
                          name: "Le Hoang Nam",
                          train: "RL310 Express",
                          date: "17 Aug 2026",
                          amount: "$95",
                          status: "Pending",
                        },
                        {
                          name: "Pham Thu Ha",
                          train: "RL402 Premium",
                          date: "17 Aug 2026",
                          amount: "$220",
                          status: "Confirmed",
                        },
                      ].map((reservation, index) => (
                        <tr
                          key={index}
                          className="hover:bg-[#f8f9ff] transition">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-sm">
                              {reservation.name}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {reservation.train}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {reservation.date}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold">
                            {reservation.amount}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                reservation.status === "Confirmed" ?
                                  "bg-emerald-50 text-emerald-600"
                                : "bg-orange-50 text-orange-600"
                              }`}>
                              {reservation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
              <Outlet />
            </div>
          )}
        </main>

        {/* =================================================
            FOOTER
        ================================================== */}

        <footer className="border-t border-[#c3c6d7] bg-white px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#004ac6]">RailLink Premium</p>

              <p className="text-xs text-gray-500 mt-1">
                Railway Management System
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-500">
              <button className="hover:text-[#004ac6]">About</button>

              <button className="hover:text-[#004ac6]">Contact</button>

              <button className="hover:text-[#004ac6]">Policies</button>

              <button className="hover:text-[#004ac6]">Terms</button>

              <button className="hover:text-[#004ac6]">Privacy</button>
            </div>

            <p className="text-xs text-gray-400">© 2026 RailLink Premium</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
