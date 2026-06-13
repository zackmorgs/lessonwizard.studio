import React, { useState, useEffect } from "react";

import { Editor } from "@tinymce/tinymce-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import InstrumentPicker from "../../components/InstrumentPicker";
import StudentPicker from "../../components/StudentPicker";
import SongPicker from "../../components/SongPicker";
import { getStudentById } from "../../services/studentService";
import { createLesson } from "../../services/lessonService";

export default function NewLesson() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get("studentId");
  const [studentName, setStudentName] = useState(null);

  useEffect(() => {
    if (studentId) {
      getStudentById(studentId)
        .then((s) => setStudentName(s.name))
        .catch(() => {});
    }
  }, [studentId]);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    instrument: "",
    time: "",
    notes: "",
    songIds: [],
    tagIds: "",
    studentId: studentId ?? "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId) {
      setError("Please select a student.");
      return;
    }
    if (!form.date) {
      setError("Date is required.");
      return;
    }
    if (!form.time) {
      setError("Time is required.");
      return;
    }
    if (!form.instrument) {
      setError("Please select an instrument.");
      return;
    }
    setError(null);
    const payload = {
      ...form,
      time: form.time ? `${form.time}:00` : "00:00:00",
      songIds: form.songIds.map((t) => t.id ?? t),
      tagIds: form.tagIds
        ? form.tagIds.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };
    await createLesson(payload);
    navigate("/lessons");
  };

  return (
    <Layout>
      <section id="new_lesson" className="section">
        <div className="panel">
          <h1 className="h1 mb-4">{studentName ? `New Lesson for ${studentName}` : "New Lesson"}</h1>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!studentId && (
              <StudentPicker
                value={form.studentId}
                onChange={(id) => {
                  setForm({ ...form, studentId: id });
                  if (id) {
                    getStudentById(id)
                      .then((s) => setStudentName(s.name))
                      .catch(() => {});
                  } else {
                    setStudentName(null);
                  }
                }}
              />
            )}
            <div className="flex flex-col gap-1">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                className="input"
                value={
                  form.date === ""
                    ? form.date
                    : new Date(form.date).toISOString().split("T")[0]
                }
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
              <InstrumentPicker
                value={form.instrument ? [form.instrument] : []}
                onChange={(instruments) => setForm({ ...form, instrument: instruments[0] || "" })}
              />
            </div>

            {/* <div className="flex flex-col gap-1">
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
            </div> */}

            <div className="flex flex-col">
              <Editor
                apiKey="scgdo10tw7b74zk4lfomtw3eirvn8xw863dvg77qifj7ctqk"
                initialValue={form.notes}
                 onEditorChange={(content) => setForm((content) => ({ ...form, notes: content }))}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "preview",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>

            <SongPicker
              value={form.songIds}
              onChange={(songs) => setForm({ ...form, songIds: songs })}
            />

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
