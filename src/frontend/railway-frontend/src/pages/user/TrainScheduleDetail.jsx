import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Train,
  Ticket,
  BarChart,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  History,
  ChevronDown,
  Download,
  Map,
  Clock,
  MessageSquare,
  Home,
  Navigation,
  MapPin,
  Flag,
  Activity,
} from "lucide-react";

const TrainScheduleDetail = () => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - Thay thế bằng API call trong thực tế
  const mockStops = [
    {
      icon: Home,
      name: "Central Terminal",
      code: "CTN",
      arr: "--:--",
      dep: "06:00 AM",
      halt: "--",
      dist: "0 km",
      state: "completed",
    },
    {
      icon: Navigation,
      name: "Riverside Junction",
      code: "RSJ",
      arr: "07:45 AM",
      dep: "07:55 AM",
      halt: "10 min",
      dist: "124 km",
      state: "completed",
    },
    {
      icon: MapPin,
      name: "Oakwood Valley",
      code: "OV",
      arr: "09:12 AM",
      dep: "09:17 AM",
      halt: "5 min",
      dist: "218 km",
      state: "current",
    },
    {
      icon: Activity,
      name: "Iron Ridge",
      code: "IRG",
      arr: "11:30 AM",
      dep: "11:45 AM",
      halt: "15 min",
      dist: "402 km",
      state: "upcoming",
    },
    {
      icon: Flag,
      name: "Harbor Heights",
      code: "HBH",
      arr: "03:45 PM",
      dep: "--:--",
      halt: "--",
      dist: "615 km",
      state: "upcoming",
    },
  ];

  const crew = [
    { name: "Mark J. Harrison", role: "Lead Engineer", initials: "MH" },
    { name: "Elena S. Varga", role: "Head of Service", initials: "EV" },
  ];

  // Giả lập việc tải dữ liệu từ API
  useEffect(() => {
    const timer = setTimeout(() => {
      setStops(mockStops);
      setLoading(false);
    }, 500); // Giả lập độ trễ mạng 0.5s
    return () => clearTimeout(timer);
  }, []);

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
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: Train, label: "Train Schedule", active: true },
            { icon: Ticket, label: "Reservations" },
            { icon: BarChart, label: "Analytics" },
            { icon: Settings, label: "Settings" },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.active ?
                  "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "text-gray-500 hover:bg-white/60 hover:text-gray-800"
              }`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-100">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-blue-200 shadow-sm transition-transform hover:scale-[1.02]">
            <span className="text-lg leading-none">+</span> New Reservation
          </button>
        </div>

        <div className="p-3 space-y-1 border-t border-blue-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/60">
            <HelpCircle size={18} /> Support
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative flex items-center">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search trains, stations..."
                className="pl-9 pr-4 py-2 bg-[#f4f7ff] border-none rounded-full text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium text-gray-500">
              <button className="hover:text-gray-800">Schedules</button>
              <button className="text-blue-600 border-b-2 border-blue-600 pb-1">
                Status
              </button>
              <button className="hover:text-gray-800">Routes</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Bell size={18} />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <History size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            {/* Thay thế ảnh bằng chữ cái đầu để tránh lỗi load ảnh */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-gray-200">
                AS
              </div>
              <span className="text-sm font-bold text-gray-700">
                Admin. Suresh
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TITLE BAR */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <button className="text-xs text-blue-600 font-bold mb-2 flex items-center gap-1 hover:underline">
                <span>←</span> BACK TO LIVE STATUS
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Express 1042 - North Coast Liner
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Operating Days:{" "}
                <span className="font-bold text-gray-700">
                  Mon, Wed, Fri, Sat
                </span>{" "}
                | Current Status:{" "}
                <span className="text-green-600 font-bold">On Time</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="border border-gray-200 text-xs font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-50 bg-white">
                <Download size={14} /> Export PDF
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-orange-200 shadow-sm">
                <Clock size={14} /> Modify Schedule
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
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
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
                <thead className="bg-[#f4f7ff] text-[10px] uppercase tracking-wider text-gray-500 font-bold">
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
                      <td colSpan="5" className="p-4 text-center text-gray-400">
                        Loading schedule...
                      </td>
                    </tr>
                  : stops.map((stop, i) => {
                      const Icon = stop.icon;
                      const isCurrent = stop.state === "current";
                      const isCompleted = stop.state === "completed";
                      return (
                        <tr
                          key={i}
                          className={`${isCurrent ? "bg-[#f4f7ff]" : "hover:bg-gray-50/50"}`}>
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
                                {isCurrent && (
                                  <div className="text-[9px] text-orange-600 font-bold mt-0.5">
                                    EXPECTED ARRIVAL SOON
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-gray-600 font-medium">
                            {stop.arr}
                          </td>
                          <td className="p-4 text-xs text-gray-600 font-medium">
                            {stop.dep}
                          </td>
                          <td className="p-4 text-xs text-gray-600 font-medium">
                            {stop.halt}
                          </td>
                          <td className="p-4 text-xs text-gray-600 font-medium">
                            {stop.dist}
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* LIVE ROUTE (MAP PLACEHOLDER) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-sm">
                    Live Route
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Map size={16} />
                  </button>
                </div>
                {/* Placeholder cho bản đồ - Sử dụng gradient thay vì ảnh Unsplash để tránh lỗi */}
                <div className="rounded-lg overflow-hidden border border-gray-100 relative h-32 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    Interactive Map View
                  </span>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] font-bold px-2 py-1 rounded">
                    REAL-TIME GPS: ACTIVE
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
                    <span>TRIP PROGRESS</span>
                    <span className="text-blue-600 font-bold">
                      35% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: "35%" }}></div>
                  </div>
                </div>
              </div>

              {/* PERFORMANCE */}
              <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-blue-200">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
                  <Activity size={16} /> Current Performance
                </div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <div className="text-3xl font-bold leading-none">124</div>
                    <div className="text-[10px] text-blue-200 mt-1">
                      km/h Avg. Speed
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold leading-none">615</div>
                    <div className="text-[10px] text-blue-200 mt-1">
                      km Total Trip
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs pt-3 border-t border-blue-500">
                  <span className="text-blue-100">Arrival Reliability</span>
                  <span className="font-bold">98.4%</span>
                </div>
              </div>

              {/* CREW */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 text-sm mb-4">
                  Active Crew
                </h3>
                <div className="space-y-4">
                  {crew.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {/* Placeholder ảnh đại diện bằng chữ cái đầu */}
                      <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm border border-gray-300">
                        {c.initials}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-800">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {c.role}
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg flex items-center justify-center shadow-orange-200 shadow-sm">
                  <span className="text-lg leading-none">↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-[#eef2ff] border-t border-blue-100 p-3 text-[10px] text-gray-500 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>{" "}
              System Online
            </span>
            <span>Node: US-EAST-1</span>
            <span>Last Updated: 09:10:42 AM</span>
          </div>
          <div className="flex gap-4 font-medium">
            <a href="#" className="hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600">
              API Access
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TrainScheduleDetail;
