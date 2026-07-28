import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

const BookingPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [step, setStep] = useState("form");

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto card text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-xl font-bold mb-4">Booking Confirmed!</h2>
        <p>PNR: PNR12345678</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-bold mb-4">Passenger Details</h2>
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <Button onClick={() => setStep("success")} className="w-full mt-4">
        Pay & Confirm
      </Button>
    </div>
  );
};

export default BookingPage;
