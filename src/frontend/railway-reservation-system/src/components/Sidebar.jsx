import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menu = [
    { path: "/search", label: "🔍 Search" },
    { path: "/query", label: "🎫 PNR Query" },
    { path: "/cancel", label: "❌ Cancel" },
  ];

  if (user?.role === "ADMIN") {
    menu.push({ path: "/admin", label: "⚙️ Admin" });
  }

  return (
    <aside className="w-56 bg-white border-r min-h-screen p-4">
      <h3 className="font-bold mb-4">Menu</h3>
      <ul className="space-y-2">
        {menu.map((m) => (
          <li key={m.path}>
            <Link
              to={m.path}
              className={`block px-3 py-2 rounded ${location.pathname.startsWith(m.path) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
              {m.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
