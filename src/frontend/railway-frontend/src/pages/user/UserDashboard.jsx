import React, { useState, useEffect } from "react";
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
import logo from "../../assets/Railway.png";
import { searchTrains, getAllTrains } from "../../services/trainService";

const UserDashboard = () => {
  const [trains, setTrains] = useState([]);
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // State Search Form
  const [search, setSearch] = useState({
    from: "",
    to: "",
    date: "",
    cls: "1AC - First Class",
    passengers: 1,
  });

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search.from || !search.to || !search.date) {
      alert("Please enter origin, destination and departure date.");
      return;
    }

    try {
      const response = await searchTrains({
        from: search.from,
        to: search.to,
        date: search.date,
        cls: search.cls,
        passengers: search.passengers,
      });

      console.log("API Response:", response.data);

      nav("/trains", {
        state: {
          searchParams: search,
          trains: response.data,
        },
      });
    } catch (error) {
      console.error("Search trains failed:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }

      alert("Cannot search trains. Please try again.");
    }
  };

  useEffect(() => {
    const loadTrains = async () => {
      try {
        const response = await getAllTrains();

        console.log(response.data);
        setTrains(response.data);
      } catch (error) {
        console.error("Failed to load trains:", error);
      }
    };

    loadTrains();
  }, []);

  const navLinks = [
    { label: "Home", active: true, path: "/" },
    { label: "Book Ticket", active: false, path: "/book-ticket" },
    { label: "My Bookings", active: false, path: "/my-tickets" },
    { label: "Train Schedule", active: false, path: "/schedule" },
    { label: "PNR Status", active: false, path: "/pnr" },
    { label: "Support", active: false, path: "/support" },
  ];

  const railwayServices = [
    { label: "Booking", desc: "Instant seat reservation", icon: Ticket },
    { label: "Cancellation", desc: "Easy refund process", icon: X },
    { label: "PNR Status", desc: "Track your journey", icon: ClipboardCheck },
    { label: "Schedule", desc: "Real-time updates", icon: Calendar },
    { label: "Availability", desc: "Check seat quota", icon: Users },
    { label: "Fare Calc", desc: "Quick price quotes", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* =====================================================
          HEADER NAVBAR
      ====================================================== */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => nav("/")}
            className="flex items-center gap-2 cursor-pointer group py-2">
            <img
              src={logo}
              alt="Railways ERP Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => nav(link.path)}
                className={`transition-colors py-1 ${
                  link.active ?
                    "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "hover:text-blue-600"
                }`}>
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-full transition">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                A
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-700">
                Admin User
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              {mobileOpen ?
                <X size={20} />
              : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  nav(link.path);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  link.active ?
                    "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
                }`}>
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* =====================================================
          HERO BANNER & EMBEDDED SEARCH BOX
      ====================================================== */}
      <div className="relative">
        {/* Background Visual Banner */}
        <div className="relative h-[420px] md:h-[460px] w-full bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1920&q=80"
            alt="High Speed Train"
            className="w-full h-full object-cover opacity-60 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white max-w-xl leading-tight drop-shadow-md">
              Book Your Train Journey Easily
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-200 max-w-lg leading-relaxed drop-shadow">
              Experience seamless travel across the nation with high-speed
              connectivity and world-class services.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => nav("/book")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-md shadow-md transition">
                Book Now
              </button>
              <button
                onClick={() => nav("/schedule")}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs px-5 py-2.5 rounded-md border border-white/30 transition">
                View Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            {/* From */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                From Station
              </label>
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Enter Origin"
                  value={search.from}
                  onChange={(e) =>
                    setSearch({ ...search, from: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* To */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                To Station
              </label>
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Enter Destination"
                  value={search.to}
                  onChange={(e) => setSearch({ ...search, to: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Departure Date
              </label>
              <div className="relative">
                <Calendar
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={search.date}
                  onChange={(e) =>
                    setSearch({ ...search, date: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Class */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Class
              </label>
              <select
                value={search.cls}
                onChange={(e) => setSearch({ ...search, cls: e.target.value })}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition">
                <option>1AC - First Class</option>
                <option>2AC - 2 Tier AC</option>
                <option>3AC - 3 Tier AC</option>
                <option>SL - Sleeper</option>
              </select>
            </div>

            {/* Passengers */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Passengers
              </label>
              <div className="relative">
                <Users
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={search.passengers}
                  onChange={(e) =>
                    setSearch({ ...search, passengers: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#8c3b17] hover:bg-[#722f12] text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition">
                <Search size={15} /> Search Trains
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* =====================================================
          RAILWAY SERVICES
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Railway Services
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive solutions for every traveler's needs.
            </p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All Services <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {railwayServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition text-center cursor-pointer group">
                <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Icon size={18} />
                </div>
                <h3 className="text-xs font-bold text-slate-800">
                  {service.label}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          POPULAR ROUTES
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h2 className="text-base font-bold text-slate-800">Popular Routes</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Large Card */}
          <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
              alt="New Delhi to Mumbai"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
              <span className="bg-[#b34015] text-white text-[9px] font-bold px-2 py-0.5 rounded w-max mb-2">
                MOST POPULAR
              </span>
              <h3 className="text-lg font-bold text-white">
                New Delhi â‡„ Mumbai
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Fastest: 12h 30m â€¢ Daily Trains: 15
              </p>
              <button
                onClick={() => nav("/book")}
                className="mt-3 bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-lg w-max hover:bg-slate-100 transition">
                Book Now â‚¹1,450
              </button>
            </div>
          </div>

          {/* Right Sub-Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sub Card 1 - Span 2 cols on tablet */}
            <div className="sm:col-span-2 relative h-44 rounded-2xl overflow-hidden shadow-sm group">
              <img
                src="https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=800&q=80"
                alt="Chennai to Bangalore"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <h4 className="text-sm font-bold text-white">
                  Chennai â‡„ Bangalore
                </h4>
                <p className="text-[11px] text-slate-300">
                  Fastest: 4h 15m â€¢ 18 Daily Departures
                </p>
              </div>
            </div>

            {/* Sub Card 2 */}
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm group">
              <img
                src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80"
                alt="Kolkata to Patna"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <h4 className="text-xs font-bold text-white">
                  Kolkata â‡„ Patna
                </h4>
                <p className="text-[10px] text-slate-300">
                  Express Service Daily
                </p>
              </div>
            </div>

            {/* Sub Card 3 */}
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm group">
              <img
                src="https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=600&q=80"
                alt="Jaipur to Jodhpur"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <h4 className="text-xs font-bold text-white">
                  Jaipur â‡„ Jodhpur
                </h4>
                <p className="text-[10px] text-slate-300">
                  Luxury Trains â€¢ 4h 45m
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED HIGH-SPEED TRAINS
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-base font-bold text-slate-800 mb-6">
          Featured High-Speed Trains
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80"
              alt="Train"
              className="w-full sm:w-36 h-28 object-cover rounded-xl"
            />
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    TRAIN #12002
                  </span>
                  <h3 className="text-xs font-bold text-slate-800">
                    Bhopal Shatabdi Express
                  </h3>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded">
                  ON TIME
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 text-center">
                <div>
                  <p className="text-xs font-bold text-slate-800">06:00 AM</p>
                  <p className="text-[9px] text-slate-400">NDLS</p>
                </div>
                <div className="flex-1 px-3">
                  <div className="h-[1px] bg-slate-200 w-full relative">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute left-1/2 -top-[2px] -translate-x-1/2" />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">8h 25m</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">11:45 PM</p>
                  <p className="text-[9px] text-slate-400">BPL</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-700">
                  Fare from â‚¹1,200
                </span>
                <button
                  onClick={() => nav("/book")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition">
                  Book Seat
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=300&q=80"
              alt="Train"
              className="w-full sm:w-36 h-28 object-cover rounded-xl"
            />
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    TRAIN #22436
                  </span>
                  <h3 className="text-xs font-bold text-slate-800">
                    Vande Bharat Express
                  </h3>
                </div>
                <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded">
                  CHECK LIST
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 text-center">
                <div>
                  <p className="text-xs font-bold text-slate-800">03:00 PM</p>
                  <p className="text-[9px] text-slate-400">BSB</p>
                </div>
                <div className="flex-1 px-3">
                  <div className="h-[1px] bg-slate-200 w-full relative">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute left-1/2 -top-[2px] -translate-x-1/2" />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">6h 15m</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">09:15 PM</p>
                  <p className="text-[9px] text-slate-400">NDLS</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-700">
                  Fare from â‚¹1,650
                </span>
                <button
                  onClick={() => nav("/book")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition">
                  Book Seat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE FEATURES BLUE BANNER
      ====================================================== */}
      <section className="bg-[#004ac6] text-white py-14 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold">
            The Next Generation of Rail Travel
          </h2>
          <p className="text-xs text-blue-100 max-w-xl mx-auto mt-2">
            Building the backbone of national logistics with cutting-edge
            technology and human-centric design.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl text-left">
              <Shield size={20} className="text-blue-200 mb-3" />
              <h3 className="text-xs font-bold">Secure Booking</h3>
              <p className="text-[10px] text-blue-100 mt-1">
                Enterprise-grade security for all your financial transactions.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl text-left">
              <Zap size={20} className="text-blue-200 mb-3" />
              <h3 className="text-xs font-bold">Fast Reservation</h3>
              <p className="text-[10px] text-blue-100 mt-1">
                Proprietary algorithms for lightning-fast seat allocation.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl text-left">
              <CheckCircle2 size={20} className="text-blue-200 mb-3" />
              <h3 className="text-xs font-bold">24/7 Support</h3>
              <p className="text-[10px] text-blue-100 mt-1">
                Dedicated administrative experts available around the clock.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl text-left">
              <Route size={20} className="text-blue-200 mb-3" />
              <h3 className="text-xs font-bold">Easy Refunds</h3>
              <p className="text-[10px] text-blue-100 mt-1">
                Instant processing for cancellations and service alterations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRAVEL INSIGHTS & TESTIMONIAL
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Insights */}
          <div className="lg:col-span-7">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Travel Insights
            </h2>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100 flex gap-3 items-center">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80"
                  alt="Insight 1"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    5 Tips for a Comfortable Overnight Journey
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                    Learn how to maximize comfort in 1AC and 2AC coaches during
                    long-haul routes...
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 inline-block">
                    Read time: 4 mins
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-100 flex gap-3 items-center">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=150&q=80"
                  alt="Insight 2"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Lounge Access: A Guide for Business Travelers
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                    Explore the premium lounge facilities available at major
                    metro stations across the network...
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 inline-block">
                    Read time: 6 mins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="lg:col-span-5">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              What Travelers Say
            </h2>
            <div className="bg-[#eff4ff] p-5 rounded-2xl border border-blue-100 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Rajesh Kumar
                  </h3>
                  <p className="text-[9px] text-slate-500">Frequent Traveler</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "RailLink's system has completely transformed how I manage my
                monthly business trips. The interface is intuitive, and the
                refund process is genuinely the fastest I've experienced."
              </p>
              <div className="text-orange-400 text-xs mt-3">
                â˜…â˜…â˜…â˜…â˜…
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DARK FOOTER
      ====================================================== */}
      <footer className="bg-[#1e2738] text-slate-400 pt-12 pb-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Train size={18} className="text-blue-400" />
              <span className="font-bold text-white text-sm">RailAdmin</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Leading the digital transformation of railway operations with
              secure, scalable ERP solutions.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs">Quick Links</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => nav("/trains")}
                  className="hover:text-white">
                  Search Trains
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav("/schedule")}
                  className="hover:text-white">
                  Seat Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav("/book")}
                  className="hover:text-white">
                  Group Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav("/support")}
                  className="hover:text-white">
                  Station Directory
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs">Information</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button className="hover:text-white">Privacy Policy</button>
              </li>
              <li>
                <button className="hover:text-white">Terms of Service</button>
              </li>
              <li>
                <button className="hover:text-white">Refund Rules</button>
              </li>
              <li>
                <button className="hover:text-white">Contact / Support</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs">Newsletter</h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Get the latest updates on new routes and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-slate-800 border border-slate-700 text-white px-3 py-2 text-xs rounded-l-lg outline-none w-full focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-lg">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
          <p>
            Â© 2026 RailLink Railway Reservation System. All rights reserved.
          </p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Designed for Excellence</span>
            <span>v2.4.0 Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
