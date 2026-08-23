import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Ticket,
  CalendarDays,
  Headphones,
  Home,
  Route,
  MapPin,
  HelpCircle,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext"; // 👈 1. Import useUser
import logo from "../../assets/Railway.png";

const Header = () => {
  // 👈 Bỏ variant prop nếu không dùng
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { logout } = useAuth(); // 👈 Chỉ lấy logout từ Auth
  const { user, loading } = useUser(); // 👈 2. Lấy user và loading từ UserContext
  const nav = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    {
      label: "Book Ticket",
      path: "/book-ticket",
      icon: Ticket,
      highlight: true,
    },
    { label: "My Tickets", path: "/my-tickets", icon: Ticket },
    {
      label: "Train Schedule",
      icon: CalendarDays,
      children: [
        {
          label: "Train Schedule",
          description: "View available trains",
          path: "/schedule",
          icon: CalendarDays,
        },
        {
          label: "Train Routes",
          description: "Explore railway routes",
          path: "/routes",
          icon: Route,
        },
        {
          label: "Stations",
          description: "Find railway stations",
          path: "/stations",
          icon: MapPin,
        },
      ],
    },
    {
      label: "Support",
      icon: Headphones,
      children: [
        {
          label: "Help Center",
          description: "Get help with your booking",
          path: "/support",
          icon: HelpCircle,
        },
        {
          label: "FAQ",
          description: "Frequently asked questions",
          path: "/faq",
          icon: HelpCircle,
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    nav("/");
  };

  const isActive = (path) =>
    path &&
    (path === "/" ?
      location.pathname === "/"
    : location.pathname.startsWith(path));
  const isParentActive = (item) =>
    item.path ?
      isActive(item.path)
    : item.children?.some((child) => isActive(child.path));

  // 👇 3. Auto-close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* =================================================
            LOGO
        ================================================== */}
        <Link to="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
            <img
              src={logo}
              alt="RailLink"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="hidden leading-none sm:block">
            <div className="text-[18px] font-extrabold tracking-tight text-[#003A8C]">
              RailLink
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Railway Booking
            </div>
          </div>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}
        <nav className="ml-auto hidden h-full items-center lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isParentActive(item);
            if (item.children) {
              return (
                <div key={item.label} className="group relative h-full">
                  <button
                    type="button"
                    className={`relative flex h-full items-center gap-1.5 px-4 text-[13px] font-semibold transition-colors duration-200 ${active ? "text-[#003A8C]" : "text-slate-600 hover:text-[#003A8C]"}`}>
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                    <span
                      className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#1677FF] transition-transform duration-200 origin-center ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                    />
                  </button>
                  <div className="invisible absolute left-0 top-[calc(100%-1px)] w-[285px] translate-y-2 rounded-2xl border border-slate-200/90 bg-white p-2 opacity-0 shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.path);
                      return (
                        <Link
                          key={child.label}
                          to={child.path}
                          className={`group/item flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${childActive ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${childActive ? "bg-white text-[#1677FF] shadow-sm" : "bg-slate-100 text-slate-500 group-hover/item:bg-white group-hover/item:text-[#1677FF]"}`}>
                            <ChildIcon size={17} />
                          </span>
                          <span className="min-w-0">
                            <span
                              className={`block text-[13px] font-bold ${childActive ? "text-[#003A8C]" : "text-slate-700 group-hover/item:text-[#003A8C]"}`}>
                              {child.label}
                            </span>
                            <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                              {child.description}
                            </span>
                          </span>
                          <span className="ml-auto translate-x-1 text-slate-300 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100">
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`group relative flex h-full items-center px-4 text-[13px] font-semibold transition-colors duration-200 ${active ? "text-[#003A8C]" : "text-slate-600 hover:text-[#003A8C]"}`}>
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#1677FF] transition-transform duration-200 origin-center ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}
        <div className="ml-4 flex items-center gap-2">
          {/* Notification */}
          {!loading &&
            user && ( // 👈 Chỉ hiện khi đã load xong user
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-[#003A8C]">
                <Bell size={19} />
                <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-red-500" />
              </button>
            )}

          {/* Authenticated User */}
          {loading ?
            // 👈 Skeleton loading khi đang gọi API
            <div className="hidden sm:flex items-center gap-2 px-1.5 py-1.5">
              <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
              <div className="hidden xl:block space-y-2">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-2 w-12 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          : user ?
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2 rounded-xl border px-1.5 py-1.5 transition-all duration-200 ${menuOpen ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#003A8C] to-[#1677FF] text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="hidden max-w-[110px] text-left xl:block">
                  <p className="truncate text-xs font-bold text-slate-700">
                    {user.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-400">Passenger</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`mr-1 text-slate-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* User Dropdown */}
              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close user menu"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
                    <div className="border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-white px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#003A8C] to-[#1677FF] text-sm font-bold text-white">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {user.name || "User"}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {user.email || "Passenger account"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-blue-50">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-[#003A8C]">
                          <Settings size={16} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Settings
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Account preferences
                          </p>
                        </div>
                      </Link>
                      <div className="my-2 h-px bg-slate-100" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-red-50">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100">
                          <LogOut size={16} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-red-500">
                            Logout
                          </p>
                          <p className="text-[10px] text-red-300">
                            Sign out of your account
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            // Guest Auth
          : !loading && ( // 👈 Chỉ hiện khi đã load xong và không có user
              <div className="hidden items-center gap-1 sm:flex">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#003A8C] transition-colors hover:bg-blue-50">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl border border-[#003A8C] px-4 py-2.5 text-[13px] font-bold text-[#003A8C] transition-all duration-200 hover:bg-[#003A8C] hover:text-white">
                  Sign Up
                </Link>
              </div>
            )
          }

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:bg-slate-50 hover:text-[#003A8C] lg:hidden">
            {open ?
              <X size={20} />
            : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}
      {open && (
        <div className="border-t border-slate-200/80 bg-white px-4 pb-4 pt-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] lg:hidden">
          {!loading && !user && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-[#003A8C] hover:bg-blue-50">
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#003A8C] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#1677FF]">
                Sign Up
              </Link>
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isParentActive(item);
              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-1">
                    <div
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${active ? "text-[#003A8C]" : "text-slate-600"}`}>
                      <Icon size={17} />
                      {item.label}
                    </div>
                    <div className="ml-3 border-l border-slate-200 pl-2">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.label}
                            to={child.path}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-white hover:text-[#003A8C]">
                            <ChildIcon size={14} />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active ? "bg-blue-50 text-[#003A8C]" : "text-slate-600 hover:bg-slate-50"}`}>
                  <Icon
                    size={17}
                    className={active ? "text-[#1677FF]" : "text-slate-400"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
