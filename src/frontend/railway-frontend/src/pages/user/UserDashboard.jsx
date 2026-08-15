import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Train,
  Calendar,
  MapPin,
  Search,
  Ticket,
  ClipboardCheck,
  CheckCircle2,
  Users,
  Bell,
  ChevronDown,
  Zap,
  ArrowRight,
  Shield,
  Route,
  Menu,
  X,
} from "lucide-react";

const UserDashboard = () => {
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // State cho form tìm kiếm nhanh
  const [search, setSearch] = useState({
    from: "New Delhi (NDLS)",
    to: "Mumbai Central (BCT)",
    date: "",
    cls: "Executive Class",
  });

  /* =======================
     DỮ LIỆU MẪU (MOCK DATA)
     Trong thực tế, dữ liệu này sẽ được fetch từ API
  ======================== */
  const upcoming = {
    trainNo: "12002",
    trainName: "Bhopal Shatabdi",
    from: "New Delhi (NDLS)",
    to: "Bhopal Jn (BPL)",
    depTime: "06:00",
    arrTime: "14:25",
    date: "Oct 24, 2024",
    duration: "8h 25m",
    coach: "C1",
    seat: "42",
    cls: "Exec. Class (EC)",
    status: "CONFIRMED",
    pnr: "#48291054",
  };

  const history = [
    {
      pnr: "#37820101",
      train: "Rajdhani Express (12431)",
      route: "Mumbai → Delhi",
      date: "Sep 12, 2024",
      status: "Completed",
    },
    {
      pnr: "#51209387",
      train: "Kerala Express (12626)",
      route: "Chennai → Trivandrum",
      date: "Aug 28, 2024",
      status: "Completed",
    },
  ];

  const quickServices = [
    {
      icon: Ticket,
      label: "Book Ticket",
      desc: "Find & book trains",
      color: "bg-blue-50 text-blue-600",
      action: () => nav("/book"),
    },
    {
      icon: ClipboardCheck,
      label: "My Tickets",
      desc: "View e-tickets",
      color: "bg-green-50 text-green-600",
      action: () => nav("/my-tickets"),
    },
    {
      icon: Search,
      label: "Check PNR",
      desc: "Track booking status",
      color: "bg-orange-50 text-orange-600",
      action: () => nav("/pnr"),
    },
    {
      icon: Users,
      label: "Seat Avail",
      desc: "Check availability",
      color: "bg-purple-50 text-purple-600",
      action: () => {},
    },
  ];

  const travelInfo = [
    {
      icon: Bell,
      title: "Platform Updates",
      desc: "Check recent changes",
      color: "text-blue-500",
    },
    {
      icon: Shield,
      title: "Safety Guidelines",
      desc: "Travel safe with us",
      color: "text-green-500",
    },
    {
      icon: Route,
      title: "New VB Routes",
      desc: "Explore Vande Bharat",
      color: "text-orange-500",
    },
  ];

  const stations = [
    "New Delhi (NDLS)",
    "Mumbai Central (BCT)",
    "Bhopal Jn (BPL)",
    "Chennai Egmore (MS)",
    "Trivandrum (TVC)",
    "Kolkata (HWH)",
  ];

  const navLinks = [
    { label: "Home", active: true },
    { label: "Book Ticket", active: false },
    { label: "My Tickets", active: false },
    { label: "Train Schedule", active: false },
    { label: "Support", active: false },
  ];

  const handleSearch = () => {
    // TODO: Implement API call or navigation to search results
    nav("/trains", { state: { searchParams: search } });
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] font-sans">
      {/* =======================
          HEADER (Premium)
      ======================== */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => nav("/")}
            className="flex items-center gap-2 cursor-pointer group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#003A8C] to-[#1677FF] rounded-xl flex items-center justify-center group-hover:scale-105 transition">
              <Train size={18} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-[#003A8C] text-lg leading-none">
                RailLink
              </p>
              <p className="text-[9px] font-bold text-[#FF7A00] tracking-wider leading-none mt-0.5">
                PREMIUM
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((l) => (
              <button
                key={l.label}
                className={`px-4 py-2 rounded-lg transition ${l.active ? "bg-blue-50 text-[#003A8C]" : "text-gray-600 hover:bg-gray-50"}`}>
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={18} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="hidden sm:flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#003A8C] to-[#1677FF] flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Arjun S.
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileOpen ?
                <X size={20} />
              : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <button
                key={l.label}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${l.active ? "bg-blue-50 text-[#003A8C]" : "text-gray-600 hover:bg-gray-50"}`}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* =======================
          HERO BANNER (No external image dependency)
      ======================== */}
      <section className="relative bg-gradient-to-r from-[#003A8C] via-[#0047B3] to-[#1677FF] overflow-hidden">
        {/* Decorative background elements instead of external image */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Welcome back, Arjun! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Ready for your next journey? Experience seamless booking with
              RailLink Premium.
            </p>
            <button
              onClick={() => nav("/book")}
              className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-200 transition group">
              <Zap
                size={18}
                className="text-yellow-300 group-hover:rotate-12 transition-transform"
              />
              Book Ticket Now
            </button>
          </div>
        </div>
      </section>

      {/* =======================
          QUICK SEARCH
      ======================== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 p-4 lg:p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            {[
              {
                label: "From",
                icon: MapPin,
                color: "text-blue-500",
                value: search.from,
                key: "from",
              },
              {
                label: "To",
                icon: MapPin,
                color: "text-orange-500",
                value: search.to,
                key: "to",
              },
              {
                label: "Date",
                icon: Calendar,
                color: "text-green-500",
                value: search.date,
                key: "date",
                type: "date",
              },
              {
                label: "Class",
                icon: Train,
                color: "text-purple-500",
                value: search.cls,
                key: "cls",
                type: "select",
              },
            ].map((f, i) => (
              <div key={i} className={f.key === "cls" ? "md:col-span-1" : ""}>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                  {f.label}
                </label>
                <div className="relative">
                  <f.icon
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${f.color}`}
                  />
                  {f.type === "date" ?
                    <input
                      type="date"
                      value={f.value}
                      onChange={(e) =>
                        setSearch({ ...search, [f.key]: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-[#f4f7ff] rounded-xl outline-none text-sm font-medium hover:bg-blue-50 transition"
                    />
                  : f.type === "select" ?
                    <select
                      value={f.value}
                      onChange={(e) =>
                        setSearch({ ...search, [f.key]: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-[#f4f7ff] rounded-xl outline-none text-sm font-medium appearance-none hover:bg-blue-50 transition">
                      <option>Executive Class</option>
                      <option>AC First (1A)</option>
                      <option>AC 2-Tier (2A)</option>
                      <option>AC 3-Tier (3A)</option>
                      <option>Sleeper (SL)</option>
                    </select>
                  : <select
                      value={f.value}
                      onChange={(e) =>
                        setSearch({ ...search, [f.key]: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-[#f4f7ff] rounded-xl outline-none text-sm font-medium appearance-none hover:bg-blue-50 transition">
                      {stations.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  }
                </div>
              </div>
            ))}
            <div>
              <button
                onClick={handleSearch}
                className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition group">
                <Search
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />{" "}
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =======================
          MAIN CONTENT
      ======================== */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Services */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Quick Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickServices.map((s, i) => (
                <button
                  key={i}
                  onClick={s.action}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group">
                  <div
                    className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <s.icon size={18} />
                  </div>
                  <p className="font-bold text-sm text-gray-800">{s.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Upcoming Journey */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                Upcoming Journey
              </h2>
              <button className="text-xs text-[#1677FF] font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="p-5">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> {upcoming.status}
                  </span>
                  <span className="text-xs text-gray-400">{upcoming.pnr}</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#003A8C] text-white p-2 rounded-xl">
                    <Train size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {upcoming.trainName}
                    </p>
                    <p className="text-xs text-gray-500">{upcoming.trainNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-center">
                    <p className="font-bold text-lg">{upcoming.depTime}</p>
                    <p className="text-[10px] text-gray-400">
                      {upcoming.from.split("(")[0]}
                    </p>
                  </div>
                  <div className="flex-1 relative px-2">
                    <div className="border-t-2 border-dashed border-blue-300" />
                    <p className="text-center text-[10px] text-gray-400 mt-1">
                      {upcoming.duration}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{upcoming.arrTime}</p>
                    <p className="text-[10px] text-gray-400">
                      {upcoming.to.split("(")[0]}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-bold">Coach/Seat:</span>{" "}
                    {upcoming.coach}|{upcoming.seat} ({upcoming.cls})
                  </p>
                  <button className="bg-[#003A8C] hover:bg-[#1677FF] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition">
                    E-Ticket <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* History */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                Recent History
              </h2>
              <button className="text-xs text-[#1677FF] font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {history.map((h, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between">
                    <p className="text-xs font-bold text-[#1677FF]">{h.pnr}</p>
                    <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {h.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {h.train}
                  </p>
                  <p className="text-xs text-gray-400">
                    {h.route} • {h.date}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Travel Info */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Travel Info
            </h2>
            <div className="space-y-3">
              {travelInfo.map((t, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-left group">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center group-hover:scale-110 transition">
                    <t.icon size={16} className={t.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="text-[10px] text-gray-400">{t.desc}</p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-gray-500"
                  />
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* =======================
          FOOTER
      ======================== */}
      <footer className="bg-[#e8edf3] border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#003A8C] rounded-lg flex items-center justify-center">
              <Train size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-700">
              RailLink Premium
            </span>
          </div>
          <p className="text-[10px] text-gray-400">
            © 2024 RailLink Premium Management Systems. All rights reserved.
          </p>
          <div className="flex gap-4 text-[10px] text-gray-400 font-medium">
            <a href="#" className="hover:text-[#1677FF]">
              About
            </a>
            <a href="#" className="hover:text-[#1677FF]">
              Contact
            </a>
            <a href="#" className="hover:text-[#1677FF]">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
