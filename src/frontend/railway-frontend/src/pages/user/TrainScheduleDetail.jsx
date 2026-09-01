import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Train,
  Download,
  Clock,
  MapPin,
  Flag,
  Navigation,
  Home,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { getScheduleStops } from "../../services/trainService";

const iconMap = {
  Home,
  Navigation,
  MapPin,
  Flag,
  Activity,
  Train,
};

const TrainScheduleDetail = () => {
  const { scheduleId } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  // Giữ nguyên
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

        const mappedStops = res.data.map((stop, index, arr) => ({
          icon: iconMap[getIconForSequence(index, arr.length)] || Train,

          name:
            stop.station?.stationName ||
            stop.station?.name ||
            `Station ${stop.stationId}`,

          code: stop.station?.code || "N/A",

          arr:
            stop.arrivalTime ?
              new Date(`1970-01-01T${stop.arrivalTime}`).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )
            : "--:--",

          dep:
            stop.departureTime ?
              new Date(`1970-01-01T${stop.departureTime}`).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )
            : "--:--",

          halt:
            stop.haltDuration ?
              `${Math.floor(
                new Date(`1970-01-01T${stop.haltDuration}`).getTime() / 60000,
              )} min`
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

  const completedCount = stops.filter((s) => s.state === "completed").length;

  const progressPercent =
    stops.length > 0 ? Math.round((completedCount / stops.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f6f8fc] font-sans text-gray-800">
      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-6 lg:py-8">
        {/* =====================================================
            TOP ACTION
        ===================================================== */}
        <div className="flex items-center justify-between mb-7">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 transition">
            <ArrowLeft size={16} />
            Back to Schedule
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-blue-200 hover:text-blue-600 transition shadow-sm">
            <Download size={15} />
            Export PDF
          </button>
        </div>

        {/* =====================================================
            PAGE TITLE
        ===================================================== */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Train size={23} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {trainInfo.trainName || "Express"}
                  </h1>

                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold">
                    On Time
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-xs text-gray-500">
                  <span>
                    Train No.{" "}
                    <strong className="text-gray-700">
                      {trainInfo.trainNumber || "N/A"}
                    </strong>
                  </span>

                  <span className="hidden sm:inline text-gray-300">|</span>

                  <span>
                    Schedule ID{" "}
                    <strong className="text-gray-700">#{scheduleId}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TRIP SUMMARY
        ===================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* DEPARTURE */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400 mb-3">
              <Home size={14} className="text-blue-500" />
              Departure
            </div>

            <div className="text-lg font-bold text-gray-800">
              {stops[0]?.name || "N/A"}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {stops[0]?.code || "N/A"}
            </div>

            <div className="flex items-center gap-2 mt-4 text-blue-600">
              <Clock size={15} />

              <span className="text-sm font-bold">
                {trainInfo.departureTime || stops[0]?.dep || "--:--"}
              </span>
            </div>
          </div>

          {/* JOURNEY */}
          <div className="bg-blue-600 rounded-2xl p-5 shadow-sm text-white">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-blue-200 mb-3">
              <Activity size={14} />
              Journey
            </div>

            <div className="text-lg font-bold">
              {stops.length > 0 ? `${stops.length} Stations` : "N/A"}
            </div>

            <div className="text-xs text-blue-200 mt-1">
              {trainInfo.journeyDate || "Scheduled journey"}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Clock size={15} />

              <span className="text-sm font-bold">
                {trainInfo.departureTime || stops[0]?.dep || "--:--"}
              </span>

              <span className="text-blue-300">→</span>

              <span className="text-sm font-bold">
                {trainInfo.arrivalTime ||
                  stops[stops.length - 1]?.arr ||
                  "--:--"}
              </span>
            </div>
          </div>

          {/* DESTINATION */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400 mb-3">
              <Flag size={14} className="text-orange-500" />
              Destination
            </div>

            <div className="text-lg font-bold text-gray-800">
              {stops[stops.length - 1]?.name || "N/A"}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {stops[stops.length - 1]?.code || "N/A"}
            </div>

            <div className="flex items-center gap-2 mt-4 text-orange-500">
              <Clock size={15} />

              <span className="text-sm font-bold">
                {trainInfo.arrivalTime ||
                  stops[stops.length - 1]?.arr ||
                  "--:--"}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===================================================
              STATION ITINERARY
          =================================================== */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-800">Station Itinerary</h2>

                <p className="text-[11px] text-gray-400 mt-1">
                  Complete route and station information
                </p>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Completed
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Current
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  Upcoming
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead className="bg-[#f8faff]">
                  <tr className="text-[10px] uppercase text-gray-400 font-bold">
                    <th className="px-5 py-3.5">Station</th>

                    <th className="px-4 py-3.5">Arrival</th>

                    <th className="px-4 py-3.5">Departure</th>

                    <th className="px-4 py-3.5">Halt</th>

                    <th className="px-4 py-3.5">Distance</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ?
                    <tr>
                      <td colSpan="5" className="p-12 text-center">
                        <div className="animate-spin w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />

                        <p className="text-xs text-gray-400 mt-3">
                          Loading stations...
                        </p>
                      </td>
                    </tr>
                  : error ?
                    <tr>
                      <td colSpan="5" className="p-12 text-center">
                        <div className="text-sm font-semibold text-red-500">
                          {error}
                        </div>

                        <button
                          onClick={() => window.location.reload()}
                          className="mt-3 text-xs text-blue-600 font-semibold hover:underline">
                          Try again
                        </button>
                      </td>
                    </tr>
                  : stops.length === 0 ?
                    <tr>
                      <td colSpan="5" className="p-12 text-center">
                        <Train size={30} className="mx-auto text-gray-300" />

                        <p className="text-sm text-gray-400 mt-3">
                          No stops found.
                        </p>
                      </td>
                    </tr>
                  : stops.map((stop, i) => {
                      const Icon = stop.icon;

                      const isCurrent = stop.state === "current";

                      const isCompleted = stop.state === "completed";

                      const isLast = i === stops.length - 1;

                      return (
                        <tr
                          key={i}
                          className={`transition ${
                            isCurrent ? "bg-blue-50/50" : "hover:bg-gray-50"
                          }`}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                    isCompleted ? "bg-blue-100 text-blue-600"
                                    : isCurrent ?
                                      "bg-orange-100 text-orange-600"
                                    : "bg-gray-100 text-gray-400"
                                  }`}>
                                  <Icon size={15} />
                                </div>

                                {!isLast && (
                                  <div className="absolute top-9 left-1/2 -translate-x-1/2 w-px h-5 bg-gray-200" />
                                )}
                              </div>

                              <div>
                                <div
                                  className={`text-xs font-bold ${
                                    isCurrent ? "text-blue-700" : (
                                      "text-gray-700"
                                    )
                                  }`}>
                                  {stop.name}
                                </div>

                                <div className="text-[10px] text-gray-400 mt-0.5">
                                  Code: {stop.code}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs text-gray-600">
                            {stop.arr}
                          </td>

                          <td className="px-4 py-4 text-xs font-medium text-gray-700">
                            {stop.dep}
                          </td>

                          <td className="px-4 py-4 text-xs text-gray-500">
                            {stop.halt}
                          </td>

                          <td className="px-4 py-4 text-xs text-gray-500">
                            {stop.dist}
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================================
              RIGHT PANEL
          =================================================== */}
          <div className="space-y-6">
            {/* PROGRESS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Trip Progress
                  </h3>

                  <p className="text-[10px] text-gray-400 mt-1">
                    Current journey status
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Navigation size={17} />
                </div>
              </div>

              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-400">
                  Completed stations
                </span>

                <span className="text-sm text-blue-600 font-bold">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-3 text-[10px] text-gray-400">
                <span>{completedCount} completed</span>

                <span>
                  {Math.max(stops.length - completedCount, 0)} remaining
                </span>
              </div>
            </div>

            {/* PERFORMANCE */}
            <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-blue-200">
                    Performance
                  </h3>

                  <p className="text-xs text-white/80 mt-1">
                    Journey statistics
                  </p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Activity size={17} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">
                    {trainInfo.avgSpeed || 124}
                  </div>

                  <div className="text-[10px] text-blue-200 mt-1">
                    km/h Avg Speed
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {stops.length > 0 ? stops[stops.length - 1]?.dist : "0 km"}
                  </div>

                  <div className="text-[10px] text-blue-200 mt-1">
                    Total Distance
                  </div>
                </div>
              </div>
            </div>

            {/* SCHEDULE INFORMATION */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-4">
                Schedule Information
              </h3>

              <div className="space-y-3">
                <InfoRow label="Schedule ID" value={`#${scheduleId}`} />

                <div className="h-px bg-gray-100" />

                <InfoRow label="Train" value={trainInfo.trainName || "N/A"} />

                <div className="h-px bg-gray-100" />

                <InfoRow
                  label="Train Number"
                  value={trainInfo.trainNumber || "N/A"}
                />

                <div className="h-px bg-gray-100" />

                <InfoRow label="Stations" value={stops.length} />

                <div className="h-px bg-gray-100" />

                <div className="flex justify-between items-center gap-4">
                  <span className="text-xs text-gray-400">Status</span>

                  <span className="px-2 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-bold">
                    On Time
                  </span>
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
// INFO ROW
// ============================================================

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-xs text-gray-400">{label}</span>

      <span className="text-xs font-semibold text-gray-700 text-right">
        {value}
      </span>
    </div>
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getIconForSequence(index, total) {
  if (index === 0) return "Home";
  if (index === total - 1) return "Flag";
  if (index === 1) return "Navigation";
  return "MapPin";
}

function getStopState(index, total, isCompleted) {
  if (isCompleted) return "completed";
  if (index === total - 1) return "upcoming";
  return "current";
}

export default TrainScheduleDetail;
