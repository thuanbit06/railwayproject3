import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import E_Ticket_Modal from "../../components/E_Ticket_Modal";
import { Eye, Trash2 } from "lucide-react";
import { getTickets, cancelTicket } from "../../services/ticketService";

const TicketsManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getTickets();
      setTickets(res.data);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this ticket?")) return;
    try {
      await cancelTicket(id);
      fetchTickets();
    } catch (e) {
      alert("Failed to cancel ticket.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tickets Management"
        subtitle="All issued electronic tickets."
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ?
        <div className="text-center py-10 text-gray-400">Loading...</div>
      : <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[900px]">
              <thead className="bg-[#f4f7ff] text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="p-4">PNR</th>
                  <th className="p-4">Passenger</th>
                  <th className="p-4">Train</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Fare</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-blue-600">{t.pnr}</td>
                    <td className="p-4 text-xs">
                      <div className="font-bold">{t.passengerName}</div>
                      <div className="text-gray-500">{t.age} yrs</div>
                    </td>
                    <td className="p-4 text-xs">{t.trainName}</td>
                    <td className="p-4 text-xs">
                      {new Date(t.journeyDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-xs font-bold">${t.fare}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          t.status === "Cancelled" ?
                            "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                        }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelected(t)}
                        className="text-gray-400 hover:text-blue-600 mr-3"
                        title="View">
                        <Eye size={14} />
                      </button>
                      {t.status !== "Cancelled" && (
                        <button
                          onClick={() => handleCancel(t.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Cancel">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }

      <E_Ticket_Modal ticket={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default TicketsManagement;
