import React, { useState } from "react";
import { HelpCircle, Mail, MessageSquare, ChevronDown } from "lucide-react";

const Help = () => {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      question: "How can I create a new train?",
      answer:
        "Go to Train Management and click Add Train to create a new train.",
    },
    {
      question: "How can I manage train schedules?",
      answer:
        "Open Train Schedule from the sidebar to create, edit and manage train trips.",
    },
    {
      question: "How can I check a booking?",
      answer:
        "Use the booking or PNR management section to search for a reservation.",
    },
    {
      question: "How can I cancel a ticket?",
      answer:
        "Search the booking using its PNR number and use the cancellation function.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>

        <p className="text-sm text-gray-500 mt-1">
          Get help managing the Railway Reservation System.
        </p>
      </div>

      {/* Support cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
            <HelpCircle className="text-orange-600" size={24} />
          </div>

          <h2 className="font-bold text-lg">Frequently Asked Questions</h2>

          <p className="text-sm text-gray-500 mt-2">
            Find answers to common questions about the system.
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
            <Mail className="text-blue-600" size={24} />
          </div>

          <h2 className="font-bold text-lg">Contact Support</h2>

          <p className="text-sm text-gray-500 mt-2">
            Need additional assistance? Contact the system administrator.
          </p>

          <p className="text-sm font-medium text-blue-600 mt-4">
            support@rail.com
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <MessageSquare size={20} className="text-orange-500" />

          <h2 className="font-bold text-lg">Common Questions</h2>
        </div>

        <div className="divide-y">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full flex items-center justify-between py-4 text-left">
                <span className="font-medium text-gray-800">
                  {faq.question}
                </span>

                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="pb-4 text-sm text-gray-500">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
