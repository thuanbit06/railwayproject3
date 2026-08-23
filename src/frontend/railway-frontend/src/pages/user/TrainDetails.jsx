import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Train,
  ChevronDown,
  Download,
  Clock,
  Home,
  Navigation,
  MapPin,
  Flag,
  Activity,
} from "lucide-react";
import { getScheduleDetail } from "../../services/trainService";

const iconMap = { Home, Navigation, MapPin, Flag, Activity, Train };

const TrainScheduleDetail = () => {
  const { scheduleId } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getScheduleDetail(scheduleId);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedule detail.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [scheduleId]);

  // Tính % progress
  const progressPercent =
    data?.stops?.length > 0 ?
      Math.round(
        (data.stops.filter((s) => s.status === "completed").length /
          data.stops.length) *
          100,
      )
    : 0;

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!data) return null;

  return (
    <div className="flex h-screen bg-[#f4f7ff] font-sans text-gray-800 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-60 bg-[#eef2ff] flex flex-col border-r border-blue-100">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Train size={20} />
          </div>
          <div>
            <div className="font-bold text-blue-700 leading-tight">
              RailAdmin
            </div>
            <div className="text-[10px] text-gray-500 font-medium">
              Management Portal
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-orange-500 text-white">
            <Train size={18} /> Train Schedule
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            Schedule #{data.scheduleId}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
              AS
            </div>
            <span className="text-sm font-bold">Admin. Suresh</span>
            <ChevronDown size={14} />
          </div>
        </header>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TITLE */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <button
                onClick={() => nav(-1)}
                className="text-xs text-blue-600 font-bold mb-2 hover:underline">
                ← BACK
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {data.trainName} #{data.trainNumber}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Operating Days:{" "}
                <span className="font-bold">{data.operatingDays || "N/A"}</span>{" "}
                | Status:{" "}
                <span className="text-green-600 font-bold">{data.status}</span>
              </p>
            </div>
            <button className="border border-gray-200 text-xs font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-gray-600 bg-white">
              <Download size={14} /> Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ITINERARY TABLE */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f4f7ff] text-[10px] uppercase text-gray-500 font-bold">
                  <tr>
                    <th className="p-4">Station</th>
                    <th className="p-4">Arrival</th>
                    <th className="p-4">Departure</th>
                    <th className="p-4">Halt</th>
                    <th className="p-4">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.stops.map((stop, i) => {
                    const Icon = iconMap[stop.iconName] || Train;
                    const isCurrent = stop.status === "current";
                    const isCompleted = stop.status === "completed";
                    return (
                      <tr
                        key={i}
                        className={
                          isCurrent ? "bg-[#f4f7ff]" : "hover:bg-gray-50"
                        }>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                isCompleted ? "bg-blue-100 text-blue-600"
                                : isCurrent ? "bg-orange-100 text-orange-600"
                                : "bg-gray-100 text-gray-400"
                              }`}>
                              <Icon size={14} />
                            </div>
                            <div>
                              <div
                                className={`text-xs font-bold ${isCurrent ? "text-blue-700" : "text-gray-700"}`}>
                                {stop.stationName}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Code: {stop.stationCode}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-xs">
                          {stop.arrivalTime || "--:--"}
                        </td>
                        <td className="p-4 text-xs">
                          {stop.departureTime || "--:--"}
                        </td>
                        <td className="p-4 text-xs">{stop.haltDuration}</td>
                        <td className="p-4 text-xs">{stop.distance} km</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* RIGHT PANEL */}
            <div className="space-y-6">
              {/* PROGRESS */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 text-sm mb-3">
                  Trip Progress
                </h3>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-blue-600 font-bold">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              {/* PERFORMANCE */}
              <div className="bg-blue-600 rounded-2xl p-5 text-white">
                <h3 className="text-xs font-bold uppercase text-blue-200 mb-3">
                  Performance
                </h3>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">{data.avgSpeed}</div>
                    <div className="text-[10px] text-blue-200">km/h Avg</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {data.totalDistance}
                    </div>
                    <div className="text-[10px] text-blue-200">Total km</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainScheduleDetail;
