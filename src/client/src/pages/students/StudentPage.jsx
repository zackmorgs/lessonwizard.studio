import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import InstrumentPicker from "../../components/InstrumentPicker";
import LessonList from "../../components/LessonList";
import SongList from "../../components/SongList";
import { Editor } from "@tinymce/tinymce-react";

import {
  getStudentById,
  getStudentLessons,
  getStudentDocuments,
  addDocumentToStudent,
  removeDocumentFromStudent,
  updateStudent,
  deleteStudent,
} from "../../services/studentService";
import { getSongsByStudent } from "../../services/songService";
import { getDocuments } from "../../services/documentService";

export default function StudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [songs, setSongs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [docQuery, setDocQuery] = useState("");
  const [docPickerOpen, setDocPickerOpen] = useState(false);
  const docPickerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      getStudentById(id),
      getStudentLessons(id),
      getSongsByStudent(id),
      getStudentDocuments(id),
      getDocuments(),
    ])
      .then(([studentData, lessonData, songData, docData, allDocs]) => {
        setStudent(studentData);
        setLessons(lessonData);
        setSongs(songData ?? []);
        setDocuments(docData ?? []);
        setAllDocuments(allDocs ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Close doc picker on outside click
  useEffect(() => {
    function handleClick(e) {
      if (docPickerRef.current && !docPickerRef.current.contains(e.target))
        setDocPickerOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAddDocument = async (doc) => {
    try {
      await addDocumentToStudent(id, doc.id);
      setDocuments((prev) => [...prev, doc]);
    } catch (err) {
      setError(err.message);
    }
    setDocQuery("");
    setDocPickerOpen(false);
  };

  const handleRemoveDocument = async (docId) => {
    try {
      await removeDocumentFromStudent(id, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try {
      await deleteStudent(id);
      navigate("/students");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="p-6 text-sm text-gray-500">Loading...</p>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <p className="p-6 text-sm text-red-600">
          {error ?? "Student not found."}
        </p>
      </Layout>
    );
  }

  console.log(student);

  return (
    <Layout>
      <Breadcrumbs to="/students" label="Students" />
      <div className="panel lg:max-w-lg mx-auto mt-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mt-1">{student.name}</h1>
            {student.age > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">Age {student.age}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/students/${id}/edit`}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Instruments */}
        <div className="">
          <InstrumentPicker
            value={student.instruments ?? []}
            onChange={async (instruments) => {
              const updated = { ...student, instruments };
              setStudent(updated);
              try {
                await updateStudent(id, updated);
              } catch (err) {
                setError(err.message);
              }
            }}
          />
        </div>

        {/* Goals */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Goals
          </h2>
          <Editor
            apiKey="scgdo10tw7b74zk4lfomtw3eirvn8xw863dvg77qifj7ctqk"
            initialValue={student.goals ?? ""}
            onBlur={async (_, editor) => {
              const goals = editor.getContent();
              if (goals === student.goals) return;
              const updated = { ...student, goals };
              setStudent(updated);
              try {
                await updateStudent(id, updated);
              } catch (err) {
                setError(err.message);
              }
            }}
            init={{
              height: 300,
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

        {/* Notes */}
        <div className="">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Notes
          </h2>
          <Editor
            apiKey="scgdo10tw7b74zk4lfomtw3eirvn8xw863dvg77qifj7ctqk"
            initialValue={student.notes ?? ""}
            onBlur={async (_, editor) => {
              const notes = editor.getContent();
              if (notes === student.notes) return;
              const updated = { ...student, notes };
              setStudent(updated);
              try {
                await updateStudent(id, updated);
              } catch (err) {
                setError(err.message);
              }
            }}
            init={{
              height: 300,
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

        {/* Lessons */}
        <div className=" ">
          <LessonList lessons={lessons} studentId={student.id} />
        </div>

        {/* Documents */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Documents
          </h2>
          {documents.length > 0 && (
            <ul className="flex flex-col gap-1 scrollable max-h-72">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded bg-white flex-row"
                >
                  <a
                    href={doc.pdfUrl ? `/${doc.pdfUrl}` : undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium truncate hover:underline flex-row flex items-center"
                  >
                    <img
                      src="/assets/svg/icon-file-upload.svg"
                      alt="Document"
                      className="w-4 h-4 mr-2"
                    />
                    <span className="title">{doc.title}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="text-gray-400 hover:text-red-500 shrink-0 text-lg leading-none"
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          {/* Add document picker */}
          <div className="relative" ref={docPickerRef}>
            <input
              type="text"
              className="input w-full"
              placeholder="Add document..."
              value={docQuery}
              onChange={(e) => {
                setDocQuery(e.target.value);
                setDocPickerOpen(true);
              }}
              onFocus={() => setDocPickerOpen(true)}
            />
            {docPickerOpen && (
              <ul className="absolute z-10 w-full rounded bg-white shadow max-h-48 overflow-y-auto mt-1">
                {allDocuments
                  .filter(
                    (d) =>
                      !documents.some((linked) => linked.id === d.id) &&
                      d.title.toLowerCase().includes(docQuery.toLowerCase()),
                  )
                  .map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 truncate flex flex-row justify-between"
                        onClick={() => handleAddDocument(doc)}
                      >
                        <span className="title">{doc.title}</span>
                        <img src="/assets/svg/icon-plus.svg" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Songs */}
        <div className="">
          <SongList songList={songs} />
        </div>
      </div>
    </Layout>
  );
}
