import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useTrain } from "../../context/TrainContext";
import { adminService } from "../../services/adminService";
import {
  getMockBookings,
  stations,
  trains,
  getStationByCode,
} from "../../data";
import * as XLSX from "xlsx";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";

// ==================== DASHBOARD HOME ====================
const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const { useMock, setUseMock } = useTrain();

  const loadStats = useCallback(async () => {
    if (useMock) {
      const bookings = getMockBookings();
      setStats({
        totalBookings: bookings.filter((b) => !b.cancelled).length,
        totalCancellations: bookings.filter((b) => b.cancelled).length,
        totalUsers: 4,
        totalTrains: trains.length,
        todayBookings: bookings.filter(
          (b) => b.date_of_travel === new Date().toISOString().split("T")[0],
        ).length,
      });
    } else {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch {
        setStats({
          totalBookings: 0,
          totalCancellations: 0,
          totalUsers: 0,
          totalTrains: 0,
          todayBookings: 0,
        });
      }
    }
  }, [useMock]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useMock}
            onChange={(e) => setUseMock(e.target.checked)}
            className="w-4 h-4"
          />
          <span
            className={
              useMock ? "text-yellow-700 font-medium" : "text-gray-600"
            }>
            {useMock ? "🟡 Mock Mode" : "🟢 Live API"}
          </span>
        </label>
      </div>

      {useMock && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ Mock Mode: Changes won't persist. Turn off to use real backend.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Bookings",
            value: stats?.totalBookings,
            icon: "🎫",
            color: "blue",
          },
          {
            label: "Today's Bookings",
            value: stats?.todayBookings,
            icon: "📅",
            color: "green",
          },
          {
            label: "Cancellations",
            value: stats?.totalCancellations,
            icon: "❌",
            color: "red",
          },
          {
            label: "Active Users",
            value: stats?.totalUsers,
            icon: "👥",
            color: "purple",
          },
          {
            label: "Active Trains",
            value: stats?.totalTrains,
            icon: "🚆",
            color: "orange",
          },
        ].map((c) => (
          <div
            key={c.label}
            className={`bg-${c.color}-50 border border-${c.color}-200 p-4 rounded-lg`}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <p className={`text-sm text-${c.color}-700`}>{c.label}</p>
            <p className={`text-2xl font-bold text-${c.color}-800`}>
              {c.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== MANAGE USERS ====================
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ loginName: "", role: "USER" });
  const { useMock } = useTrain();

  const loadUsers = useCallback(async () => {
    if (useMock) {
      const { users } = await import("../../data");
      setUsers(users);
    } else {
      const data = await adminService.getUsers();
      setUsers(data);
    }
  }, [useMock]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSave = async () => {
    if (useMock) {
      setUsers(users.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
      setEditingId(null);
    } else {
      await adminService.updateUser(editingId, form);
      await loadUsers();
      setEditingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Username
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">
                  {editingId === u.id ?
                    <Input
                      value={form.loginName}
                      onChange={(e) =>
                        setForm({ ...form, loginName: e.target.value })
                      }
                      className="w-full"
                    />
                  : u.loginName}
                </td>
                <td className="px-4 py-3">
                  {editingId === u.id ?
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="input">
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  : <span
                      className={`px-2 py-1 rounded text-xs ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {u.role}
                    </span>
                  }
                </td>
                <td className="px-4 py-3">
                  {editingId === u.id ?
                    <Button size="sm" variant="success" onClick={handleSave}>
                      Save
                    </Button>
                  : <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(u.id);
                        setForm({ loginName: u.loginName, role: u.role });
                      }}>
                      Edit
                    </Button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        ℹ️ Password changes via Change Password page. Default:{" "}
        <code>Default@123</code>
      </p>
    </div>
  );
};

// ==================== MANAGE STATIONS ====================
const ManageStations = () => {
  const [stationsList, setStationsList] = useState([]);
  const [form, setForm] = useState({ code: "", name: "", division: "" });
  const [editingId, setEditingId] = useState(null);
  const { useMock } = useTrain();

  const loadStations = useCallback(async () => {
    if (useMock) {
      const { stations } = await import("../../data");
      setStationsList([...stations]);
    } else {
      const data = await adminService.getStations();
      setStationsList(data);
    }
  }, [useMock]);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const handleSubmit = async () => {
    if (!form.code || !form.name) return;

    if (useMock) {
      if (editingId) {
        const updated = stations.map((s) =>
          s.stationId === editingId ?
            { ...s, ...form, code: form.code.toUpperCase() }
          : s,
        );
        setStationsList(updated);
      } else {
        const newStation = {
          stationId: `ST${String(stationsList.length + 1).padStart(3, "0")}`,
          code: form.code.toUpperCase(),
          name: form.name,
          division: form.division,
        };
        setStationsList([...stationsList, newStation]);
      }
      setEditingId(null);
      setForm({ code: "", name: "", division: "" });
    } else {
      alert("API integration pending - use Mock Mode");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Stations</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">
          {editingId ? "Edit Station" : "Add Station"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Code (e.g., NDLS)"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />
          <Input
            placeholder="Station Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Division"
            value={form.division}
            onChange={(e) => setForm({ ...form, division: e.target.value })}
          />
          <Button
            variant={editingId ? "success" : "primary"}
            onClick={handleSubmit}>
            {editingId ? "Update" : "Add"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Code</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Division
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stationsList.map((s) => (
              <tr key={s.stationId} className="border-t">
                <td className="px-4 py-3 font-mono">{s.code}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.division}</td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(s.stationId);
                      setForm({
                        code: s.code,
                        name: s.name,
                        division: s.division,
                      });
                    }}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== MANAGE TRAINS ====================
const ManageTrains = () => {
  const [trainsList, setTrainsList] = useState([]);
  const [form, setForm] = useState({
    trainNo: "",
    trainName: "",
    upDownStatus: "UP",
    AC1: 0,
    AC2: 0,
    AC3: 0,
    Sleeper: 0,
    General: 0,
    scheduleDays: [],
  });
  const [editingNo, setEditingNo] = useState(null);
  const { useMock } = useTrain();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const loadTrains = useCallback(async () => {
    if (useMock) {
      const { trains } = await import("../../data");
      setTrainsList([...trains]);
    } else {
      const data = await adminService.getAllTrains();
      setTrainsList(data);
    }
  }, [useMock]);

  useEffect(() => {
    loadTrains();
  }, [loadTrains]);

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      scheduleDays:
        prev.scheduleDays.includes(day) ?
          prev.scheduleDays.filter((d) => d !== day)
        : [...prev.scheduleDays, day],
    }));
  };

  const handleSubmit = async () => {
    if (!form.trainNo || !form.trainName) return;

    if (useMock) {
      if (editingNo) {
        const updated = trains.map((t) =>
          t.trainNo === editingNo ?
            {
              ...t,
              trainName: form.trainName,
              upDownStatus: form.upDownStatus,
              coaches: {
                AC1: parseInt(form.AC1),
                AC2: parseInt(form.AC2),
                AC3: parseInt(form.AC3),
                Sleeper: parseInt(form.Sleeper),
                General: parseInt(form.General),
              },
              scheduleDays: form.scheduleDays,
            }
          : t,
        );
        setTrainsList(updated);
      } else {
        const newTrain = {
          trainNo: form.trainNo,
          trainName: form.trainName,
          upDownStatus: form.upDownStatus,
          routeId: `RT${form.trainNo}`,
          coaches: {
            AC1: parseInt(form.AC1),
            AC2: parseInt(form.AC2),
            AC3: parseInt(form.AC3),
            Sleeper: parseInt(form.Sleeper),
            General: parseInt(form.General),
          },
          scheduleDays: form.scheduleDays,
          schedule: [
            {
              stationCode: "NDLS",
              arrival: "-",
              departure: "00:00",
              distance: 0,
            },
          ],
        };
        setTrainsList([...trainsList, newTrain]);
      }
      resetForm();
    } else {
      alert("API integration pending - use Mock Mode");
    }
  };

  const resetForm = () => {
    setEditingNo(null);
    setForm({
      trainNo: "",
      trainName: "",
      upDownStatus: "UP",
      AC1: 0,
      AC2: 0,
      AC3: 0,
      Sleeper: 0,
      General: 0,
      scheduleDays: [],
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Trains</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">
          {editingNo ? "Edit Train" : "Add Train"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <Input
            placeholder="Train No"
            value={form.trainNo}
            onChange={(e) => setForm({ ...form, trainNo: e.target.value })}
            disabled={!!editingNo}
          />
          <Input
            placeholder="Train Name"
            value={form.trainName}
            onChange={(e) => setForm({ ...form, trainName: e.target.value })}
            className="md:col-span-2"
          />
        </div>
        <div className="grid grid-cols-5 gap-3 mb-3">
          {["AC1", "AC2", "AC3", "Sleeper", "General"].map((c) => (
            <Input
              key={c}
              placeholder={c}
              type="number"
              value={form[c]}
              onChange={(e) => setForm({ ...form, [c]: e.target.value })}
            />
          ))}
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Running Days</p>
          <div className="flex gap-2 flex-wrap">
            {days.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={`px-3 py-1 rounded text-sm ${form.scheduleDays.includes(d) ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant={editingNo ? "success" : "primary"}
            onClick={handleSubmit}>
            {editingNo ? "Update" : "Add"}
          </Button>
          {editingNo && (
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Train No
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Coaches
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Days</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {trainsList.map((t) => (
              <tr key={t.trainNo} className="border-t">
                <td className="px-4 py-3 font-mono">{t.trainNo}</td>
                <td className="px-4 py-3">{t.trainName}</td>
                <td className="px-4 py-3 text-xs">
                  AC1:{t.coaches.AC1} AC2:{t.coaches.AC2} AC3:{t.coaches.AC3}{" "}
                  SL:{t.coaches.Sleeper} GN:{t.coaches.General}
                </td>
                <td className="px-4 py-3 text-xs">
                  {t.scheduleDays?.join(", ")}
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingNo(t.trainNo);
                      setForm({
                        trainNo: t.trainNo,
                        trainName: t.trainName,
                        upDownStatus: t.upDownStatus,
                        AC1: t.coaches.AC1,
                        AC2: t.coaches.AC2,
                        AC3: t.coaches.AC3,
                        Sleeper: t.coaches.Sleeper,
                        General: t.coaches.General,
                        scheduleDays: t.scheduleDays || [],
                      });
                    }}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== DAILY CASH ====================
const DailyCash = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState(null);
  const { useMock } = useTrain();

  const loadReport = useCallback(async () => {
    if (useMock) {
      const bookings = getMockBookings();
      const received = bookings
        .filter((b) => b.date_of_travel === date && !b.cancelled)
        .reduce((s, b) => s + b.fare, 0);
      const refunded = bookings
        .filter((b) => b.cancellation_date === date)
        .reduce((s, b) => s + b.refund_amount, 0);
      const bookingsList = bookings.filter(
        (b) => b.date_of_travel === date && !b.cancelled,
      );
      const cancellationsList = bookings.filter(
        (b) => b.cancellation_date === date,
      );

      setReport({
        date,
        received,
        refunded,
        net: received - refunded,
        bookings: bookingsList,
        cancellations: cancellationsList,
      });
    } else {
      const data = await adminService.getDailyCash(date);
      setReport({ ...data, date });
    }
  }, [date, useMock]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const exportToExcel = () => {
    if (!report) return;
    const wb = XLSX.utils.book_new();

    const summary = [
      {
        Date: report.date,
        Received: report.received,
        Refunded: report.refunded,
        Net: report.net,
      },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summary);

    const wsBookings = XLSX.utils.json_to_sheet(
      report.bookings.map((b) => ({
        PNR: b.pnr,
        Name: b.passenger_name,
        Train: b.train_no,
        Fare: b.fare,
        Seat: `${b.coach_no}/${b.seat_no}`,
      })),
    );

    const wsCancellations = XLSX.utils.json_to_sheet(
      report.cancellations.map((c) => ({
        PNR: c.pnr,
        Name: c.passenger_name,
        Train: c.train_no,
        Refund: c.refund_amount,
      })),
    );

    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    XLSX.utils.book_append_sheet(wb, wsBookings, "Bookings");
    XLSX.utils.book_append_sheet(wb, wsCancellations, "Cancellations");

    XLSX.writeFile(wb, `DailyCash_${report.date}.xlsx`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Daily Cash Transaction</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Select Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={loadReport}>
            Generate
          </Button>
          <Button variant="success" onClick={exportToExcel} disabled={!report}>
            Export Excel
          </Button>
        </div>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border">
              <p className="text-sm text-green-700">Money Received</p>
              <p className="text-2xl font-bold text-green-800">
                ₹{report.received}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border">
              <p className="text-sm text-red-700">Money Refunded</p>
              <p className="text-2xl font-bold text-red-800">
                ₹{report.refunded}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border">
              <p className="text-sm text-blue-700">Net Amount</p>
              <p className="text-2xl font-bold text-blue-800">₹{report.net}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Summary for {report.date}</h3>
            <p className="text-sm text-gray-600">
              Bookings: {report.bookings?.length || 0} | Cancellations:{" "}
              {report.cancellations?.length || 0}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ==================== SIDEBAR ====================
const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menu = [
    { path: "/admin", label: "🏠 Dashboard", exact: true },
    { path: "/admin/users", label: "👥 Users" },
    { path: "/admin/stations", label: "🏢 Stations" },
    { path: "/admin/trains", label: "🚆 Trains" },
    { path: "/admin/cash", label: "💰 Daily Cash" },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-600">{user?.loginName}</p>
      </div>
      <ul className="space-y-2">
        {menu.map((m) => {
          const active =
            m.exact ?
              location.pathname === m.path
            : location.pathname.startsWith(m.path);
          return (
            <li key={m.path}>
              <Link
                to={m.path}
                className={`block px-3 py-2 rounded text-sm ${active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                {m.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

// ==================== MAIN ====================
const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-100 flex">
    <AdminSidebar />
    <main className="flex-1 p-6">{children}</main>
  </div>
);

const AdminDashboard = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="users" element={<ManageUsers />} />
      <Route path="stations" element={<ManageStations />} />
      <Route path="trains" element={<ManageTrains />} />
      <Route path="cash" element={<DailyCash />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Route>
  </Routes>
);

export default AdminDashboard;
