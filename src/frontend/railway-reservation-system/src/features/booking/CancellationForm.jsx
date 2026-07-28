// frontend/src/features/booking/CancellationForm.jsx
import React, { useState } from "react";
import { useBooking } from "./useBooking";
import Button from "../../components/Button";
import Input from "../../components/Input";

const CancellationForm = () => {
  const [pnr, setPnr] = useState("");
  const [ticket, setTicket] = useState(null);
  const [step, setStep] = useState("input");
  const [cancellationResult, setCancellationResult] = useState(null);
  const [error, setError] = useState("");
  const { cancelTicket, loading } = useBooking();

  const handleSearch = async () => {
    setError("");
    // Lấy ticket từ API
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings/pnr/${pnr}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("railway_token")}`,
          },
        },
      ).then((res) => res.json());

      if (!result.pnr) {
        setError(result.message || "PNR not found");
        return;
      }
      setTicket(result);
      setStep("confirm");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async () => {
    const response = await cancelTicket(pnr);
    if (response.success) {
      setCancellationResult(response.data);
      setStep("done");
    } else {
      setError(response.message);
    }
  };

  if (step === "done" && cancellationResult) {
    return (
      <div className="text-center p-6">
        <div className="text-red-600 text-5xl mb-4">✕</div>
        <h2 className="text-2xl font-bold mb-4">Ticket Cancelled</h2>
        <p className="text-green-600 font-semibold">
          Refund: ₹{cancellationResult.refundAmount}
        </p>
        <Button
          variant="primary"
          onClick={() => {
            setStep("input");
            setPnr("");
            setTicket(null);
          }}>
          Cancel Another
        </Button>
      </div>
    );
  }

  if (step === "confirm" && ticket) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4">Confirm Cancellation</h3>
        <div className="space-y-3 mb-6">
          <p>
            <strong>PNR:</strong> {ticket.pnr}
          </p>
          <p>
            <strong>Passenger:</strong> {ticket.passenger_name}
          </p>
          <p>
            <strong>Journey Date:</strong> {ticket.date_of_travel}
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setStep("input")}
            className="flex-1">
            Back
          </Button>
          <Button
            variant="danger"
            onClick={handleCancel}
            className="flex-1"
            disabled={loading}>
            {loading ? "Processing..." : "Confirm Cancellation"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Cancel Ticket</h3>
      <div className="flex gap-3">
        <Input
          placeholder="Enter PNR Number"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
          className="flex-1"
        />
        <Button variant="danger" onClick={handleSearch}>
          Check
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
};

export default CancellationForm;
