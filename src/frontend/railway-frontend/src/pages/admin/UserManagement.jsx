import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertOctagon,
  UserPlus,
  Edit2,
} from "lucide-react";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("Active");

  const users = [
    {
      id: 1,
      name: "Julian Dasher",
      email: "j.dasher@railways.erp",
      role: "Admin",
      status: "Active",
      lastLogin: "2 mins ago",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Arjun Mehta",
      email: "amehta_staff@railways.erp",
      role: "Staff",
      status: "Active",
      lastLogin: "4 hours ago",
      color: "bg-green-400",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      email: "e.rod@station.ops",
      role: "Operator",
      status: "Inactive",
      lastLogin: "2 days ago",
      color: "bg-gray-400",
    },
    {
      id: 4,
      name: "Samuel Kojo",
      email: "s.kojo@railways.erp",
      role: "Staff",
      status: "Pending",
      lastLogin: "Never",
      color: "bg-orange-200 text-orange-700",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600";
      case "Inactive":
        return "text-gray-400";
      case "Pending":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoleBadge = (role) => {
    const base =
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium";
    if (role === "Admin") return `${base} bg-blue-100 text-blue-700`;
    if (role === "Staff") return `${base} bg-orange-100 text-orange-700`;
    if (role === "Operator") return `${base} bg-indigo-100 text-indigo-700`;
    return base;
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage administrative access, roles, and security permissions."
        actions={[
          { label: "Add User", icon: <UserPlus size={16} />, primary: true },
        ]}
      />

      {/* FILTERS */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or employee ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Filter size={16} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#eef2ff] text-gray-700 font-medium px-3 py-2 rounded-lg text-sm border-none focus:outline-none cursor-pointer">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Staff</option>
              <option>Operator</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#eef2ff] text-gray-700 font-medium px-3 py-2 rounded-lg text-sm border-none focus:outline-none cursor-pointer">
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>

            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-[#eef2ff] text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left font-bold">User</th>
                <th className="p-4 text-left font-bold">Role</th>
                <th className="p-4 text-left font-bold">Status</th>
                <th className="p-4 text-left font-bold">Last Login</th>
                <th className="p-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-xs`}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={getRoleBadge(user.role)}>{user.role}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-1.5 font-medium ${getStatusColor(user.status)}`}>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Active" ? "bg-green-500"
                          : user.status === "Pending" ? "bg-orange-500"
                          : "bg-gray-400"
                        }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{user.lastLogin}</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-blue-600 text-xs font-medium inline-flex items-center gap-1">
                      <Edit2 size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3 bg-[#eef2ff] flex items-center justify-between text-xs text-gray-600">
          <span>Showing 1 to 4 of 48 users</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-white">
              <ChevronLeft size={14} />
            </button>
            <button className="px-2 py-1 rounded bg-blue-600 text-white font-bold">
              1
            </button>
            <button className="px-2 py-1 rounded hover:bg-white">2</button>
            <button className="px-2 py-1 rounded hover:bg-white">3</button>
            <span>...</span>
            <button className="px-2 py-1 rounded hover:bg-white">12</button>
            <button className="p-1 rounded hover:bg-white">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="text-xs font-medium text-blue-200 uppercase tracking-wider mb-1">
            System Load
          </div>
          <div className="text-4xl font-bold mb-2">94%</div>
          <div className="text-xs text-blue-100 flex items-center gap-1">
            <span>↗</span> +2.4% Active user sessions since last hour
          </div>
        </div>
        <div className="bg-[#eef2ff] rounded-2xl p-6 flex flex-col justify-center">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
            <Shield size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800">32</div>
          <div className="text-xs text-gray-500 font-medium">
            Verified Admins
          </div>
        </div>
        <div className="bg-[#eef2ff] rounded-2xl p-6 flex flex-col justify-center">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
            <AlertOctagon size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800">0</div>
          <div className="text-xs text-gray-500 font-medium">
            Failed Login Attempts
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
