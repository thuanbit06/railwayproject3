import React from "react";
import {
  X,
  QrCode,
  Train,
  CalendarDays,
  User,
  MapPin,
  Hash,
  Download,
} from "lucide-react";

const E_Ticket_Modal = ({ ticket, onClose }) => {
  if (!ticket) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">E-Reservation Slip</h2>
            <p className="text-blue-100 text-sm">Indian Railways</p>
          </div>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Train size={28} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {ticket.trainName} ({ticket.trainNo})
              </h3>
              <p className="text-sm text-gray-500">
                {ticket.coach} | {ticket.seat}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="text-center">
              <p className="font-bold text-lg">{ticket.fromStation}</p>
              <p className="text-xs text-gray-500">{ticket.departureTime}</p>
            </div>
            <div className="flex-1 mx-4 relative">
              <div className="border-t-2 border-dashed border-gray-300"></div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">
                {ticket.to.split("(")[1]?.replace(")", "")}
              </p>
              <p className="text-xs text-gray-500">{ticket.arrival}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            {[
              { i: CalendarDays, l: "Date", v: ticket.date },
              {
                i: User,
                l: "Passenger",
                v: `${ticket.passenger} (${ticket.age})`,
              },
              { i: Hash, l: "PNR", v: ticket.pnr },
              { i: QrCode, l: "Status", v: ticket.status },
            ].map((b, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <b.i size={14} />{" "}
                  <span className="text-[10px] uppercase">{b.l}</span>
                </div>
                <p className="font-bold text-sm">{b.v}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-5 border">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white border-4 border-blue-100 rounded-lg flex items-center justify-center">
                <QrCode size={48} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold">Scan at Station</h4>
                <p className="text-xs text-gray-500">Present with valid ID</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Fare</p>
              <p className="text-2xl font-bold text-blue-600">{ticket.fare}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t flex justify-between items-center">
          <p className="text-[10px] text-gray-400 italic">
            Computer-generated ticket. No printout required.
          </p>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg">
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default E_Ticket_Modal;
