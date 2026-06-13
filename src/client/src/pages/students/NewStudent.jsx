import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Editor } from "@tinymce/tinymce-react";

import Layout from "../../components/Layout";
import InstrumentPicker from "../../components/InstrumentPicker";
import { createStudent } from "../../services/studentService";

export default function NewStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", goals: "", instruments: [] });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createStudent({ ...form, age: Number(form.age) });
      navigate("/students");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">New Student</h1>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Student name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="age" className="text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <InstrumentPicker
            value={form.instruments}
            onChange={(instruments) => setForm({ ...form, instruments })}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="goals"
              className="text-sm font-medium text-gray-700"
            >
              Goals
            </label>
            <Editor
              id="goals"
              apiKey="scgdo10tw7b74zk4lfomtw3eirvn8xw863dvg77qifj7ctqk"
              initialValue=""
              onEditorChange={(content) => setForm({ ...form, goals: content })}
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

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-success mt-4"
          >
            {submitting ? (
              "Saving..."
            ) : (
              <>
                <svg
                  class="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.5rem"
                  viewBox="0 -960 960 960"
                  width="1.5rem"
                  fill="currentColor"
                >
                  <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-640Zm0 400Z"></path>
                </svg>
                <span className="btn-text"> Add Student</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
