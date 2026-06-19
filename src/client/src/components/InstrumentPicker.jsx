import React, { useState, useRef, useEffect } from "react";
import instruments from "../data/instruments.json";

const ALL_INSTRUMENTS = instruments.map((i) => i.name);

export default function InstrumentPicker({ value = [], onChange }) {
  const [inputVal, setInputVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }
    const filtered = ALL_INSTRUMENTS.filter(
      (name) =>
        name.toLowerCase().includes(trimmed) && !value.includes(name)
    );
    setSuggestions(filtered);
    setActiveIndex(-1);
  }, [inputVal, value]);

  const addInstrument = (name) => {
    const val = name.trim();
    if (!val || value.includes(val)) return;
    onChange([...value, val]);
    setInputVal("");
    setSuggestions([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const removeInstrument = (name) => {
    onChange(value.filter((i) => i !== name));
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
        return;
      }
      if (e.key === "Escape") {
        setSuggestions([]);
        setActiveIndex(-1);
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        addInstrument(suggestions[activeIndex]);
      } else if (inputVal.trim()) {
        addInstrument(inputVal);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Instruments</label>

      <div className="relative flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="e.g. Guitar"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setSuggestions([]), 100)}
          className="input"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => addInstrument(inputVal)}
          className="btn btn-primary"
        >
          <img src="/assets/svg/icon-plus.svg" alt="Add instrument" className="icon" />
          <span className="btn-text">Add Instrument</span>
        </button>

        {suggestions.length > 0 && (
          <ul
            ref={listRef}
            className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-48 overflow-y-auto"
          >
            {suggestions.map((name, idx) => (
              <li
                key={name}
                onMouseDown={() => addInstrument(name)}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  idx === activeIndex
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((inst) => (
            <span
              key={inst}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
            >
              {inst}
              <button
                type="button"
                onClick={() => removeInstrument(inst)}
                className="text-blue-500 hover:text-blue-700 leading-none"
                aria-label={`Remove ${inst}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
