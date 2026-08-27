import React, { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Railway.png";

const AdminDashboard = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

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
    if (loc.pathname.startsWith("/admin/trains")) {
      return "Train Schedule";
    }

    if (loc.pathname.startsWith("/admin/reservations")) {
      return "Reservations";
    }

    if (loc.pathname.startsWith("/admin/tickets")) {
      return "Tickets";
    }

    if (loc.pathname.startsWith("/admin/analytics")) {
      return "Analytics";
    }

    if (loc.pathname.startsWith("/admin/settings")) {
      return "Settings";
    }

    if (loc.pathname.startsWith("/admin/help")) {
      return "Help & Support";
    }

    return "Dashboard";
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

  const handleRefresh = () => {
    window.location.reload();
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (path) => {
    nav(path);
    setOpen(false);
  };

  // =========================================================
  // SIDEBAR
  // =========================================================

  const Sidebar = () => (
    <aside className="h-full flex flex-col justify-between">
      {/* =====================================================
          TOP
      ====================================================== */}

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* LOGO */}

        <div className="relative flex items-center justify-center mb-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="lg:hidden absolute right-0 top-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={() => handleNavigation("/admin/dashboard")}
            className="group flex items-center justify-center">
            <img
              src={logo}
              alt="RailLink Premium"
              className="h-14 sm:h-16 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </button>
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
                onClick={() => handleNavigation(item.path)}
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

      {/* =====================================================
          BOTTOM
      ====================================================== */}

      <div className="shrink-0 border-t border-gray-200 pt-4 mt-4 space-y-1.5">
        <button
          type="button"
          onClick={() => handleNavigation("/admin/help")}
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
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="max-w-[1440px] mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        {/* ===================================================
            FOOTER
        ==================================================== */}

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
