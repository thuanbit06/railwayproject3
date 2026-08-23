import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Train,
  Search,
  Bell,
  History,
  ChevronDown,
  Download,
  Clock,
  MessageSquare,
  Home,
  Navigation,
  MapPin,
  Flag,
  Activity,
} from "lucide-react";
import { getScheduleStops } from "../../services/trainService"; // sửa path

const iconMap = { Home, Navigation, MapPin, Flag, Activity, Train };

const TrainScheduleDetail = () => {
  const { scheduleId } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  // Lấy thông tin train từ state (truyền từ trang trước)
  const trainInfo = location.state?.trainInfo || {};

  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStops = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getScheduleStops(scheduleId);

        // Map từ ScheduleStop entity → UI format
        const mappedStops = res.data.map((stop, index, arr) => ({
          icon: iconMap[getIconForSequence(index, arr.length)] || Train,
          name: stop.station?.stationName || `Station ${stop.stationId}`,
          code: stop.station?.code || "N/A",
          arr:
            stop.arrivalTime ?
              new Date(`1970-01-01T${stop.arrivalTime}`).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" },
              )
            : "--:--",
          dep:
            stop.departureTime ?
              new Date(`1970-01-01T${stop.departureTime}`).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" },
              )
            : "--:--",
          halt:
            stop.haltDuration ?
              `${Math.floor(new Date(`1970-01-01T${stop.haltDuration}`).getTime() / 60000)} min`
            : "--",
          dist: `${stop.distanceFromStart ?? 0} km`,
          state: getStopState(index, arr.length, stop.isCompleted),
        }));

        setStops(mappedStops);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedule stops.");
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) fetchStops();
  }, [scheduleId]);

  // Tính % progress
  const completedCount = stops.filter((s) => s.state === "completed").length;
  const progressPercent =
    stops.length > 0 ? Math.round((completedCount / stops.length) * 100) : 0;

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
          {[{ icon: Train, label: "Train Schedule", active: true }].map(
            (item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${item.active ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "text-gray-500 hover:bg-white/60"}`}>
                <item.icon size={18} /> {item.label}
              </button>
            ),
          )}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-[#f4f7ff] border-none rounded-full text-xs w-64 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-gray-400" />
            <History size={18} className="text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                AS
              </div>
              <span className="text-sm font-bold text-gray-700">
                Admin. Suresh
              </span>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TITLE */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <button
                onClick={() => nav(-1)}
                className="text-xs text-blue-600 font-bold mb-2 flex items-center gap-1 hover:underline">
                ← BACK
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {trainInfo.trainName || "Express"}{" "}
                {trainInfo.trainNumber || `#${scheduleId}`}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Schedule ID: <span className="font-bold">{scheduleId}</span> |
                Status:{" "}
                <span className="text-green-600 font-bold">On Time</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="border border-gray-200 text-xs font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-gray-600 bg-white">
                <Download size={14} /> Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ITINERARY TABLE */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-gray-50">
                <h3 className="font-bold text-gray-800 text-base">
                  Station Itinerary
                </h3>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>{" "}
                    Completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>{" "}
                    Upcoming
                  </span>
                </div>
              </div>

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
                  {loading ?
                    <tr>
                      <td colSpan="5" className="p-8 text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-xs text-gray-400 mt-2">
                          Loading stops...
                        </p>
                      </td>
                    </tr>
                  : error ?
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-red-500 text-sm">
                        {error}
                      </td>
                    </tr>
                  : stops.length === 0 ?
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-gray-400 text-sm">
                        No stops found.
                      </td>
                    </tr>
                  : stops.map((stop, i) => {
                      const Icon = stop.icon;
                      const isCurrent = stop.state === "current";
                      const isCompleted = stop.state === "completed";
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
                                  {stop.name}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  Code: {stop.code}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-gray-600">
                            {stop.arr}
                          </td>
                          <td className="p-4 text-xs text-gray-600">
                            {stop.dep}
                          </td>
                          <td className="p-4 text-xs text-gray-600">
                            {stop.halt}
                          </td>
                          <td className="p-4 text-xs text-gray-600">
                            {stop.dist}
                          </td>
                        </tr>
                      );
                    })
                  }
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
                    <div className="text-2xl font-bold">
                      {trainInfo.avgSpeed || 124}
                    </div>
                    <div className="text-[10px] text-blue-200">km/h Avg</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {stops[stops.length - 1]?.dist || "615"}
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

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Xác định icon dựa vào vị trí trong hành trình
function getIconForSequence(index, total) {
  if (index === 0) return "Home";
  if (index === total - 1) return "Flag";
  if (index === 1) return "Navigation";
  return "MapPin";
}

// Xác định trạng thái trạm (có thể lấy từ DB sau này)
function getStopState(index, total, isCompleted) {
  if (isCompleted) return "completed";
  if (index === total - 1) return "upcoming";
  return "current"; // trạm tiếp theo
}

export default TrainScheduleDetail;
