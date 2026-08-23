import React, { useState } from "react";
import {
  Headphones,
  Mail,
  Phone,
  MessageSquare,
  Send,
  HelpCircle,
  FileText,
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
  Ticket,
  Train,
} from "lucide-react";
import { createSupportTicket } from "../../services/supportService";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createSupportTicket(form);
      setSuccess(
        "Your support ticket has been submitted! We'll reply within 24 hours.",
      );
      setForm({
        name: "",
        email: "",
        subject: "",
        category: "General",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "How can I cancel my ticket?",
      a: "Go to 'My Bookings', select your ticket and click 'Cancel'. Refund will be processed within 5-7 business days.",
    },
    {
      q: "Can I change my seat after booking?",
      a: "Seat changes are not allowed after payment. Please cancel and rebook if needed.",
    },
    {
      q: "How do I check PNR status?",
      a: "Use the 'PNR Status' option in the menu. Enter your 10-digit PNR number to see live status.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept Credit/Debit cards, UPI, Net Banking, and major wallets (Paytm, PhonePe, GPay).",
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <button
        onClick={() => nav(-1)}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[#003A8C]
          hover:text-[#1677FF]
          transition
        ">
        <ArrowLeft size={18} />
        Back
      </button>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Headphones className="text-orange-600" size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Customer Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            We're here to help. Send us a message or browse FAQs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* CONTACT FORM */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition">
              <div className="w-10 h-10 mx-auto bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                <Phone size={18} className="text-blue-600" />
              </div>
              <p className="text-xs font-bold text-gray-800">Call Us</p>
              <p className="text-[10px] text-gray-500 mt-1">1800-123-4567</p>
              <p className="text-[9px] text-gray-400">24/7 Helpline</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition">
              <div className="w-10 h-10 mx-auto bg-green-50 rounded-lg flex items-center justify-center mb-2">
                <Mail size={18} className="text-green-600" />
              </div>
              <p className="text-xs font-bold text-gray-800">Email</p>
              <p className="text-[10px] text-gray-500 mt-1">
                support@railadmin.com
              </p>
              <p className="text-[9px] text-gray-400">Reply within 24h</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition">
              <div className="w-10 h-10 mx-auto bg-purple-50 rounded-lg flex items-center justify-center mb-2">
                <MessageSquare size={18} className="text-purple-600" />
              </div>
              <p className="text-xs font-bold text-gray-800">Live Chat</p>
              <p className="text-[10px] text-gray-500 mt-1">Coming Soon</p>
              <p className="text-[9px] text-gray-400">Available 9AM-9PM</p>
            </div>
          </div>

          {/* Ticket Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              Submit a Support Ticket
            </h2>

            {success && (
              <div className="flex items-center gap-2 mb-4 text-xs text-green-700 bg-green-50 p-3 rounded-lg">
                <CheckCircle2 size={14} /> {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-lg">
                <ExternalLink size={14} /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
                  <option>General</option>
                  <option>Booking Issue</option>
                  <option>Cancellation & Refund</option>
                  <option>Payment Problem</option>
                  <option>Technical Bug</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Brief description"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[11px] font-bold text-gray-500 uppercase">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2.5 px-6 rounded-lg text-sm flex items-center justify-center gap-2 transition">
              {loading ?
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <>
                  <Send size={14} /> Submit Ticket
                </>
              }
            </button>
          </form>
        </div>

        {/* FAQ SIDEBAR */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HelpCircle size={16} className="text-gray-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition">
                  <summary className="text-xs font-semibold text-gray-700 flex justify-between items-center">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 sm:p-5 text-white">
            <h3 className="text-sm font-bold mb-2">Need Quick Help?</h3>
            <p className="text-[11px] text-blue-100 mb-3">
              Check these resources before submitting a ticket.
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/pnr"
                  className="flex items-center gap-2 hover:text-blue-200 transition">
                  <Ticket size={12} /> PNR Status Check
                </a>
              </li>
              <li>
                <a
                  href="/my-tickets"
                  className="flex items-center gap-2 hover:text-blue-200 transition">
                  <FileText size={12} /> My Bookings
                </a>
              </li>
              <li>
                <a
                  href="/schedule"
                  className="flex items-center gap-2 hover:text-blue-200 transition">
                  <Train size={12} /> Train Schedule
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
