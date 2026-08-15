import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Ticket, ArrowRight, Download } from "lucide-react";

const BookingSuccess = () => {
  const nav = useNavigate();
  const location = useLocation();

  // ✅ Lấy PNR từ state (truyền từ trang Booking)
  const {
    pnr = "#48291054",
    train = "Express 202",
    date = "Aug 18, 2026",
  } = location.state || {};

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Your ticket has been successfully booked.
        </p>

        {/* Ticket Summary */}
        <div className="bg-[#f4f7ff] rounded-2xl p-5 mb-6 text-left space-y-3">
          <SummaryRow label="PNR Number" value={pnr} bold />
          <SummaryRow label="Train" value={train} />
          <SummaryRow label="Journey Date" value={date} />
          <SummaryRow label="Status" value="Confirmed" green />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => nav("/my-tickets")}
            className="w-full flex items-center justify-center gap-2 bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3 rounded-xl transition">
            <Ticket size={16} /> My Tickets
          </button>

          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
            <Download size={16} /> Download E-Ticket
          </button>

          <button
            onClick={() => nav("/")}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1 mt-2">
            Back to Home <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =======================
    REUSABLE ROW
======================== */
const SummaryRow = ({ label, value, bold, green }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span
      className={`font-medium ${
        bold ? "text-blue-600 font-bold"
        : green ? "text-green-600 font-bold"
        : "text-gray-800"
      }`}>
      {value}
    </span>
  </div>
);

export default BookingSuccess;
