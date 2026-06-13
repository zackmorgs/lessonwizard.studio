import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { Editor } from "@tinymce/tinymce-react";

import Layout from "../../components/Layout";
import InstrumentPicker from "../../components/InstrumentPicker";
import SongPicker from "../../components/SongPicker";
import { getLessonById, updateLesson } from "../../services/lessonService";
import { getStudentById } from "../../services/studentService";

export default function EditLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [studentName, setStudentName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getLessonById(id)
      .then((lesson) => {
        setForm({
          studentId: lesson.studentId ?? "",
          date: lesson.date
            ? new Date(lesson.date).toISOString().split("T")[0]
            : "",
          time: lesson.time ? lesson.time.substring(0, 5) : "",
          instrument: lesson.instrument ?? "",
          notes: lesson.notes ?? "",
          songIds: lesson.songIds ?? [],
          tagIds: Array.isArray(lesson.tagIds) ? lesson.tagIds.join(", ") : "",
        });
        if (lesson.studentId) {
          return getStudentById(lesson.studentId)
            .then((s) => setStudentName(s.name))
            .catch(() => {});
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        time: `${form.time}:00`,
        songIds: form.songIds.map((t) => t.id ?? t),
        tagIds: form.tagIds
          ? form.tagIds
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };
      await updateLesson(id, payload);
      navigate(`/lessons/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="p-6 text-sm text-gray-500">Loading...</p>
      </Layout>
    );
  }

  if (error && !form) {
    return (
      <Layout>
        <p className="p-6 text-sm text-red-600">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section">
        <div className="panel max-w-2xl mx-auto mt-8">
          <div className="mb-4">
            <Link
              to={`/lessons/${id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              &larr; Back to Lesson
            </Link>
            <h1 className="h1 mt-1">
              {studentName ? `Edit Lesson for ${studentName}` : "Edit Lesson"}
            </h1>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

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
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <InstrumentPicker
                value={form.instrument ? [form.instrument] : []}
                onChange={(instruments) =>
                  setForm({ ...form, instrument: instruments[0] || "" })
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <Editor
                apiKey="scgdo10tw7b74zk4lfomtw3eirvn8xw863dvg77qifj7ctqk"
                initialValue={form.notes}
                onEditorChange={(content) =>
                  setForm((content) => ({ ...form, notes: content }))
                }
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "searchreplace",
                    "visualblocks",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | bold italic | bullist numlist | removeformat",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>

            <SongPicker
              value={form.songIds}
              onChange={(songs) => setForm({ ...form, songIds: songs })}
            />

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <Link to={`/lessons/${id}`} className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
