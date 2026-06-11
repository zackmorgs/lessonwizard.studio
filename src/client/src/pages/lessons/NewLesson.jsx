import React, { useState } from "react";

import Layout from "../../components/Layout";

export default function NewLesson() {
  const [form, setForm] = useState({
    date: "",
    instrument: "",
    time: "",
    notes: "",
    songIds: "",
    tagIds: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to API
    console.log(form);
  };

  return (
    <Layout>
      <section id="new_lesson" className="section">
        <div className="panel">
              <h1 className="h1 mb-4">New Lesson</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              className="input"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="time">Time</label>
            <input
              id="time"
              name="time"
              type="time"
              className="input"
              value={form.time}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="instrument">Instrument</label>
            <input
              id="instrument"
              name="instrument"
              type="text"
              className="input"
              placeholder="e.g. Guitar"
              value={form.instrument}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="input"
              rows={4}
              placeholder="Lesson notes..."
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="songIds">Song IDs</label>
            <input
              id="songIds"
              name="songIds"
              type="text"
              className="input"
              placeholder="Comma-separated song IDs"
              value={form.songIds}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tagIds">Tag IDs</label>
            <input
              id="tagIds"
              name="tagIds"
              type="text"
              className="input"
              placeholder="Comma-separated tag IDs"
              value={form.tagIds}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2">
            Create Lesson
          </button>
        </form>
        </div>
      </section>
    </Layout>
  );
}
