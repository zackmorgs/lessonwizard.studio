import React, { useState, useEffect, useRef } from "react";
import { getStudents } from "../services/studentService";

export default function StudentsPicker({ value = [], onChange }) {
  const [allStudents, setAllStudents] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    getStudents()
      .then(setAllStudents)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const q = input.toLowerCase().trim();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const filtered = allStudents.filter(
      (s) => s.name.toLowerCase().includes(q) && !value.includes(s.id)
    );
    setSuggestions(filtered);
  }, [input, allStudents, value]);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addStudent(id) {
    if (!value.includes(id)) {
      onChange([...value, id]);
    }
    setInput("");
    setOpen(false);
  }

  function removeStudent(id) {
    onChange(value.filter((sid) => sid !== id));
  }

  const selectedStudents = allStudents.filter((s) => value.includes(s.id));

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      <label className="label">Students</label>

      {selectedStudents.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {selectedStudents.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {s.name}
              <button
                type="button"
                onClick={() => removeStudent(s.id)}
                className="ml-0.5 hover:text-blue-600 font-bold"
                aria-label={`Remove ${s.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          className="input w-full"
          placeholder="Search students…"
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {open && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-48 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onMouseDown={() => addStudent(s.id)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
