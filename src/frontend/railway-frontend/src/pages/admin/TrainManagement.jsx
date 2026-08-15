import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import {
  getAllTrains,
  createTrain,
  updateTrain,
  deleteTrain,
} from "../../services/trainService";

const TrainManagement = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    trainNo: "",
    trainName: "",
    fromStation: "",
    toStation: "",
    departureTime: "",
    arrivalTime: "",
    status: "Active",
  });

  /* =======================
     FETCH DATA
  ======================== */
  const fetchTrains = async () => {
    try {
      setLoading(true);
      const res = await getAllTrains();
      setTrains(res.data);
      setError("");
    } catch (e) {
      console.error("Failed to fetch trains", e);
      setError("Failed to load trains.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  /* =======================
     MODAL HANDLERS
  ======================== */
  const openAdd = () => {
    setEditingId(null);
    setForm({
      trainNo: "",
      trainName: "",
      fromStation: "",
      toStation: "",
      departureTime: "",
      arrivalTime: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm(t);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const save = async () => {
    try {
      if (editingId) {
        await updateTrain(editingId, form);
      } else {
        await createTrain(form);
      }
      closeModal();
      fetchTrains();
    } catch (e) {
      alert("Failed to save train.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this train?")) return;
    try {
      await deleteTrain(id);
      fetchTrains();
    } catch (e) {
      alert("Failed to delete train.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Train Schedule"
        subtitle="Manage all train schedules and routes."
        actions={[
          {
            label: "Add Train",
            icon: <Plus size={16} />,
            primary: true,
            onClick: openAdd,
          },
        ]}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ?
        <div className="text-center py-10 text-gray-400">Loading...</div>
      : <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-[#f4f7ff] text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="p-4">Train</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Dep</th>
                  <th className="p-4">Arr</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trains.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-bold text-blue-600">{t.trainNo}</div>
                      <div className="text-xs">{t.trainName}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <span className="font-bold">{t.fromStation}</span> →{" "}
                      <span className="font-bold">{t.toStation}</span>
                    </td>
                    <td className="p-4 text-xs">{t.departureTime}</td>
                    <td className="p-4 text-xs">{t.arrivalTime}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          t.status === "Active" ?
                            "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                        }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEdit(t)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                        title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {editingId ? "Edit Train" : "Add Train"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Train No"
                value={form.trainNo}
                onChange={(v) => setForm({ ...form, trainNo: v })}
              />
              <Input
                label="Train Name"
                value={form.trainName}
                onChange={(v) => setForm({ ...form, trainName: v })}
              />
              <Input
                label="From Station"
                value={form.fromStation}
                onChange={(v) => setForm({ ...form, fromStation: v })}
              />
              <Input
                label="To Station"
                value={form.toStation}
                onChange={(v) => setForm({ ...form, toStation: v })}
              />
              <Input
                label="Departure"
                value={form.departureTime}
                onChange={(v) => setForm({ ...form, departureTime: v })}
              />
              <Input
                label="Arrival"
                value={form.arrivalTime}
                onChange={(v) => setForm({ ...form, arrivalTime: v })}
              />
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] text-sm">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Cancelled">Cancelled</option>
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
                <Check size={14} /> {editingId ? "Save Changes" : "Add Train"}
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
const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-bold text-gray-500">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] text-sm"
    />
  </div>
);

export default TrainManagement;
