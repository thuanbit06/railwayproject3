import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Train,
  MapPin,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  Headphones,
  BarChart3,
  Database,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Route,
  Ticket,
  TrendingUp,
  Building2,
  Activity,
  Gauge,
  Network,
  GitBranch,
  Server,
  Mail,
  Phone,
} from "lucide-react";

import logo from "../../assets/Railway.png";

const Introduction = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =======================
     DATA
  ======================== */
  const features = [
    {
      icon: Ticket,
      title: "Smart Ticketing",
      desc: "Real-time online reservation system supporting multiple train classes, coaches, and intercity schedules.",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      icon: Train,
      title: "Train & Fleet Management",
      desc: "Comprehensive management of trains, coaches, seat maps, operational status, and maintenance cycles.",
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: MapPin,
      title: "Station & Route Control",
      desc: "Centralized control of station networks, route planning, distance calculation, and transit timing.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: BarChart3,
      title: "Revenue & Analytics",
      desc: "Real-time dashboards for revenue tracking, occupancy rates, and booking trends.",
      gradient: "from-purple-500 to-indigo-700",
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      desc: "JWT authentication, Role-Based Access Control (RBAC), and full audit logging for all system operations.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: Zap,
      title: "High Performance",
      desc: "Optimized RESTful APIs with sub-50ms response time, scalable for thousands of concurrent users.",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  const techStack = [
    { icon: Cpu, label: ".NET 8", desc: "Backend Framework" },
    { icon: Database, label: "SQL Server", desc: "Relational DBMS" },
    { icon: Code2, label: "React + Vite", desc: "Frontend SPA" },
    { icon: Layers, label: "Tailwind CSS", desc: "Utility-First UI" },
  ];

  const modules = [
    {
      icon: Train,
      title: "Train Management",
      desc: "CRUD operations for trains, coaches, and statuses",
    },
    {
      icon: Route,
      title: "Schedule Management",
      desc: "Departure, arrival, and route configuration",
    },
    {
      icon: MapPin,
      title: "Station Management",
      desc: "Geographic and operational station data",
    },
    {
      icon: Ticket,
      title: "Reservation System",
      desc: "PNR generation and seat allocation",
    },
    {
      icon: Users,
      title: "Passenger Management",
      desc: "Passenger profiles and history tracking",
    },
    {
      icon: TrendingUp,
      title: "Fare & Pricing",
      desc: "Dynamic fare rules and discount policies",
    },
    {
      icon: BarChart3,
      title: "Reporting",
      desc: "Financial and operational analytics",
    },
    {
      icon: Shield,
      title: "Access Control",
      desc: "JWT security and role management",
    },
  ];

  const stats = [
    { number: "20+", label: "Database Tables" },
    { number: "8", label: "Core Modules" },
    { number: "<50ms", label: "API Latency" },
    { number: "100%", label: "Responsive UI" },
  ];

  const workflow = [
    {
      step: "01",
      title: "Search & Inquiry",
      desc: "Passengers search for available trains based on origin, destination, and travel date.",
    },
    {
      step: "02",
      title: "Reservation",
      desc: "System validates seat availability, allocates seats, and generates a unique PNR.",
    },
    {
      step: "03",
      title: "Payment & Issuance",
      desc: "Secure payment processing followed by instant e-ticket generation.",
    },
    {
      step: "04",
      title: "Operations & Reporting",
      desc: "Administrators monitor real-time operations and generate analytical reports.",
    },
  ];

  /* =======================
     RENDER
  ======================== */
  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans antialiased">
      {/* =======================
          NAVBAR
      ======================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group">
            <img
              src={logo}
              alt="RailLink Premium"
              className="w-10 h-10 object-contain group-hover:scale-105 transition"
            />
            <div>
              <p className="font-extrabold text-[#003A8C] text-lg leading-none">
                RailLink
              </p>
              <p className="text-[9px] font-bold text-[#FF7A00] tracking-wider leading-none mt-0.5">
                PREMIUM
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {["Home", "Modules", "Workflow", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-[#003A8C] transition">
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-[#003A8C] hover:bg-blue-50 rounded-lg transition">
              Login
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm font-bold bg-[#003A8C] hover:bg-[#1677FF] text-white rounded-lg shadow-md transition">
              Enter System
            </button>
          </div>
        </div>
      </header>

      {/* =======================
          HERO SECTION
      ======================== */}
      <section
        id="home"
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#003A8C] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                <Sparkles size={14} className="text-yellow-500" />
                Railway Management System
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                RailLink Premium
              </h1>

              <p className="mt-4 text-xl font-semibold text-[#003A8C]">
                Modernizing Railway Operations
              </p>

              <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-xl">
                A comprehensive Railway Management System integrating train
                operations, station control, online reservations, and business
                analytics—built on modern .NET 8 and React architecture.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-blue-200 transition group">
                  Access System
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 shadow-sm transition">
                  <Play size={16} className="text-[#FF7A00]" />
                  Watch Demo
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto lg:mx-0">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <p className="text-2xl font-black text-[#003A8C]">
                      {stat.number}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-gray-800">Live Operations</p>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>

                <div className="space-y-3">
                  {[
                    {
                      train: "12002 Shatabdi",
                      route: "NDLS → BPL",
                      time: "06:00",
                      status: "On Time",
                    },
                    {
                      train: "12431 Rajdhani",
                      route: "BCT → NDLS",
                      time: "16:35",
                      status: "Delayed 10m",
                    },
                    {
                      train: "12626 Kerala Exp",
                      route: "MAS → TVC",
                      time: "11:45",
                      status: "On Time",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{item.train}</p>
                        <p className="text-xs text-gray-500">{item.route}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{item.time}</p>
                        <p
                          className={`text-[10px] font-semibold ${
                            item.status.includes("On") ?
                              "text-green-600"
                            : "text-orange-500"
                          }`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce"
                style={{ animationDuration: "3s" }}>
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-green-500" />
                  <span className="text-xs font-bold">Live</span>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-bounce"
                style={{ animationDuration: "4s" }}>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-500" />
                  <span className="text-xs font-bold">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================
          SYSTEM MODULES
      ======================== */}
      <section id="modules" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#1677FF] uppercase tracking-wider mb-2">
              System Modules
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Modular Monolith Architecture
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              The system is designed with eight core modules, ensuring high
              cohesion, loose coupling, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    features[i % features.length].gradient
                  } flex items-center justify-center mb-4`}>
                  <module.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {module.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================
          BUSINESS WORKFLOW
      ======================== */}
      <section id="workflow" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#FF7A00] uppercase tracking-wider mb-2">
              Business Workflow
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              End-to-End Operational Flow
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-blue-200" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {workflow.map((step, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#003A8C] to-[#1677FF] rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg shadow-blue-200">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =======================
          ABOUT
      ======================== */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-[#003A8C] to-[#1677FF] rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Why RailLink Premium?
                </h3>
                <div className="space-y-3">
                  {[
                    "Modular Monolith architecture for easy maintenance",
                    "Fully responsive UI across all devices",
                    "Real-time analytics and reporting engine",
                    "Multi-payment gateway integration ready",
                    "Comprehensive audit trails for compliance",
                    "Scalable multi-station and multi-route support",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-green-300 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-[#FF7A00] uppercase tracking-wider mb-2">
                About the System
              </p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
                A Complete Railway Management Solution
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                RailLink Premium is a full-featured Railway Management System
                developed to digitalize rail operations—from station and fleet
                management to passenger reservations and financial analytics.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                With modern software architecture, enterprise-grade security,
                and an intuitive user interface, RailLink Premium serves as both
                an operational control center and a seamless booking platform
                for passengers.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition">
                Explore System <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =======================
          CONTACT SECTION
      ======================== */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#1677FF] uppercase tracking-wider mb-2">
              Get in Touch
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Contact RailLink Premium
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Have questions? Our technical team is ready to assist with demos,
              integration support, or academic inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT: Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  System Support Center
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  RailLink Premium provides 24/7 technical support for
                  administrators and operational staff.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#1677FF]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Email Support</p>
                    <a
                      href="mailto:support@raillink.premium"
                      className="text-sm text-[#1677FF] hover:underline">
                      support@raillink.premium
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Helpline</p>
                    <a
                      href="tel:+84012345678"
                      className="text-sm text-[#1677FF] hover:underline">
                      +84 (0) 123 456 789
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      Mon – Fri, 08:00 AM – 06:00 PM
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Head Office</p>
                      <p className="text-sm text-gray-500">
                        123 Railway Boulevard
                        <br />
                        District 1, Ho Chi Minh City
                        <br />
                        Vietnam
                      </p>
                    </div>
                  </div>

                  {/* Google Maps Embed */}
                  <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg h-56 lg:h-64">
                    <iframe
                      title="RailLink Premium Office Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.494670402642!2d106.697845074846!3d10.775843989366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38e2d4d9d3%3A0x7e1b9c0e8c8b8b8b!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    📍 Interactive map – Drag to explore the area.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Send us a Message
              </h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@university.edu"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="System Demonstration Request"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Please describe your inquiry..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] transition resize-none"></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#003A8C] hover:bg-[#1677FF] text-white font-bold py-3.5 rounded-xl shadow-lg transition group">
                  Send Message
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>

              <p className="text-[10px] text-gray-400 text-center mt-4">
                Note: This is a demonstration form. Messages are not processed
                in this prototype.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =======================
          FOOTER
      ======================== */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#003A8C] to-[#1677FF] rounded-xl flex items-center justify-center">
                  <Train size={20} className="text-white" />
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
              <p className="text-sm text-gray-500 max-w-md">
                Railway Management System – Modernizing rail transport through
                technology.
              </p>
            </div>

            <div>
              <p className="font-bold text-gray-800 mb-3">Navigation</p>
              <div className="space-y-2 text-sm">
                {["Home", "Modules", "About"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-gray-500 hover:text-[#003A8C]">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-gray-800 mb-3">Support</p>
              <div className="space-y-2 text-sm">
                {[
                  "Documentation",
                  "API Reference",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-500 hover:text-[#003A8C]">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © 2024 RailLink Premium Management Systems. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Built with .NET 8 & React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Introduction;
