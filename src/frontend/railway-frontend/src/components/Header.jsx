import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, Train, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logo } from "../../public/Railway.png";
const Header = ({ variant = "user" }) => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const nav = useNavigate();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Book Ticket", path: "/book" },
    { label: "My Tickets", path: "/my-tickets" },
    { label: "Train Schedule", path: "/schedule" },
    { label: "Support", path: "/support" },
  ];

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* ===== LOGO ===== */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="RailLink Premium Logo"
            className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
          {/* Nếu muốn hiển thị text bên cạnh logo ảnh, bỏ comment dòng dưới */}
          {/* <span className="font-bold text-xl text-[#003A8C] hidden sm:block">RailLink Premium</span> */}
        </Link>

        {/* ===== DESKTOP NAV ===== */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#003A8C] transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ===== RIGHT SIDE ===== */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell size={18} className="text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Auth Section */}
          {isAuthenticated ?
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#003A8C] to-[#1677FF] flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0] || "A"}
                </div>
                <span className="hidden md:inline text-sm font-semibold text-gray-700">
                  {user?.name || "User"}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50">
                    <User size={14} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          : <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-[#003A8C] hover:bg-blue-50 rounded-lg transition">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold bg-[#003A8C] hover:bg-[#1677FF] text-white rounded-lg shadow-md shadow-blue-200 transition">
                Sign Up
              </Link>
            </div>
          }

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            {open ?
              <X size={20} />
            : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE NAV ===== */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#003A8C]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
