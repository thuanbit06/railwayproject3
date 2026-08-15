import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Train,
  MapPin,
  Clock,
  CheckCircle2,
  Download,
  X,
  ArrowLeft,
  Printer,
} from "lucide-react";
import { getTicketByPNR } from "../../services/ticketService"; // 1. Import API Service

const TicketDetails = () => {
  const { pnr } = useParams();
  const nav = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getTicketByPNR(pnr);
        setTicket(res.data);
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
        setError("Ticket not found or you do not have permission to view it.");
      } finally {
        setLoading(false);
      }
    };

    if (pnr) {
      fetchTicket();
    }
  }, [pnr]);

  const getStatusColor = (status) => {
    if (status === "Confirmed") return "bg-green-500";
    if (status === "Cancelled") return "bg-red-500";
    return "bg-yellow-500"; // Pending
  };

  const handlePrint = () => {
    window.print();
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center">
        Loading ticket details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex flex-col items-center justify-center p-6">
        <X size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => nav(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Back to My Tickets
        </button>

        {/* E-Ticket */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#003A8C] to-[#1677FF] p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Train size={20} />
                </div>
                <div>
                  <p className="font-bold text-lg">{ticket.trainName}</p>
                  <p className="text-xs opacity-70">
                    {ticket.trainNo} • {ticket.class}
                  </p>
                </div>
              </div>
              <span
                className={`${getStatusColor(ticket.status)} text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                <CheckCircle2 size={10} /> {ticket.status}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* PNR & Date */}
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">
                  PNR NUMBER
                </p>
                <p className="font-black text-xl text-[#003A8C]">
                  {ticket.pnr}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold tracking-wider">
                  JOURNEY DATE
                </p>
                <p className="font-bold text-gray-800">
                  {new Date(ticket.journeyDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-center">
                <p className="font-bold text-xl">{ticket.departureTime}</p>
                <p className="text-[10px] text-gray-400">
                  {ticket.fromStation}
                </p>
              </div>
              <div className="flex-1 relative px-2">
                <div className="border-t-2 border-dashed border-gray-300" />
                <p className="text-center text-[10px] text-gray-400 mt-1">
                  {ticket.duration || "N/A"}
                </p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl">{ticket.arrivalTime}</p>
                <p className="text-[10px] text-gray-400">{ticket.toStation}</p>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">
                  PASSENGER
                </p>
                <p className="font-semibold">{ticket.passengerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">
                  AGE / GENDER
                </p>
                <p className="font-semibold">
                  {ticket.age} / {ticket.gender}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">
                  COACH / SEAT
                </p>
                <p className="font-semibold">
                  {ticket.coach} / {ticket.seat}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">
                  FARE
                </p>
                <p className="font-semibold">${ticket.fare}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                <Printer size={16} /> Print / Save as PDF
              </button>
              {ticket.status === "Confirmed" && (
                <button
                  onClick={() => nav(`/cancel/${ticket.pnr}`)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                  <X size={16} /> Cancel Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
