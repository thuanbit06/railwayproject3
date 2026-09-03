import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Plus, Pencil, Trash2, X, Check, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAllTrains,
  createTrain,
  updateTrain,
  deleteTrain,
} from "../../services/trainService";

const TrainManagement = () => {
  const navigate = useNavigate();

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

      setTrains(res.data || []);
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

    setError("");
    setShowModal(true);
  };

  const openEdit = (train) => {
    setEditingId(train.id);

    setForm({
      trainNo: train.trainNo || "",
      trainName: train.trainName || "",
      fromStation: train.fromStation || "",
      toStation: train.toStation || "",
      departureTime: train.departureTime || "",
      arrivalTime: train.arrivalTime || "",
      status: train.status || "Active",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  /* =======================
     SAVE TRAIN
  ======================== */

  const save = async () => {
    try {
      setError("");

      if (!form.trainNo.trim()) {
        setError("Train No is required.");
        return;
      }

      if (!form.trainName.trim()) {
        setError("Train Name is required.");
        return;
      }

      if (!form.fromStation.trim()) {
        setError("From Station is required.");
        return;
      }

      if (!form.toStation.trim()) {
        setError("To Station is required.");
        return;
      }

      if (!form.departureTime.trim()) {
        setError("Departure Time is required.");
        return;
      }

      if (!form.arrivalTime.trim()) {
        setError("Arrival Time is required.");
        return;
      }

      const payload = {
        trainNo: form.trainNo.trim(),
        trainName: form.trainName.trim(),
        fromStation: form.fromStation.trim(),
        toStation: form.toStation.trim(),
        departureTime: form.departureTime.trim(),
        arrivalTime: form.arrivalTime.trim(),
        status: form.status,
      };

      if (editingId) {
        await updateTrain(editingId, payload);
      } else {
        await createTrain(payload);
      }

      closeModal();
      await fetchTrains();
    } catch (e) {
      console.error("Failed to save train", e);

      setError(
        e.response?.data?.message ||
          e.response?.data ||
          "Failed to save train.",
      );
    }
  };

  /* =======================
     DELETE TRAIN
  ======================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this train?")) return;

    try {
      setError("");

      await deleteTrain(id);

      await fetchTrains();
    } catch (e) {
      console.error("Failed to delete train", e);

      setError(
        e.response?.data?.message ||
          e.response?.data ||
          "Failed to delete train.",
      );
    }
  };

  /* =======================
     MANAGE COACHES
  ======================== */

  const handleManageCoaches = (trainId) => {
    if (!trainId) {
      setError("Invalid Train ID.");
      return;
    }

    navigate(`/admin/trains/${trainId}/coaches`);
  };

  return (
    <div className="space-y-6">
      {/* =======================
          PAGE HEADER
      ======================== */}

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

      {/* =======================
          ERROR
      ======================== */}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =======================
          TRAIN TABLE
      ======================== */}

      {loading ?
        <div className="text-center py-10 text-gray-400">Loading...</div>
      : <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[1000px]">
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
                {trains.length === 0 ?
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-400">
                      No trains found.
                    </td>
                  </tr>
                : trains.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      {/* TRAIN */}

                      <td className="p-4">
                        <div className="font-bold text-blue-600">
                          {t.trainNo}
                        </div>

                        <div className="text-xs text-gray-500">
                          {t.trainName}
                        </div>
                      </td>

                      {/* ROUTE */}

                      <td className="p-4 text-xs">
                        <span className="font-bold">{t.fromStation}</span>

                        <span className="mx-1 text-gray-400">→</span>

                        <span className="font-bold">{t.toStation}</span>
                      </td>

                      {/* DEPARTURE */}

                      <td className="p-4 text-xs">{t.departureTime}</td>

                      {/* ARRIVAL */}

                      <td className="p-4 text-xs">{t.arrivalTime}</td>

                      {/* STATUS */}

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

                      {/* ACTIONS */}

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* MANAGE COACHES */}

                          <button
                            onClick={() => handleManageCoaches(t.id)}
                            className="inline-flex items-center gap-1.5 text-indigo-500 hover:text-indigo-700 text-xs font-semibold"
                            title="Manage Coaches">
                            <Users size={14} />
                            Coaches
                          </button>

                          {/* EDIT */}

                          <button
                            onClick={() => openEdit(t)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit">
                            <Pencil size={14} />
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      {/* =======================
          ADD / EDIT MODAL
      ======================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId ? "Edit Train" : "Add Train"}
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  {editingId ?
                    `Editing train #${editingId}`
                  : "Create a new train"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Train No"
                value={form.trainNo}
                onChange={(v) =>
                  setForm({
                    ...form,
                    trainNo: v,
                  })
                }
              />

              <Input
                label="Train Name"
                value={form.trainName}
                onChange={(v) =>
                  setForm({
                    ...form,
                    trainName: v,
                  })
                }
              />

              <Input
                label="From Station"
                value={form.fromStation}
                onChange={(v) =>
                  setForm({
                    ...form,
                    fromStation: v,
                  })
                }
              />

              <Input
                label="To Station"
                value={form.toStation}
                onChange={(v) =>
                  setForm({
                    ...form,
                    toStation: v,
                  })
                }
              />

              <Input
                label="Departure"
                value={form.departureTime}
                onChange={(v) =>
                  setForm({
                    ...form,
                    departureTime: v,
                  })
                }
              />

              <Input
                label="Arrival"
                value={form.arrivalTime}
                onChange={(v) =>
                  setForm({
                    ...form,
                    arrivalTime: v,
                  })
                }
              />

              {/* STATUS */}

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] text-sm">
                  <option value="Active">Active</option>

                  <option value="Maintenance">Maintenance</option>

                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* MODAL ACTIONS */}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">
                Cancel
              </button>

              <button
                onClick={save}
                className="px-4 py-2 rounded-xl bg-[#003A8C] hover:bg-[#1677FF] text-white text-sm font-semibold flex items-center gap-2">
                <Check size={14} />

                {editingId ? "Save Changes" : "Add Train"}
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
