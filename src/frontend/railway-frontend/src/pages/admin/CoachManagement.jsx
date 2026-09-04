// src/pages/admin/CoachManagement.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Armchair,
  ArrowLeft,
  X,
} from "lucide-react";
import api from "../../services/api";

const CoachManagement = () => {
  // =========================================================
  // GET TRAIN ID FROM URL
  // Example:
  // /admin/trains/5/coaches
  // trainId = "5"
  // =========================================================

  const { trainId } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [coaches, setCoaches] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [editingCoach, setEditingCoach] = useState(null);

  const [form, setForm] = useState({
    coachNo: "",
    classType: "",
    totalSeats: "",
    fareMultiplier: "1",
  });

  // =========================================================
  // VALIDATE TRAIN ID
  // =========================================================

  const numericTrainId = Number(trainId);

  const validTrainId = Number.isInteger(numericTrainId) && numericTrainId > 0;

  // =========================================================
  // LOAD COACHES
  // GET /api/train-coaches/train/{trainId}
  // =========================================================

  const loadCoaches = async () => {
    if (!validTrainId) {
      setError("Train ID không hợp lệ.");
      setCoaches([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/train-coaches/train/${numericTrainId}`);

      setCoaches(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Load coaches error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Không thể tải danh sách Coach.";

      setError(
        typeof message === "string" ? message : (
          "Không thể tải danh sách Coach."
        ),
      );

      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD WHEN TRAIN ID CHANGES
  // =========================================================

  useEffect(() => {
    loadCoaches();
  }, [trainId]);

  // =========================================================
  // OPEN ADD
  // =========================================================

  const openAdd = () => {
    setEditingCoach(null);
    setIsReadOnly(false);

    setForm({
      coachNo: "",
      classType: "",
      totalSeats: "",
      fareMultiplier: "1",
    });

    setError("");
    setIsFormOpen(true);
  };

  // =========================================================
  // OPEN VIEW
  // =========================================================

  const openView = (coach) => {
    setEditingCoach(coach);
    setIsReadOnly(true);

    setForm({
      coachNo: coach.coachNo || "",
      classType: coach.classType || "",
      totalSeats: coach.totalSeats ?? "",
      fareMultiplier: coach.fareMultiplier ?? "1",
    });

    setError("");
    setIsFormOpen(true);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEdit = (coach) => {
    setEditingCoach(coach);
    setIsReadOnly(false);

    setForm({
      coachNo: coach.coachNo || "",
      classType: coach.classType || "",
      totalSeats: coach.totalSeats ?? "",
      fareMultiplier: coach.fareMultiplier ?? "1",
    });

    setError("");
    setIsFormOpen(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    if (saving) return;

    setIsFormOpen(false);
    setEditingCoach(null);
    setIsReadOnly(false);
  };

  // =========================================================
  // HANDLE FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReadOnly) return;

    if (!validTrainId) {
      alert("Train ID không hợp lệ.");
      return;
    }

    // -------------------------------------------------------
    // Validate Coach No
    // -------------------------------------------------------

    if (!form.coachNo.trim()) {
      alert("Vui lòng nhập Coach No.");
      return;
    }

    // -------------------------------------------------------
    // Validate Class Type
    // -------------------------------------------------------

    if (!form.classType.trim()) {
      alert("Vui lòng chọn Class Type.");
      return;
    }

    // -------------------------------------------------------
    // Validate Total Seats
    // -------------------------------------------------------

    const totalSeats = Number(form.totalSeats);

    if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
      alert("Total Seats phải là số nguyên lớn hơn 0.");
      return;
    }

    // -------------------------------------------------------
    // Validate Fare Multiplier
    // -------------------------------------------------------

    const fareMultiplier = Number(form.fareMultiplier);

    if (!Number.isFinite(fareMultiplier) || fareMultiplier <= 0) {
      alert("Fare Multiplier phải lớn hơn 0.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // =====================================================
      // CREATE
      // =====================================================

      if (!editingCoach) {
        const payload = {
          trainId: numericTrainId,
          coachNo: form.coachNo.trim(),
          classType: form.classType.trim(),
          totalSeats: totalSeats,
          fareMultiplier: fareMultiplier,
        };

        await api.post("/train-coaches", payload);
      }

      // =====================================================
      // UPDATE
      // =====================================================
      else {
        const payload = {
          classType: form.classType.trim(),
          totalSeats: totalSeats,
          fareMultiplier: fareMultiplier,
        };

        await api.put(`/train-coaches/${editingCoach.id}`, payload);
      }

      // =====================================================
      // CLOSE
      // =====================================================

      closeForm();

      // =====================================================
      // RELOAD
      // =====================================================

      await loadCoaches();
    } catch (err) {
      console.error("Save coach error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Lưu Coach thất bại.";

      alert(typeof message === "string" ? message : "Lưu Coach thất bại.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // DELETE /api/train-coaches/{id}
  // =========================================================

  const handleDelete = async (coach) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa Coach "${coach.coachNo}"?`,
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/train-coaches/${coach.id}`);

      await loadCoaches();
    } catch (err) {
      console.error("Delete coach error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Không thể xóa Coach.";

      alert(typeof message === "string" ? message : "Không thể xóa Coach.");
    }
  };

  // =========================================================
  // GO TO SEATS
  // =========================================================

  const handleSeats = (coach) => {
    navigate(`/admin/coaches/${coach.id}/seats`);
  };

  // =========================================================
  // BACK TO TRAIN MANAGEMENT
  // =========================================================

  const handleBack = () => {
    navigate("/admin/trains");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            title="Quay lại">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Coach</h1>

            <p className="text-sm text-gray-500 mt-1">
              Train ID:{" "}
              <span className="font-semibold text-gray-700">
                {validTrainId ? numericTrainId : "N/A"}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={openAdd}
          disabled={!validTrainId}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus size={18} />
          Thêm Coach
        </button>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tổng Coach</p>

          <p className="text-2xl font-bold text-gray-800 mt-1">
            {coaches.length}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tổng ghế</p>

          <p className="text-2xl font-bold text-gray-800 mt-1">
            {coaches.reduce(
              (sum, coach) => sum + (Number(coach.totalSeats) || 0),
              0,
            )}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Train</p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            #{validTrainId ? numericTrainId : "N/A"}
          </p>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ?
          <div className="py-12 text-center text-gray-500">
            Đang tải danh sách Coach...
          </div>
        : <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">ID</th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Coach No
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Class Type
                  </th>

                  <th className="px-5 py-3 text-center font-semibold">
                    Total Seats
                  </th>

                  <th className="px-5 py-3 text-center font-semibold">
                    Fare Multiplier
                  </th>

                  <th className="px-5 py-3 text-center font-semibold">Seats</th>

                  <th className="px-5 py-3 text-center font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {coaches.length === 0 ?
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Armchair size={36} className="text-gray-300" />

                        <span>Train này chưa có Coach.</span>
                      </div>
                    </td>
                  </tr>
                : coaches.map((coach) => (
                    <tr
                      key={coach.id}
                      className="border-t hover:bg-gray-50 transition">
                      {/* ID */}

                      <td className="px-5 py-4">{coach.id}</td>

                      {/* COACH NO */}

                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-800">
                          {coach.coachNo}
                        </span>
                      </td>

                      {/* CLASS */}

                      <td className="px-5 py-4">{coach.classType || "—"}</td>

                      {/* TOTAL SEATS */}

                      <td className="px-5 py-4 text-center">
                        {coach.totalSeats ?? 0}
                      </td>

                      {/* FARE MULTIPLIER */}

                      <td className="px-5 py-4 text-center">
                        {coach.fareMultiplier ?? 1}
                      </td>

                      {/* SEATS */}

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleSeats(coach)}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
                          title="Quản lý ghế">
                          <Armchair size={16} />

                          {Array.isArray(coach.seats) ? coach.seats.length : 0}
                        </button>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">
                        <div className="flex justify-center items-center gap-3">
                          {/* VIEW */}

                          <button
                            onClick={() => openView(coach)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Xem">
                            <Eye size={17} />
                          </button>

                          {/* EDIT */}

                          <button
                            onClick={() => openEdit(coach)}
                            className="text-green-600 hover:text-green-800"
                            title="Sửa">
                            <Pencil size={17} />
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() => handleDelete(coach)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {isReadOnly ?
                  "Xem thông tin Coach"
                : editingCoach ?
                  "Sửa Coach"
                : "Thêm Coach"}
              </h2>

              <button
                onClick={closeForm}
                disabled={saving}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                <X size={20} />
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* =================================================
                  TRAIN ID
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Train ID
                </label>

                <input
                  type="text"
                  value={validTrainId ? `Train ID: ${numericTrainId}` : "N/A"}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Train ID được lấy từ URL.
                </p>
              </div>

              {/* =================================================
                  COACH NO
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coach No
                </label>

                <input
                  type="text"
                  name="coachNo"
                  value={form.coachNo}
                  onChange={handleChange}
                  disabled={isReadOnly || Boolean(editingCoach)}
                  required
                  placeholder="Ví dụ: A1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {editingCoach && !isReadOnly && (
                  <p className="text-xs text-gray-400 mt-1">
                    Coach No không được thay đổi sau khi tạo.
                  </p>
                )}
              </div>

              {/* =================================================
                  CLASS TYPE
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Type
                </label>

                <select
                  name="classType"
                  value={form.classType}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Chọn loại Coach --</option>

                  <option value="Soft Seat">Soft Seat</option>

                  <option value="Hard Seat">Hard Seat</option>

                  <option value="Soft Sleeper">Soft Sleeper</option>

                  <option value="Hard Sleeper">Hard Sleeper</option>

                  <option value="AC Chair Car">AC Chair Car</option>

                  <option value="AC Sleeper">AC Sleeper</option>
                </select>
              </div>

              {/* =================================================
                  TOTAL SEATS
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Seats
                </label>

                <input
                  type="number"
                  name="totalSeats"
                  value={form.totalSeats}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  min="1"
                  required
                  placeholder="Ví dụ: 20"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* =================================================
                  FARE MULTIPLIER
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fare Multiplier
                </label>

                <input
                  type="number"
                  name="fareMultiplier"
                  value={form.fareMultiplier}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Ví dụ: 1.2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50">
                  {isReadOnly ? "Đóng" : "Hủy"}
                </button>

                {!isReadOnly && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                    {saving ?
                      "Đang lưu..."
                    : editingCoach ?
                      "Cập nhật"
                    : "Thêm Coach"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachManagement;
