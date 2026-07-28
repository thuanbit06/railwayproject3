// frontend/src/pages/SearchTrainPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrain } from "../context/TrainContext"; // ✅ đúng rồi
import Select from "../components/Select";
import Button from "../components/Button";

const SearchTrainPage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [cls, setCls] = useState("");
  const { stations, searchResults, setSearchResults } = useTrain(); // ✅
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = () => {
    setSearchResults([
      {
        trainNo: "12345",
        trainName: "Rajdhani Express",
        departureTime: "16:00",
        arrivalTime: "09:00",
        fare: 2030,
      },
    ]);
    navigate("/results");
  };

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-xl font-bold mb-4">Search Trains</h2>
      <Select
        label="From"
        options={stations.map((s) => ({ value: s.code, label: s.name }))}
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <Select
        label="To"
        options={stations.map((s) => ({ value: s.code, label: s.name }))}
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={today}
      />
      <Select
        label="Class"
        options={[
          { value: "AC1", label: "AC First" },
          { value: "AC3", label: "AC 3 Tier" },
          { value: "Sleeper", label: "Sleeper" },
        ]}
        value={cls}
        onChange={(e) => setCls(e.target.value)}
      />
      <Button onClick={handleSearch} className="w-full mt-4">
        Search
      </Button>
    </div>
  );
};

export default SearchTrainPage;
