import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Plus, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

const ReservationsManagement = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      pnr: "#48291054",
      name: "Jane Doe",
      email: "jane@email.com",
      train: "Express 202",
      seat: "42A (1A)",
      status: "Confirmed",
    },
    {
      id: 2,
      pnr: "#99201552",
      name: "Michael Smith",
      email: "m@email.com",
      train: "Night Owl 405",
      seat: "12B (SL)",
      status: "Cancelled",
    },
    {
      id: 3,
      pnr: "#38291099",
      name: "Alice Lu",
      email: "alice@email.com",
      train: "Bullet 01",
      seat: "05C (2A)",
      status: "Pending",
    },
  ]);

  /* =======================
     HELPER: Status Badge
  ======================== */
  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          icon: <CheckCircle size={12} />,
          className: "bg-green-100 text-green-700",
        };
      case "Cancelled":
        return {
          icon: <XCircle size={12} />,
          className: "bg-red-100 text-red-700",
        };
      case "Pending":
        return {
          icon: <Clock size={12} />,
          className: "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          icon: null,
          className: "bg-gray-100 text-gray-700",
        };
    }
  };

  /* =======================
     ACTIONS
  ======================== */
  const confirmReservation = (id) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, status: "Confirmed" } : i)),
    );
  };

  const cancelReservation = (id) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, status: "Cancelled" } : i)),
    );
  };

  const viewReservation = (pnr) => {
    alert(`Viewing PNR: ${pnr}\n(Will open E-Ticket Modal in real app)`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservations"
        subtitle="Manage all passenger reservations."
        actions={[
          {
            label: "New Reservation",
            icon: <Plus size={16} />,
            primary: true,
            onClick: () => alert("Open New Reservation Form"),
          },
        ]}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-[#f4f7ff] text-[10px] uppercase text-gray-500">
              <tr>
                <th className="p-4">PNR</th>
                <th className="p-4">Passenger</th>
                <th className="p-4">Train</th>
                <th className="p-4">Seat</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((r) => {
                const badge = getStatusBadge(r.status);
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-blue-600">{r.pnr}</td>
                    <td className="p-4">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.email}</div>
                    </td>
                    <td className="p-4">{r.train}</td>
                    <td className="p-4 text-xs">{r.seat}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${badge.className}`}>
                        {badge.icon} {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* View */}
                        <button
                          onClick={() => viewReservation(r.pnr)}
                          className="text-blue-500 hover:text-blue-700"
                          title="View">
                          <Eye size={14} />
                        </button>

                        {/* Confirm */}
                        {r.status === "Pending" && (
                          <button
                            onClick={() => confirmReservation(r.id)}
                            className="text-green-500 hover:text-green-700"
                            title="Confirm">
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {/* Cancel */}
                        {r.status !== "Cancelled" && (
                          <button
                            onClick={() => cancelReservation(r.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Cancel">
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationsManagement;
