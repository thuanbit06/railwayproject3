import React from "react";

const PageHeader = ({ title, subtitle, actions = [] }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((a, i) => (
            <button
              key={i}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                a.primary ?
                  "bg-[#003A8C] hover:bg-[#1677FF] text-white shadow"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
