import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Train, Clock, MapPin, ArrowRight, DollarSign } from "lucide-react";

const TrainDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();

  // Mock data (sau này thay bằng API)
  const train = {
    id: id,
    name: "Bhopal Shatabdi",
    number: "12002",
    from: "New Delhi (NDLS)",
    to: "Bhopal Jn (BPL)",
    departure: "06:00",
    arrival: "14:25",
    duration: "8h 25m",
    distance: "702 km",
    classes: [
      { type: "Executive Class", price: 1850, available: 12 },
      { type: "AC Chair Car", price: 950, available: 45 },
      { type: "Sleeper", price: 450, available: 120 },
    ],
    amenities: ["WiFi", "Charging Point", "Pantry", "Bio-Toilet"],
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => nav(-1)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4">
          ← Back to results
        </button>

        {/* Train Header */}
        <div className="bg-white rounded-3xl shadow-sm border p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#003A8C] to-[#1677FF] rounded-xl flex items-center justify-center">
              <Train size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{train.name}</h1>
              <p className="text-sm text-gray-400">Train No. {train.number}</p>
            </div>
          </div>

          {/* Route Timeline */}
          <div className="flex items-center gap-4 my-6">
            <div className="text-center">
              <p className="text-2xl font-black text-gray-800">
                {train.departure}
              </p>
              <p className="text-xs text-gray-400">{train.from}</p>
            </div>
            <div className="flex-1 relative">
              <div className="border-t-2 border-dashed border-blue-300" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full" />
              <p className="text-center text-xs text-gray-400 mt-1">
                {train.duration} • {train.distance}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-800">
                {train.arrival}
              </p>
              <p className="text-xs text-gray-400">{train.to}</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {train.amenities.map((a) => (
              <span
                key={a}
                className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Class Selection */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Select Class</h2>
        <div className="space-y-3">
          {train.classes.map((cls, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between items-center hover:shadow-md transition">
              <div>
                <p className="font-bold text-gray-800">{cls.type}</p>
                <p className="text-xs text-gray-400">
                  {cls.available} seats available
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-lg text-[#003A8C]">${cls.price}</p>
                <button
                  onClick={() => nav(`/book/${train.id}`)}
                  className="bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition">
                  Book <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainDetails;
