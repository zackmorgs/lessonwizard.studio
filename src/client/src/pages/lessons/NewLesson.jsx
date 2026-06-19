import React, { useState, useEffect, useRef } from "react";

import { Editor } from "@tinymce/tinymce-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import InstrumentPicker from "../../components/InstrumentPicker";
import StudentPicker from "../../components/StudentPicker";
import SongPicker from "../../components/SongsPicker";
import TagPicker from '../../components/TagPicker';
import { getStudentById } from "../../services/studentService";
import { createLesson } from "../../services/lessonService";
import { createSong, getSongs } from "../../services/songService";

export default function NewLesson() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get("studentId");
  const [studentName, setStudentName] = useState(null);
  const notesRef = useRef("");

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
    tagIds: [],
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

    // For each selected Spotify track, find or create a DB song and collect its ID
    const tags = Array.isArray(form.tagIds) ? form.tagIds : [];
    const allDbSongs = await getSongs();
    const songDbIds = await Promise.all(
      form.songIds.map(async (track) => {
        // track is a Spotify track object from SongsPicker
        const spotifyId = track.id ?? track;
        const existing = allDbSongs.find((s) => s.spotifyTrackId === spotifyId);
        if (existing) {
          return existing.id;
        }
        const created = await createSong({
          title: track.name ?? "",
          artist: track.artist ?? "",
          spotifyTrackId: spotifyId,
          isExplicit: track.isExplicit ?? false,
          tagIds: tags,
        });
        return created.id;
      })
    );

    const payload = {
      ...form,
      notes: notesRef.current,
      time: form.time ? `${form.time}:00` : "00:00:00",
      songIds: songDbIds,
      tagIds: tags,
    };
    await createLesson(payload);
    navigate("/lessons");
  };

  return (
    <Layout>
      <div className="md:max-w-lg mx-auto">
        <section id="new_lesson" className="section">
        <div className="panel">
          <h1 className="h1 mb-4 text-3xl mt-8">{studentName ? `New Lesson for ${studentName}` : "New Lesson"}</h1>
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
                onEditorChange={(content) => {
                  notesRef.current = content;
                }}
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
              {/* <input
                id="tagIds"
                name="tagIds"
                type="text"
                className="input"
                placeholder="Comma-separated tag IDs"
                value={form.tagIds}
                onChange={handleChange}
              /> */}
              <TagPicker
                value={form.tagIds}
                onChange={(tags) => setForm({ ...form, tagIds: tags })}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-6">
              Create Lesson
            </button>
          </form>
        </div>
      </section>
      </div>
    </Layout>
  );
}
