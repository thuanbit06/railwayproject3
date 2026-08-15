import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 1. Sử dụng Auth Context
import { ArrowLeft, Ticket, Download, Eye, AlertCircle } from "lucide-react";
import { getMyTickets } from "../../services/ticketService"; // 2. Tách biệt Service Layer
import E_Ticket_Modal from "../../components/E_Ticket_Modal";

const MyTickets = () => {
  const { user } = useAuth(); // Lấy thông tin user từ global state
  const nav = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // 3. Thêm xử lý lỗi
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    // Nếu chưa đăng nhập, chuyển về trang login
    if (!user) {
      nav("/login");
      return;
    }

    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getMyTickets(); // Gọi API qua service
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Unable to load your tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, nav]);

  /* =======================
     RENDER LOGIC
  ======================== */
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10 text-gray-400">
          Loading your tickets...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-500 flex flex-col items-center">
          <AlertCircle size={40} className="mb-3" />
          <p>{error}</p>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="text-center py-10 text-gray-400">
          <Ticket size={40} className="mx-auto mb-3 opacity-50" />
          <p>You haven’t booked any tickets yet.</p>
          <button
            onClick={() => nav("/")}
            className="mt-4 text-sm text-blue-600 font-semibold hover:underline">
            Book your first trip
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              {/* Left: Ticket Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Ticket size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">{t.trainName}</p>
                  <p className="text-xs text-gray-500">
                    {t.fromStation} → {t.toStation} •{" "}
                    {new Date(t.journeyDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    {t.pnr}
                  </p>
                </div>
              </div>

              {/* Right: Actions & Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    t.status === "Confirmed" ? "bg-green-100 text-green-700"
                    : t.status === "Cancelled" ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-500"
                  }`}>
                  {t.status}
                </span>

                <button
                  onClick={() => setSelectedTicket(t)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View E-Ticket">
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => window.print()} // Placeholder for PDF export
                  className="text-gray-400 hover:text-blue-600"
                  title="Download">
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-6">
      <button
        onClick={() => nav("/")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tickets</h1>
        {renderContent()}
      </div>

      {/* E-Ticket Modal */}
      <E_Ticket_Modal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};

export default MyTickets;
