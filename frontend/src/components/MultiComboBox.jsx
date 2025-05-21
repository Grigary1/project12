import React, { useState, useRef, useEffect } from "react";

export default function MultiComboBox({ options, values, onChange }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredOptions = options.filter(
    opt =>
      !values.includes(opt.value) &&
      opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const addValue = (val) => {
    onChange([...values, val]);
    setSearch("");
  };

  const removeValue = (val) => {
    onChange(values.filter(v => v !== val));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64" ref={containerRef}>
      <div
        className="border rounded flex flex-wrap items-center gap-1 px-2 py-1 cursor-text"
        onClick={() => setIsOpen(true)}
      >
        {values.length === 0 && <span className="text-gray-400">Select options...</span>}
        {values.map(val => {
          const label = options.find(o => o.value === val)?.label || val;
          return (
            <span
              key={val}
              className="bg-blue-500 text-white rounded px-2 py-0.5 flex items-center gap-1"
            >
              {label}
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeValue(val);
                }}
                className="text-xs font-bold"
                type="button"
              >
                ×
              </button>
            </span>
          );
        })}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={values.length === 0 ? "" : undefined}
          className="flex-grow outline-none px-1 py-1 min-w-[50px]"
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute bg-white border w-full max-h-40 overflow-auto z-10 mt-1 rounded">
          {filteredOptions.map(opt => (
            <li
              key={opt.value}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => addValue(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute bg-white border w-full p-2 z-10 mt-1 rounded text-gray-500">
          No options found
        </div>
      )}
    </div>
  );
}
