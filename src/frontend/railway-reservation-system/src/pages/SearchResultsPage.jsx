import React from "react";
import { useNavigate } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import Button from "../components/Button";

const SearchResultsPage = () => {
  const { searchResults } = useTrain();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      {searchResults.map((train) => (
        <div
          key={train.trainNo}
          className="card mb-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold">
              {train.trainName} (#{train.trainNo})
            </h3>
            <p className="text-sm text-gray-600">
              Dep: {train.departureTime} | Arr: {train.arrivalTime}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-700">₹{train.fare}</p>
            <Button size="sm" onClick={() => navigate("/booking")}>
              Book
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsPage;
