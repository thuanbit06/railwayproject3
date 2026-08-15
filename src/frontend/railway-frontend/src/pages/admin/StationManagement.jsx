import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const StationManagement = () => {
  const [stations, setStations] = useState([
    {
      id: 1,
      code: "NDLS",
      name: "New Delhi",
      city: "Delhi",
      platforms: 16,
      status: "Active",
    },
    {
      id: 2,
      code: "BCT",
      name: "Mumbai Central",
      city: "Mumbai",
      platforms: 12,
      status: "Active",
    },
    {
      id: 3,
      code: "BPL",
      name: "Bhopal Jn",
      city: "Bhopal",
      platforms: 8,
      status: "Maintenance",
    },
    {
      id: 4,
      code: "TVC",
      name: "Trivandrum",
      city: "Thiruvananthapuram",
      platforms: 6,
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    city: "",
    platforms: "",
    status: "Active",
  });

  /* =======================
     HANDLERS
  ======================== */
  const openAdd = () => {
    setEditingId(null);
    setForm({ code: "", name: "", city: "", platforms: "", status: "Active" });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm(s);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const save = () => {
    if (!form.code || !form.name || !form.city || !form.platforms) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      setStations(
        stations.map((s) => (s.id === editingId ? { ...s, ...form } : s)),
      );
    } else {
      setStations([
        ...stations,
        { id: Date.now(), ...form, platforms: Number(form.platforms) },
      ]);
    }
    closeModal();
  };

  const remove = (id) => {
    if (window.confirm("Delete this station?")) {
      setStations(stations.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Station Management"
        subtitle="Manage all railway stations."
        actions={[
          {
            label: "Add Station",
            icon: <Plus size={16} />,
            primary: true,
            onClick: openAdd,
          },
        ]}
      />

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stations.map((s) => (
          <div
            key={s.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                <p className="text-xs text-gray-500">{s.city}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  s.status === "Active" ?
                    "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
                }`}>
                {s.status}
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-xs text-gray-400">Code</p>
                <p className="font-bold text-blue-600">{s.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Platforms</p>
                <p className="font-bold">{s.platforms}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => openEdit(s)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit">
                <Pencil size={14} />
              </button>
              <button
                onClick={() => remove(s.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {editingId ? "Edit Station" : "Add Station"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <Input
                label="Station Code"
                value={form.code}
                onChange={(v) => setForm({ ...form, code: v })}
              />
              <Input
                label="Station Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Input
                label="City"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
              />
              <Input
                label="Platforms"
                type="number"
                value={form.platforms}
                onChange={(v) => setForm({ ...form, platforms: v })}
              />

              <div>
                <label className="text-xs font-bold text-gray-500">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] text-sm">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-2 rounded-xl bg-[#003A8C] hover:bg-[#1677FF] text-white text-sm font-semibold flex items-center gap-2">
                <Check size={14} /> {editingId ? "Save Changes" : "Add Station"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =======================
    REUSABLE INPUT
======================== */
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-xs font-bold text-gray-500">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] text-sm"
    />
  </div>
);

export default StationManagement;
