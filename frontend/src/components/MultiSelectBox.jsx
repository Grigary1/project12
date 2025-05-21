import React from "react";

export default function MultiSelectBox({ options, values, onChange }) {
  const toggleValue = (val) => {
    if (values.includes(val)) {
      onChange(values.filter(v => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className="border rounded p-2 max-w-sm">
      {options.map(opt => (
        <label key={opt.value} className="inline-flex items-center mr-4 mb-2 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={values.includes(opt.value)}
            onChange={() => toggleValue(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
