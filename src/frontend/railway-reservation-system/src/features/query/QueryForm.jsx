// frontend/src/features/query/QueryForm.jsx
import React, { useState } from "react";
import { useQuery } from "./useQuery";
import Button from "../../components/Button";
import Input from "../../components/Input";

const QueryForm = () => {
  const [pnr, setPnr] = useState("");
  const { ticket, loading, error, searchByPNR } = useQuery();

  const handleSearch = async () => {
    if (!pnr.trim()) return;
    await searchByPNR(pnr);
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-bold text-lg mb-4">Query PNR Status</h3>
        <div className="flex gap-3">
          <Input
            placeholder="Enter PNR Number"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="flex-1"
          />
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {ticket && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">PNR Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">PNR Number</p>
              <p className="font-semibold">{ticket.pnr}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p
                className={`font-semibold ${
                  ticket.status === "CONFIRMED" ? "text-green-600"
                  : ticket.status === "CANCELLED" ? "text-red-600"
                  : "text-orange-600"
                }`}>
                {ticket.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Passenger</p>
              <p>
                {ticket.passenger_name}, Age: {ticket.age}, Gender:{" "}
                {ticket.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Train</p>
              <p>#{ticket.train_no}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Journey Date</p>
              <p>{ticket.date_of_travel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p>
                {ticket.from_station} → {ticket.to_station}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Seat / Coach</p>
              <p>
                {ticket.seat_no} / {ticket.coach_no}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fare</p>
              <p>₹{ticket.fare}</p>
            </div>
            {ticket.cancelled && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Cancelled On</p>
                  <p>{ticket.cancellation_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Refund Amount</p>
                  <p className="text-green-600">₹{ticket.refund_amount}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryForm;
