import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  Train,
  MapPin,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";
import { checkPnrStatus } from "../../services/ticketService";

const PnrStatus = () => {
  const nav = useNavigate();
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pnr.trim()) {
      setError("Please enter a PNR number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);
      const res = await checkPnrStatus(pnr.trim());
      setData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError(`PNR "${pnr}" not found. Please check and try again.`);
      } else if (err.response?.status === 401) {
        setError("Please login to check PNR status.");
      } else {
        setError("Failed to check PNR. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    // timeStr dạng "06:00:00" hoặc TimeSpan
    const [h, m] = timeStr.split(":");
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m));
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const getPaymentBadge = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-orange-100 text-orange-700";
    if (status === "Failed") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
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
      {/* TITLE */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Ticket className="text-blue-600" size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            PNR Status
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Check your booking status by entering PNR number
          </p>
        </div>
      </div>

      {/* SEARCH FORM */}
      <form
        onSubmit={handleCheck}
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mt-6">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Enter PNR Number
        </label>
        <div className="relative mt-2">
          <Ticket
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="e.g. PNR1A2B3C4"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="w-full pl-9 pr-3 py-3 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition"
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-3 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">
            <XCircle size={14} /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition">
          {loading ?
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <>
              <Search size={16} /> Check Status
            </>
          }
        </button>
      </form>

      {/* RESULT */}
      {data && (
        <div className="mt-6 space-y-4">
          {/* MAIN CARD */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 text-white">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-blue-200 font-bold">
                    PNR Number
                  </p>
                  <p className="text-lg sm:text-xl font-bold">{data.pnr}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] uppercase tracking-wide text-blue-200 font-bold">
                    Payment
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getPaymentBadge(data.paymentStatus)} bg-white/20 text-white`}>
                    {data.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* Train Info */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                  <Train size={18} className="text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Train</p>
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {data.trainName}
                  </p>
                  <p className="text-xs text-gray-500">#{data.trainNo}</p>
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-green-600" />
                    <span className="text-xs font-bold text-gray-800">
                      {data.fromStation}
                    </span>
                  </div>
                  <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-6 my-1"></div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-red-500" />
                    <span className="text-xs font-bold text-gray-800">
                      {data.toStation}
                    </span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {formatDate(data.journeyDate)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(data.departureTime)}
                  </p>
                </div>
              </div>

              {/* Passenger & Seat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                {/* Passenger */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Passenger
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      {data.passenger?.fullName || "N/A"}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {data.passenger?.age}yrs • {data.passenger?.gender}
                    </p>
                  </div>
                </div>

                {/* Seat */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Ticket size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Seat
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      {data.seatNo} • {data.coachClass}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Base Fare</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(data.fare)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">GST (5%)</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(data.gstAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-1.5 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Total Paid</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(data.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={() => nav(`/ticket/${data.pnr}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition">
              View Full Ticket
            </button>
            <button
              onClick={() => {
                setData(null);
                setPnr("");
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50 transition">
              Check Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PnrStatus;
