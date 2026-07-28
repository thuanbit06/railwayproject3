import React from "react";

const Select = ({ label, options, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <select
      {...props}
      className={`input ${error ? "border-red-500" : "border-gray-300"}`}>
      <option value="">-- Select --</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Select;
