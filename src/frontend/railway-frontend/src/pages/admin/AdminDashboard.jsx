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

const AdminDashboard = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const items = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Train, label: "Train Schedule", path: "/admin/trains" },
    { icon: Calendar, label: "Reservations", path: "/admin/reservations" },
    { icon: Ticket, label: "Tickets", path: "/admin/tickets" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const Sidebar = () => (
    <div className="h-full flex flex-col">
      <div className="mb-8 pl-2 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-blue-600 text-lg">RailAdmin</h1>
          <p className="text-xs text-gray-500">Management Portal</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-gray-500">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        {items.map((it, i) => {
          const active = loc.pathname.startsWith(it.path);
          return (
            <button
              key={i}
              onClick={() => {
                nav(it.path);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                active ?
                  "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "text-gray-600 hover:bg-white"
              }`}>
              <it.icon size={18} /> {it.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
        <button
          onClick={() => {
            nav("/admin/reservations");
            setOpen(false);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
          <Plus size={18} /> New Reservation
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-500 text-sm font-medium">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex bg-[#f3f6fb] text-gray-800 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-md border-r border-gray-100 hidden lg:flex flex-col p-5">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 max-w-[85%] h-full bg-white/95 backdrop-blur-md p-5 shadow-xl">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 lg:p-6 bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-gray-700">
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center bg-[#f4f7ff] rounded-xl px-4 py-2.5 w-96 border border-gray-100">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell
              size={18}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
              <span className="hidden md:inline text-sm font-bold text-gray-700">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
