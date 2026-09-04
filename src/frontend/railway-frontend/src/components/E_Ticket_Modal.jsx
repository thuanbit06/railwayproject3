import React from "react";
import {
  X,
  QrCode,
  Train,
  CalendarDays,
  User,
  Hash,
  Download,
  MapPin,
  Armchair,
} from "lucide-react";

const E_Ticket_Modal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const formattedDate =
    ticket.journeyDate ?
      new Date(ticket.journeyDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

  const formatTime = (time) => {
    if (!time) return "N/A";

    // Backend TimeSpan có thể trả:
    // "08:00:00"
    // hoặc "08:00:00.0000000"

    return time.substring(0, 5);
  };

  const formattedFare =
    ticket.fare !== undefined && ticket.fare !== null ?
      `₹${Number(ticket.fare).toLocaleString("en-IN")}`
    : "N/A";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">E-Reservation Slip</h2>

            <p className="text-blue-100 text-sm mt-1">Indian Railways</p>
          </div>

          <button
            onClick={onClose}
            className="hover:bg-white/10 rounded-lg p-1 transition">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8">
          {/* TRAIN */}
          <div className="flex items-center gap-4 mb-7">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Train size={28} className="text-blue-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {ticket.trainName || "Unknown Train"}
              </h3>

              <p className="text-sm text-gray-500">
                Train No: {ticket.trainNo || "N/A"}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-blue-600">
                  Coach {ticket.coachNo || "N/A"}
                </span>

                <span className="text-gray-300">|</span>

                <span className="text-sm font-semibold text-blue-600">
                  Seat {ticket.seatNo || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* ROUTE */}
          <div className="flex items-center justify-between mb-8 px-2">
            {/* FROM */}
            <div className="text-center min-w-[100px]">
              <MapPin size={18} className="mx-auto mb-1 text-blue-600" />

              <p className="font-bold text-lg text-gray-800">
                {ticket.fromStation || "N/A"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {formatTime(ticket.departureTime)}
              </p>
            </div>

            {/* LINE */}
            <div className="flex-1 mx-4 relative">
              <div className="border-t-2 border-dashed border-gray-300" />

              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full" />
            </div>

            {/* TO */}
            <div className="text-center min-w-[100px]">
              <MapPin size={18} className="mx-auto mb-1 text-blue-600" />

              <p className="font-bold text-lg text-gray-800">
                {ticket.toStation || "N/A"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {formatTime(ticket.arrivalTime)}
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            {/* DATE */}
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <CalendarDays size={14} />

                <span className="text-[10px] uppercase">Date</span>
              </div>

              <p className="font-bold text-sm">{formattedDate}</p>
            </div>

            {/* PASSENGER */}
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <User size={14} />

                <span className="text-[10px] uppercase">Passenger</span>
              </div>

              <p className="font-bold text-sm">
                {ticket.passengerName || "N/A"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {ticket.age ? `${ticket.age} years` : ""}

                {ticket.age && ticket.gender ? " • " : ""}

                {ticket.gender || ""}
              </p>
            </div>

            {/* PNR */}
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Hash size={14} />

                <span className="text-[10px] uppercase">PNR</span>
              </div>

              <p className="font-bold text-sm">{ticket.pnr || "N/A"}</p>
            </div>

            {/* STATUS */}
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <QrCode size={14} />

                <span className="text-[10px] uppercase">Status</span>
              </div>

              <p
                className={`font-bold text-sm ${
                  ticket.status === "Confirmed" ? "text-green-600"
                  : ticket.status === "Cancelled" ? "text-red-600"
                  : "text-gray-600"
                }`}>
                {ticket.status || "N/A"}
              </p>
            </div>
          </div>

          {/* QR + FARE */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-gray-50 rounded-2xl p-5 border">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white border-4 border-blue-100 rounded-lg flex items-center justify-center">
                <QrCode size={48} className="text-blue-600" />
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Scan at Station</h4>

                <p className="text-xs text-gray-500 mt-1">
                  Present with valid ID
                </p>

                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                  <Armchair size={14} />

                  <span>
                    Coach {ticket.coachNo || "N/A"}
                    {" • "}
                    Seat {ticket.seatNo || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* FARE */}
            <div className="text-left md:text-right">
              <p className="text-xs text-gray-500">Total Fare</p>

              <p className="text-2xl font-bold text-blue-600">
                {formattedFare}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-8 py-4 border-t flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-gray-400 italic text-center md:text-left">
            Computer-generated ticket. No printout required.
          </p>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default E_Ticket_Modal;
