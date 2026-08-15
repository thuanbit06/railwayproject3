import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { getTicketByPNR, cancelTicket } from "../../services/ticketService";

const CancelTicket = () => {
  // Lấy mã PNR từ URL (ví dụ: /cancel/48291054)
  const { pnr } = useParams();
  const nav = useNavigate();

  // Các state quản lý giao diện
  const [ticket, setTicket] = useState(null); // Thông tin vé
  const [reason, setReason] = useState(""); // Lý do hủy
  const [step, setStep] = useState("confirm"); // Trạng thái: confirm | success
  const [loading, setLoading] = useState(false); // Đang xử lý?
  const [error, setError] = useState(""); // Thông báo lỗi

  // Các lý do hủy mẫu để người dùng chọn
  const reasons = [
    "Change of travel plans",
    "Booking made by mistake",
    "Emergency / Personal reasons",
    "Found a better alternative",
  ];

  /* =======================
     [1] LẤY THÔNG TIN VÉ KHI VÀO TRANG
  ======================== */
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await getTicketByPNR(pnr); // Gọi API lấy chi tiết vé
        setTicket(res.data);
      } catch (err) {
        setError("Ticket not found or already cancelled.");
      }
    };
    fetchTicket();
  }, [pnr]);

  /* =======================
     [2] TÍNH TIỀN HOÀN LẠI (REFUND)
  ======================== */
  const calculateRefund = () => {
    if (!ticket) return 0;

    const fare = ticket.fare || 0;
    const now = new Date();
    const departure = new Date(ticket.journeyDate);

    // Tính số giờ còn lại đến giờ tàu chạy
    const hoursDiff = (departure - now) / (1000 * 60 * 60);

    // Chính sách: Còn >= 24h → hoàn 75% (trừ 25% phí)
    //              Dưới 24h  → không hoàn tiền
    const refundPercent = hoursDiff >= 24 ? 0.75 : 0;

    return (fare * refundPercent).toFixed(2);
  };

  /* =======================
     [3] XỬ LÝ HỦY VÉ
  ======================== */
  const handleCancel = async () => {
    if (!reason) return; // Phải chọn lý do

    setLoading(true);
    setError("");

    try {
      // Gọi API hủy vé, gửi kèm lý do
      await cancelTicket(pnr, { reason });
      setStep("success"); // Chuyển sang màn hình thành công
    } catch (err) {
      setError("Failed to cancel ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     [4] MÀN HÌNH THÀNH CÔNG
  ======================== */
  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
          {/* Icon thành công */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Ticket Cancelled</h1>
          <p className="text-gray-500 mb-2">
            PNR: <span className="font-bold text-gray-700">{pnr}</span>
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Refund of{" "}
            <span className="font-bold text-green-600">
              ${calculateRefund()}
            </span>{" "}
            will be processed within 5–7 business days.
          </p>

          {/* Nút điều hướng */}
          <div className="flex gap-3">
            <button
              onClick={() => nav("/my-tickets")}
              className="flex-1 bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3 rounded-xl">
              My Tickets
            </button>
            <button
              onClick={() => nav("/")}
              className="flex-1 border border-gray-200 py-3 rounded-xl">
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     [5] MÀN HÌNH LỖI
  ======================== */
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow text-center max-w-md">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => nav("/my-tickets")}
            className="bg-[#003A8C] text-white px-6 py-3 rounded-xl font-bold">
            Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  /* =======================
     [6] MÀN HÌNH ĐANG TẢI
  ======================== */
  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* =======================
     [7] MÀN HÌNH XÁC NHẬN HỦY VÉ
  ======================== */
  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Nút quay lại */}
        <button
          onClick={() => nav(-1)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4">
          ← Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border p-8">
          {/* Thông báo chính sách */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl mb-6">
            <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
            <div>
              <p className="font-bold text-yellow-800">Cancellation Policy</p>
              <p className="text-sm text-yellow-700">
                25% deduction if cancelled 24+ hours before departure. No refund
                within 24 hours.
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Cancel Ticket</h1>
          <p className="text-gray-400 mb-6">
            PNR: <span className="font-semibold text-gray-600">{pnr}</span>
          </p>

          {/* Thông tin vé tóm tắt */}
          <div className="bg-[#f4f7ff] rounded-xl p-4 mb-6 text-sm space-y-2">
            <SummaryRow label="Train" value={ticket.trainName} />
            <SummaryRow
              label="Date"
              value={new Date(ticket.journeyDate).toLocaleDateString()}
            />
            <SummaryRow label="Fare" value={`$${ticket.fare}`} />
          </div>

          {/* Chọn lý do hủy */}
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            Reason for Cancellation
          </label>
          <div className="space-y-2 mb-6">
            {reasons.map((r) => (
              <label
                key={r}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-[#003A8C]"
                />
                <span className="text-sm text-gray-700">{r}</span>
              </label>
            ))}
          </div>

          {/* Hiển thị số tiền hoàn lại */}
          <div className="p-4 bg-green-50 rounded-xl mb-6">
            <p className="text-sm font-bold text-green-800">Estimated Refund</p>
            <p className="text-2xl font-black text-green-600">
              ${calculateRefund()}
            </p>
            <p className="text-[10px] text-green-600">
              After applicable cancellation charges
            </p>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={!reason || loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Confirm Cancellation <ArrowRight size={16} />
            </button>
            <button
              onClick={() => nav(-1)}
              className="flex-1 border border-gray-200 py-3.5 rounded-xl font-semibold text-gray-600">
              Keep Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =======================
    COMPONENT PHỤ: DÒNG THÔNG TIN
======================== */
const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

export default CancelTicket;
