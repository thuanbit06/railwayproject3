import React, { useState } from "react";
import { getMockBookingByPNR } from "../data";
import Input from "../components/Input";
import Button from "../components/Button";

const QueryPage = () => {
  const [pnr, setPnr] = useState("");
  const [ticket, setTicket] = useState(null);

  const handleSearch = () => {
    const t = getMockBookingByPNR(pnr);
    setTicket(t);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card mb-4">
        <h2 className="text-xl font-bold mb-4">Query PNR</h2>
        <div className="flex gap-3">
          <Input
            placeholder="Enter PNR"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
      {ticket && (
        <div className="card">
          <p>
            <strong>PNR:</strong> {ticket.pnr}
          </p>
          <p>
            <strong>Passenger:</strong> {ticket.passenger_name}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">CONFIRMED</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default QueryPage;
