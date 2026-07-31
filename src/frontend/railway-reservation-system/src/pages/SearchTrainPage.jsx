import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { trainService } from "../services/trainService";
import Select from "../components/Select";
import Button from "../components/Button";

const SearchTrainPage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [cls, setCls] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { stations, setSearchResults, useMock } = useTrain();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = async () => {
    if (!from || !to || !date || !cls) {
      setError("Please fill all fields");
      return;
    }

    if (useMock) {
      // Keep existing mock behavior
      setSearchResults([
        {
          trainNo: "12345",
          trainName: "Rajdhani Express",
          departureTime: "16:00",
          arrivalTime: "09:00",
          fare: 2030,
          availableSeats: 45,
          isAvailable: true,
        },
      ]);
      navigate("/results");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await trainService.searchTrains({
        from,
        to,
        date,
        coachClass: cls,
      });

      if (response.results && response.results.length > 0) {
        setSearchResults(response.results);
        navigate("/results");
      } else {
        setError("No trains found for selected criteria");
      }
    } catch (err) {
      setError(err.message || "Failed to search trains");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-xl font-bold mb-4">Search Trains</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
      <Button onClick={handleSearch} className="w-full mt-4" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </Button>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useMock}
            onChange={(e) => setUseMock(e.target.checked)}
          />
          Use Mock Data (for testing without backend)
        </label>
      </div>
    </div>
  );
};

export default SearchTrainPage;
