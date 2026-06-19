import React, { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";

export default function StudentPicker({ value, onChange }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="studentId" className="text-sm font-medium text-gray-700">
        Student
      </label>
      {loading ? (
        <p className="text-sm text-gray-400">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-gray-400">No students found.</p>
      ) : (
        <select
          id="studentId"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— Select a student —</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
