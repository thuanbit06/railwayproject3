// src/pages/Seats.jsx

import React, { useState, useEffect } from "react";
import seatService from "../../services/seatService";
import { useParams } from "react-router-dom";

const Seats = () => {
  // =========================================================
  // GET COACH ID FROM URL
  // Example:
  // /admin/coaches/12/seats
  // coachId = "12"
  // =========================================================

  const { coachId } = useParams();

  // =========================================================
  // STATE
  // =========================================================

  const [seats, setSeats] = useState([]);
  const [editingSeat, setEditingSeat] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // FORM STATE
  // CoachId is controlled by URL
  // =========================================================

  const [form, setForm] = useState({
    coachId: "",
    seatNo: "",
    berthType: "",
  });

  // =========================================================
  // LOAD SEATS BY COACH
  // GET /api/seats/coach/{coachId}
  // =========================================================

  const loadSeats = async () => {
    if (!coachId) {
      setSeats([]);
      setError("Không tìm thấy Coach ID.");
      return;
    }

    const numericCoachId = Number(coachId);

    if (!Number.isInteger(numericCoachId) || numericCoachId <= 0) {
      setSeats([]);
      setError("Coach ID không hợp lệ.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await seatService.getByCoachId(numericCoachId);

      setSeats(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load seats error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Không thể tải danh sách ghế.";

      setError(
        typeof message === "string" ? message : "Không thể tải danh sách ghế.",
      );

      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD WHEN COACH ID CHANGES
  // =========================================================

  useEffect(() => {
    loadSeats();
  }, [coachId]);

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const openAdd = () => {
    setEditingSeat(null);
    setIsReadOnly(false);

    setForm({
      coachId: coachId || "",
      seatNo: "",
      berthType: "",
    });

    setError("");
    setIsFormOpen(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEdit = (seat) => {
    setEditingSeat(seat);
    setIsReadOnly(false);

    setForm({
      // Always use coachId from URL
      coachId: coachId || seat.coachId || "",
      seatNo: seat.seatNo || "",
      berthType: seat.berthType || "",
    });

    setError("");
    setIsFormOpen(true);
  };

  // =========================================================
  // OPEN VIEW FORM
  // =========================================================

  const openView = (seat) => {
    setEditingSeat(seat);
    setIsReadOnly(true);

    setForm({
      coachId: seat.coachId || coachId || "",
      seatNo: seat.seatNo || "",
      berthType: seat.berthType || "",
    });

    setError("");
    setIsFormOpen(true);
  };

  // =========================================================
  // DELETE SEAT
  // DELETE /api/seats/{id}
  // =========================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ghế này?")) {
      return;
    }

    try {
      setError("");

      await seatService.remove(id);

      await loadSeats();
    } catch (err) {
      console.error("Delete seat error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Xóa ghế thất bại.";

      alert(typeof message === "string" ? message : "Xóa ghế thất bại.");
    }
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReadOnly) {
      return;
    }

    // -------------------------------------------------------
    // Validate Coach ID from URL
    // -------------------------------------------------------

    const numericCoachId = Number(coachId);

    if (!coachId || !Number.isInteger(numericCoachId) || numericCoachId <= 0) {
      alert("Coach ID không hợp lệ.");
      return;
    }

    // -------------------------------------------------------
    // Validate Seat No
    // -------------------------------------------------------

    if (!form.seatNo.trim()) {
      alert("Vui lòng nhập Seat No.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // -----------------------------------------------------
      // IMPORTANT:
      // CoachId ALWAYS comes from URL
      // User cannot change Coach accidentally
      // -----------------------------------------------------

      const payload = {
        coachId: numericCoachId,
        seatNo: form.seatNo.trim(),
        berthType: form.berthType.trim() || null,
      };

      // -----------------------------------------------------
      // UPDATE
      // -----------------------------------------------------

      if (editingSeat) {
        await seatService.update(editingSeat.id, payload);
      }

      // -----------------------------------------------------
      // CREATE
      // -----------------------------------------------------
      else {
        await seatService.create(payload);
      }

      // -----------------------------------------------------
      // CLOSE MODAL
      // -----------------------------------------------------

      setIsFormOpen(false);

      setEditingSeat(null);

      // -----------------------------------------------------
      // RESET FORM
      // -----------------------------------------------------

      setForm({
        coachId: coachId,
        seatNo: "",
        berthType: "",
      });

      // -----------------------------------------------------
      // RELOAD
      // -----------------------------------------------------

      await loadSeats();
    } catch (err) {
      console.error("Save seat error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Lưu ghế thất bại.";

      alert(typeof message === "string" ? message : "Lưu ghế thất bại.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    setEditingSeat(null);
    setIsReadOnly(false);
  };

  // =========================================================
  // SORT SEATS
  // =========================================================

  const sortedSeats = [...seats].sort((a, b) =>
    String(a.seatNo || "").localeCompare(String(b.seatNo || ""), undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  // =========================================================
  // CURRENT COACH ID
  // =========================================================

  const currentCoachId = Number(coachId);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Ghế (Seat)</h1>

        <button
          onClick={openAdd}
          disabled={!coachId || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          + Thêm ghế
        </button>
      </div>

      {/* =====================================================
          COACH INFORMATION
      ====================================================== */}

      <div className="mb-6 bg-white rounded-xl shadow p-4 border">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-sm text-gray-500">Coach ID</span>

            <p className="font-semibold text-gray-800">
              {Number.isInteger(currentCoachId) && currentCoachId > 0 ?
                currentCoachId
              : "N/A"}
            </p>
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <div>
            <span className="text-sm text-gray-500">Tổng số ghế</span>

            <p className="font-semibold text-gray-800">{seats.length}</p>
          </div>
        </div>
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
          SEAT MAP
      ====================================================== */}

      <div className="mb-8 bg-gray-50 rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Sơ đồ ghế – Coach {coachId || "N/A"}
        </h2>

        {/* Hướng đầu tàu */}

        <div className="text-center mb-6">
          <div className="inline-block bg-gray-700 text-white px-10 py-2 rounded-t-xl text-sm">
            Hướng đầu tàu
          </div>
        </div>

        {/* Loading */}

        {loading ?
          <div className="py-10 text-center text-gray-500">
            Đang tải sơ đồ ghế...
          </div>
        : sortedSeats.length === 0 ?
          <div className="py-10 text-center text-gray-400">
            Coach này chưa có ghế.
          </div>
        : <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {sortedSeats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => openView(seat)}
                className="w-14 h-14 rounded-lg bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center text-xs font-medium transition shadow"
                title={`${seat.seatNo} - ${seat.berthType || "Ghế thường"}`}>
                <span className="text-sm font-bold">{seat.seatNo}</span>

                {seat.berthType && (
                  <span className="text-[10px] opacity-90">
                    {seat.berthType.substring(0, 1)}
                  </span>
                )}
              </button>
            ))}
          </div>
        }

        {/* =================================================
            CHÚ THÍCH
        ================================================== */}

        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Còn trống</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Đã đặt</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Đang chọn</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEAT TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ?
          <div className="p-10 text-center text-gray-500">Đang tải...</div>
        : <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>

                  <th className="px-4 py-3 text-left font-semibold">Coach</th>

                  <th className="px-4 py-3 text-left font-semibold">Seat No</th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Berth Type
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">Class</th>

                  <th className="px-4 py-3 text-center font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {seats.length === 0 ?
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      Không có ghế nào
                    </td>
                  </tr>
                : seats.map((seat) => (
                    <tr key={seat.id} className="border-t hover:bg-gray-50">
                      {/* ID */}

                      <td className="px-4 py-3">{seat.id}</td>

                      {/* COACH */}

                      <td className="px-4 py-3">
                        {seat.coachNo || seat.coachId || "N/A"}
                      </td>

                      {/* SEAT NO */}

                      <td className="px-4 py-3 font-medium">{seat.seatNo}</td>

                      {/* BERTH TYPE */}

                      <td className="px-4 py-3">{seat.berthType || "—"}</td>

                      {/* CLASS */}

                      <td className="px-4 py-3">{seat.classType || "—"}</td>

                      {/* ACTIONS */}

                      <td className="px-4 py-3 text-center space-x-3">
                        <button
                          onClick={() => openView(seat)}
                          className="text-blue-600 hover:underline">
                          Xem
                        </button>

                        <button
                          onClick={() => openEdit(seat)}
                          className="text-green-600 hover:underline">
                          Sửa
                        </button>

                        <button
                          onClick={() => handleDelete(seat.id)}
                          className="text-red-600 hover:underline">
                          Xóa
                        </button>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            {/* MODAL TITLE */}

            <h2 className="text-xl font-bold mb-5">
              {isReadOnly ?
                "Xem thông tin ghế"
              : editingSeat ?
                "Sửa ghế"
              : "Thêm ghế mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* =================================================
                  COACH
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coach
                </label>

                <input
                  type="text"
                  value={form.coachId ? `Coach ID: ${form.coachId}` : "N/A"}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* =================================================
                  SEAT NO
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seat No
                </label>

                <input
                  type="text"
                  name="seatNo"
                  value={form.seatNo}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  placeholder="Ví dụ: 12A, 15, 8B..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* =================================================
                  BERTH TYPE
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Berth Type
                </label>

                <select
                  name="berthType"
                  value={form.berthType}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Không có --</option>

                  <option value="Lower">Lower</option>

                  <option value="Middle">Middle</option>

                  <option value="Upper">Upper</option>

                  <option value="SideLower">Side Lower</option>

                  <option value="SideUpper">Side Upper</option>
                </select>
              </div>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50">
                  {isReadOnly ? "Đóng" : "Hủy"}
                </button>

                {!isReadOnly && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                    {saving ? "Đang lưu..." : "Lưu"}
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

export default Seats;
