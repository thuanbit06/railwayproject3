import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Ticket, Download, Eye, AlertCircle } from "lucide-react";

import { getMyTickets } from "../../services/ticketService";
import E_Ticket_Modal from "../../components/E_Ticket_Modal";

const MyTickets = () => {
  const { user } = useAuth();

  const nav = useNavigate();

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);

  // =====================================================
  // LOAD MY TICKETS
  // =====================================================

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }

    const fetchTickets = async () => {
      try {
        setLoading(true);

        setError("");

        const res = await getMyTickets();

        setTickets(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);

        if (err.response?.status === 401) {
          nav("/login");
          return;
        }

        setError("Unable to load your tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, nav]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "N/A";

    /*
     * ASP.NET TimeSpan thường trả:
     *
     * 08:00:00
     *
     * Chúng ta chỉ lấy HH:mm
     */

    if (typeof time === "string") {
      return time.substring(0, 5);
    }

    return time;
  };

  // =====================================================
  // FORMAT FARE
  // =====================================================

  const formatFare = (fare) => {
    if (fare === null || fare === undefined) {
      return "N/A";
    }

    return `₹${Number(fare).toLocaleString("en-IN")}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "waiting":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =====================================================
  // RENDER CONTENT
  // =====================================================

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-16 text-gray-400">
          Loading your tickets...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 text-red-500 flex flex-col items-center">
          <AlertCircle size={40} className="mb-3" />

          <p>{error}</p>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="text-center py-16 text-gray-400">
          <Ticket size={48} className="mx-auto mb-4 opacity-50" />

          <p className="text-lg font-semibold">
            You haven't booked any tickets yet.
          </p>

          <p className="text-sm mt-1">Your booked tickets will appear here.</p>

          <button
            onClick={() => nav("/")}
            className="mt-5 text-sm text-blue-600 font-semibold hover:underline">
            Book your first trip
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Ticket size={22} className="text-blue-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-800">
                    {ticket.trainName || "Unknown Train"}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Train No: {ticket.trainNo || "N/A"}
                  </p>

                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    PNR: {ticket.pnr || ticket.PNR || "N/A"}
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <span
                className={`self-start md:self-auto text-xs font-bold px-3 py-1.5 rounded-full ${getStatusClass(
                  ticket.status,
                )}`}>
                {ticket.status || "Unknown"}
              </span>
            </div>

            {/* =================================================
                ROUTE
            ================================================= */}

            <div className="border-t border-gray-100 my-5" />

            <div className="grid grid-cols-3 items-center">
              {/* FROM */}

              <div>
                <p className="text-lg font-bold text-gray-800">
                  {ticket.fromStation || "N/A"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {formatTime(ticket.departureTime)}
                </p>
              </div>

              {/* ARROW */}

              <div className="text-center">
                <div className="border-t-2 border-dashed border-gray-300 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-blue-600" />
                </div>

                <p className="text-[10px] text-gray-400 mt-3">
                  {formatDate(ticket.journeyDate)}
                </p>
              </div>

              {/* TO */}

              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">
                  {ticket.toStation || "N/A"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {formatTime(ticket.arrivalTime)}
                </p>
              </div>
            </div>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] uppercase text-gray-400">Passenger</p>

                <p className="font-semibold text-sm mt-1 truncate">
                  {ticket.passengerName || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] uppercase text-gray-400">Coach</p>

                <p className="font-semibold text-sm mt-1">
                  {ticket.coachNo || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] uppercase text-gray-400">Seat</p>

                <p className="font-semibold text-sm mt-1">
                  {ticket.seatNo || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] uppercase text-gray-400">Booking</p>

                <p className="font-semibold text-sm mt-1">
                  {ticket.bookingStatus || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] uppercase text-gray-400">Fare</p>

                <p className="font-bold text-sm text-blue-600 mt-1">
                  {formatFare(ticket.fare)}
                </p>
              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setSelectedTicket(ticket)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
                <Eye size={16} />
                View E-Ticket
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600">
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => nav("/")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Tickets</h1>

          <p className="text-sm text-gray-500 mt-1">
            View and manage all your railway tickets.
          </p>
        </div>

        {renderContent()}
      </div>

      {/* ===================================================
          E-TICKET MODAL
      =================================================== */}

      <E_Ticket_Modal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};

export default MyTickets;
