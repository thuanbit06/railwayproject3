import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

const CancellationPage = () => {
  const [pnr, setPnr] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-xl font-bold mb-4">Cancel Ticket</h2>
      {done ?
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">✕</div>
          <p>Ticket cancelled. Refund: ₹1928</p>
        </div>
      : <>
          <Input
            placeholder="Enter PNR"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
          />
          <Button
            variant="danger"
            onClick={() => setDone(true)}
            className="w-full mt-4">
            Cancel
          </Button>
        </>
      }
    </div>
  );
};

export default CancellationPage;
