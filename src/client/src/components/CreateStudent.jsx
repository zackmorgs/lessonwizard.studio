import React, { useState } from "react";
import InstrumentPicker from "./InstrumentPicker";
import { createStudent } from "../services/studentService";

export default function CreateStudent({ onCreated }) {
  const [form, setForm] = useState({ name: "", age: "", instruments: [] });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const student = await createStudent({ ...form, age: form.age ? Number(form.age) : undefined });
      onCreated(student);
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:max-w-md mx-auto px-4 py-12 flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="h1 text-4xl">
            Welcome!
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="3rem"
          viewBox="0 -960 960 960"
          width="3rem"
          fill="#aaa"
          className="mx-auto mb-3"
        >
          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 128.5-46.5T480-440q66 0 132.5 15.5T741-378q29 15 44 43.5t15 62.5v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
        </svg>
        <h2 className="text-2xl font-semibold">Add your first student</h2>
        <p className="text-gray-500 mt-1 text-sm">Create a student to get started.</p>
      </div>

      <div className="panel w-full">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="cs-name" className="text-sm font-medium text-gray-700">Name</label>
            <input
              id="cs-name"
              name="name"
              type="text"
              placeholder="Student name"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
              className="input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cs-age" className="text-sm font-medium text-gray-700">Age</label>
            <input
              id="cs-age"
              name="age"
              type="number"
              min="1"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="input"
            />
          </div>

          <InstrumentPicker
            value={form.instruments}
            onChange={(instruments) => setForm({ ...form, instruments })}
          />

          <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
            {submitting ? "Creating…" : "Create Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
