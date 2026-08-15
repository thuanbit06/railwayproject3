import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { ArrowRight, User, Plus, Trash2 } from "lucide-react";

const BookTicket = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { setPassengers } = useBooking();

  const train = location.state?.train || {
    name: "Express 202",
    from: "New Delhi",
    to: "Mumbai",
    departure: "08:00",
    arrival: "20:00",
    fare: 1200,
  };

  const [passengers, setPassengersState] = useState([
    { id: 1, name: "Arjun Sharma", age: 28, gender: "Male" },
  ]);

  const addPassenger = () => {
    setPassengersState([
      ...passengers,
      { id: Date.now(), name: "", age: "", gender: "Male" },
    ]);
  };

  const removePassenger = (id) => {
    setPassengersState(passengers.filter((p) => p.id !== id));
  };

  const updatePassenger = (id, field, value) => {
    setPassengersState(
      passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleProceed = () => {
    if (passengers.some((p) => !p.name || !p.age)) {
      alert("Please fill all passenger details.");
      return;
    }

    setPassengers(passengers);
    nav("/payment", { state: { train, passengers } });
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Train Summary */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-lg mb-2">{train.name}</h2>
          <div className="text-sm text-gray-500 flex flex-wrap gap-4">
            <span>
              {train.from} → {train.to}
            </span>
            <span>
              {train.departure} - {train.arrival}
            </span>
            <span className="font-bold text-blue-600">${train.fare} / pax</span>
          </div>
        </div>

        {/* Passenger Form */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <User size={18} /> Passenger Details
          </h3>

          {passengers.map((p, index) => (
            <div key={p.id} className="mb-6 border-b pb-6 last:border-none">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Passenger #{index + 1}</span>
                {passengers.length > 1 && (
                  <button
                    onClick={() => removePassenger(p.id)}
                    className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  value={p.name}
                  onChange={(v) => updatePassenger(p.id, "name", v)}
                />
                <Input
                  label="Age"
                  type="number"
                  value={p.age}
                  onChange={(v) => updatePassenger(p.id, "age", v)}
                />
                <Select
                  label="Gender"
                  value={p.gender}
                  onChange={(v) => updatePassenger(p.id, "gender", v)}
                />
              </div>
            </div>
          ))}

          <button
            onClick={addPassenger}
            className="text-sm text-blue-600 font-semibold flex items-center gap-1">
            <Plus size={14} /> Add Passenger
          </button>
        </div>

        {/* Proceed */}
        <button
          onClick={handleProceed}
          className="w-full bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
          Proceed to Payment <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

/* =======================
    REUSABLE INPUTS
======================== */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 mb-1 block">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const Select = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 mb-1 block">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-[#f4f7ff] rounded-xl outline-none">
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
  </div>
);

export default BookTicket;
