import React, { useState } from "react";

export default function ComboBox({ options, value, onChange }) {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setSearch("");
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={search || options.find(o => o.value === value)?.label || ""}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
        className="border rounded px-3 py-2 w-full"
      />
      {search && (
        <ul className="absolute bg-white border w-full max-h-40 overflow-auto z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <li
                key={opt.value}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
}
