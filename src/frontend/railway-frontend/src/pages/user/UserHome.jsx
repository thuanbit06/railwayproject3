import React from "react";
import {
  Search,
  Bell,
  Calendar,
  MapPin,
  BookOpen,
  Clock,
  Armchair,
  XCircle,
  ChevronRight,
  TrainFront,
  Ticket,
  UserCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon, // Sửa lỗi import (alias đúng)
} from "lucide-react";

const UserHome = () => {
  // Dữ liệu mẫu cho Recent Bookings
  const recentBookings = [
    {
      id: 1,
      route: "Delhi → Jaipur",
      pnr: "4589201132",
      train: "12958 Swarna Jayanti Exp",
      date: "Oct 15, 2024",
      status: "Completed",
    },
    {
      id: 2,
      route: "Mumbai → Pune",
      pnr: "9821104471",
      train: "12123 Deccan Queen",
      date: "Oct 10, 2024",
      status: "Completed",
    },
  ];

  // Dữ liệu mẫu cho Destinations (Sử dụng placeholder thay vì URL hỏng)
  const destinations = [
    {
      id: 1,
      title: "Mumbai Gateway",
      desc: "Experience the city that never sleeps. Explore beaches and colonial architecture.",
      price: "1,250",
      tag: "Trending",
      bg: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      title: "Goa Getaway",
      desc: "Relax on pristine beaches and enjoy vibrant shacks in North Goa.",
      price: "2,499",
      tag: "Hot Deal",
      bg: "from-orange-400 to-red-500",
    },
    {
      id: 3,
      title: "Jaipur Royal Heritage",
      desc: "Step back in time to the royal palaces and forts of the Pink City.",
      price: "1,800",
      tag: "Bahariya",
      bg: "from-pink-400 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans">
      {/* HEADER / NAVBAR */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-blue-700">
              RailLink Premium
            </h1>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <a
                href="#"
                className="text-blue-700 border-b-2 border-blue-700 py-5">
                Home
              </a>
              <a href="#" className="hover:text-blue-600 py-5">
                Book Ticket
              </a>
              <a href="#" className="hover:text-blue-600 py-5">
                My Tickets
              </a>
              <a href="#" className="hover:text-blue-600 py-5">
                Train Schedule
              </a>
              <a href="#" className="hover:text-blue-600 py-5">
                Support
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2 border-l pl-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <UserCircle size={24} />
              </div>
              <span className="text-sm font-semibold hidden sm:block">
                User
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Book Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, Arjun!
            </h2>
            <p className="text-gray-500 mt-1">Where are you heading today?</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-blue-100 shadow-lg">
            <Ticket size={18} /> Book a Ticket
          </button>
        </div>

        {/* TOP GRID: Search + Upcoming Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Search Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Search size={20} className="text-gray-400" /> Plan Your Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  defaultValue="New Delhi"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <BookOpen
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  defaultValue="Mumbai"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  defaultValue="10/24/2024"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm">
                <button className="text-gray-400 hover:text-gray-600">-</button>
                <span className="font-semibold">02</span>
                <button className="text-gray-400 hover:text-gray-600">+</button>
              </div>
              <div className="relative">
                <Armchair
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                  <option>Second AC</option>
                  <option>First AC</option>
                  <option>Sleeper</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-orange-100 shadow-md">
              <Search size={20} /> Search Trains
            </button>
          </div>

          {/* Upcoming Journey Card */}
          <div className="bg-blue-700 text-white p-6 rounded-2xl shadow-lg shadow-blue-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 text-blue-400 opacity-50">
              <TrainFront size={24} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-800/50 px-2 py-1 rounded">
                Upcoming Journey
              </span>
              <h4 className="text-2xl font-bold mt-3">12002 Bhopal Shatabdi</h4>
              <p className="text-blue-200 font-medium mt-1">NDLS → BPL</p>
              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div>
                  <p className="text-blue-300 text-xs">Date & Time</p>
                  <p className="font-semibold">Oct 24, 06:00 AM</p>
                </div>
                <div>
                  <p className="text-blue-300 text-xs">Seat / Coach</p>
                  <p className="font-semibold">Coach C1, 42</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-semibold text-green-100">Confirmed</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-white text-blue-700 font-bold py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Ticket size={16} /> View E-Ticket
            </button>
          </div>
        </div>

        {/* MIDDLE GRID: Quick Services + Live Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Services */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Services
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Ticket, label: "Book Ticket" },
                { icon: Clock, label: "My Bookings" },
                { icon: Search, label: "Check PNR Status" },
                { icon: TrainFront, label: "Train Schedule" },
                { icon: Armchair, label: "Seat Availability" },
                { icon: XCircle, label: "Cancel Ticket" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Updates */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-red-500">📢</span> Live Updates
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-bold text-sm text-gray-800">
                  Train 12424 Delayed
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Delayed by 15 mins due to signal technical maintenance.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-bold text-sm text-gray-800">
                  New Route Added
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  High-speed Vande Bharat route now active NDLS - Chennai.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-bold text-sm text-gray-800">
                  Maintenance Alert
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Scheduled portal maintenance on Oct 25th 02:00 AM.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-12 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Recent Bookings</h3>
          <a
            href="#"
            className="text-xs font-semibold text-blue-600 hover:underline">
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          <div className="lg:col-span-2 space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <TrainFront size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">
                      {booking.route}{" "}
                      <span className="text-gray-400 font-normal text-xs ml-1">
                        PNR: {booking.pnr}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.train} | {booking.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                    {booking.status}
                  </span>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>
          {/* Promo Card (Placeholder thay vì Unsplash) */}
          <div className="rounded-xl overflow-hidden relative h-full min-h-[160px] bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col justify-end p-4 text-white">
            <h4 className="font-bold">Join the RailLink Club</h4>
            <p className="text-xs text-gray-200 mt-1">
              Earn 2x reward points on all Shatabdi bookings this month.
            </p>
          </div>
        </div>

        {/* Explore Destinations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Explore Destinations
            </h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50">
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
                {/* Placeholder ảnh gradient */}
                <div
                  className={`relative h-48 overflow-hidden bg-gradient-to-br ${dest.bg} flex items-center justify-center`}>
                  <span className="text-white text-4xl font-bold opacity-50">
                    {dest.title.charAt(0)}
                  </span>
                  {dest.tag && (
                    <span
                      className={`absolute top-3 left-3 text-xs font-bold text-white px-2 py-1 rounded ${dest.tag === "Trending" ? "bg-blue-600" : "bg-orange-500"}`}>
                      {dest.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-gray-800">
                    {dest.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {dest.desc}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-900 font-bold">
                      ₹ {dest.price}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        Starting from
                      </span>
                    </p>
                    <button className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#eef2ff] mt-12 py-8 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-blue-700">
              RailLink Premium
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              © 2024 RailLink Premium Management Systems. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 text-xs text-gray-500 font-medium">
            <a href="#" className="hover:text-blue-600">
              About
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
            <a href="#" className="hover:text-blue-600">
              Policies
            </a>
            <a href="#" className="hover:text-blue-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserHome;
