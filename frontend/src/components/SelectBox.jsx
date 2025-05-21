import React from "react";

export default function SelectBox({ options, value, onChange }) {
  return (
    <select
      className="border rounded px-3 py-2"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select an option</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
