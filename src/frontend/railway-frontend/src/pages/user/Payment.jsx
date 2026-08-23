import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { BookingContext } from "../../context/BookingContext"; // 1. Lấy dữ liệu đặt vé
import { createBooking } from "../../services/bookingService"; // 2. Gọi API đặt vé

const Payment = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { bookingData, clearBooking } = useContext(BookingContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy thông tin tàu từ state (truyền từ trang BookTicket)
  const train = location.state?.train;
  const totalFare = bookingData?.passengers?.length * (train?.fare || 1200);

  const handlePay = async () => {
    if (!bookingData || !train) {
      setError("Booking information is missing. Please start over.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Giả lập độ trễ mạng khi gọi API thanh toán
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Gọi API để lưu booking vào Database
      const res = await createBooking({
        trainId: train.id,
        journeyDate: train.departure, // Giả định có trường ngày đi
        passengers: bookingData.passengers,
        totalFare,
      });

      // Xóa dữ liệu tạm sau khi đặt vé thành công
      clearBooking();

      // Chuyển sang trang thành công kèm theo PNR
      nav("/booking-success", {
        state: {
          pnr: res.data.pnr,
          train: train.name,
          date: train.departure,
        },
      });
    } catch (err) {
      console.error("Payment failed:", err);
      setError("Payment failed. Please try again or use a different card.");
    } finally {
      setLoading(false);
    }
  };

  // Nếu chưa có dữ liệu đặt vé, quay về trang chủ
  if (!train || !bookingData.passengers?.length) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center">
        <p className="text-red-500">No booking data found. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <button
          onClick={() => nav(-1)}
          className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[#003A8C]
          hover:text-[#1677FF]
          transition
        ">
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-2xl font-bold mb-2">Payment Gateway</h1>
        <p className="text-sm text-gray-500 mb-6">
          Complete your purchase securely.
        </p>

        {/* Invoice Summary */}
        <div className="bg-[#f4f7ff] rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <SummaryRow
              label="Train"
              value={`${train.name} (${train.from} → ${train.to})`}
            />
            <SummaryRow
              label="Passengers"
              value={bookingData.passengers.length}
            />
            <SummaryRow label="Fare per pax" value={`$${train.fare}`} />
            <hr className="my-2 border-dashed" />
            <SummaryRow label="Total Amount" value={`$${totalFare}`} bold />
          </div>
        </div>

        {/* Mock Card Input */}
        <div className="space-y-4">
          <Input
            icon={<CreditCard />}
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            disabled={loading}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry Date" placeholder="MM/YY" disabled={loading} />
            <Input label="CVV" placeholder="123" disabled={loading} />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-600">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-60">
          {loading ?
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <>
              <Lock size={18} /> Pay ${totalFare}
            </>
          }
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 This is a mock payment gateway for demonstration purposes. No real
          transaction occurs.
        </p>
      </div>
    </div>
  );
};

/* =======================
    REUSABLE COMPONENTS
======================== */
const Input = ({ icon, label, ...props }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 mb-1 block">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition`}
      />
    </div>
  </div>
);

const SummaryRow = ({ label, value, bold }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span
      className={`${bold ? "font-bold text-lg text-gray-800" : "text-gray-700"}`}>
      {value}
    </span>
  </div>
);

export default Payment;
