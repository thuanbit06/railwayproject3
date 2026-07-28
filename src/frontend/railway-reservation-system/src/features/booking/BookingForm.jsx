// frontend/src/features/booking/BookingForm.jsx
import React, { useState } from "react";
import { useBooking } from "./useBooking";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";

const BookingForm = ({ train, journeyDate, fromStation, toStation }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "M",
    totalPassengers: 1,
  });
  const [step, setStep] = useState("form"); // form, confirm, success
  const [result, setResult] = useState(null);
  const { bookTicket, loading } = useBooking();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep("confirm");
  };

  const handleConfirm = async () => {
    const bookingData = {
      trainNo: train.trainNo,
      journeyDate,
      fromStation,
      toStation,
      coachClass: train.class || "AC3",
      passenger: form,
    };

    const response = await bookTicket(bookingData);
    if (response.success) {
      setResult(response.data);
      setStep("success");
    }
  };

  if (step === "success" && result) {
    return (
      <div className="text-center p-6">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
        <div className="text-left max-w-sm mx-auto space-y-2">
          <p>
            <strong>PNR:</strong> {result.pnr}
          </p>
          <p>
            <strong>Passenger:</strong> {result.booking.passenger_name}
          </p>
          <p>
            <strong>Seat:</strong> {result.booking.seat_no} /{" "}
            {result.booking.coach_no}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">{result.status}</span>
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/search")}
          className="mt-6">
          Book Another
        </Button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4">Confirm Booking</h3>
        <div className="space-y-3 mb-6">
          <p>
            <strong>Train:</strong> {train.trainName} (#{train.trainNo})
          </p>
          <p>
            <strong>Date:</strong> {journeyDate}
          </p>
          <p>
            <strong>Passenger:</strong> {form.name}, Age: {form.age}, Gender:{" "}
            {form.gender}
          </p>
          <p>
            <strong>Fare:</strong> ₹{train.fare}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setStep("form")}
            className="flex-1">
            Back
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            className="flex-1"
            disabled={loading}>
            {loading ? "Processing..." : "Confirm & Pay"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Passenger Details</h3>
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Age"
        type="number"
        name="age"
        value={form.age}
        onChange={handleChange}
        min="1"
        max="120"
        required
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md">
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
      </div>
      <Input
        label="Number of Passengers"
        type="number"
        name="totalPassengers"
        value={form.totalPassengers}
        onChange={handleChange}
        min="1"
        max="6"
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">
        Review & Proceed
      </Button>
    </form>
  );
};

export default BookingForm;
