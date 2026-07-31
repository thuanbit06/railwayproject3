import React from "react";
import { useNavigate } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import Button from "../components/Button";

const SearchResultsPage = () => {
  const { searchResults } = useTrain();
  const navigate = useNavigate();

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="max-w-4xl mx-auto card text-center">
        <p>No trains found. Try different search criteria.</p>
        <Button onClick={() => navigate("/search")} className="mt-4">
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      {searchResults.map((train) => (
        <div
          key={train.trainNo}
          className="card mb-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold">
              {train.trainName} (#{train.trainNo})
            </h3>
            <p className="text-sm text-gray-600">
              Dep: {train.departureTime} | Arr: {train.arrivalTime} | Dist:{" "}
              {train.distance} km
            </p>
            {train.availableSeats !== undefined && (
              <p
                className={`text-sm ${train.isAvailable ? "text-green-600" : "text-red-600"}`}>
                Available: {train.availableSeats} seats
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-700">₹{train.fare}</p>
            <Button
              size="sm"
              onClick={() => navigate("/booking")}
              disabled={train.isAvailable === false}>
              {train.isAvailable === false ? "Full" : "Book"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsPage;
