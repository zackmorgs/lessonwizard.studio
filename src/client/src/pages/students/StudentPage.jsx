import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout";
import InstrumentPicker from "../../components/InstrumentPicker";
import LessonList from "../../components/LessonList";
import SongList from "../../components/SongList";
import { Editor } from "@tinymce/tinymce-react";

import {
  getStudentById,
  getStudentLessons,
  updateStudent,
  deleteStudent,
} from "../../services/studentService";
import { getSongsByStudent } from "../../services/songService";

export default function StudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getStudentById(id), getStudentLessons(id), getSongsByStudent(id)])
      .then(([studentData, lessonData, songData]) => {
        setStudent(studentData);
        setLessons(lessonData);
        setSongs(songData ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
      <div className="panel lg:max-w-lg mx-auto mt-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/students"
              className="text-sm text-blue-600 hover:underline"
            >
              &larr; All Students
            </Link>
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
        <div className="bg-white">
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
        <div className="bg-white ">
          <LessonList lessons={lessons} studentId={student.id} />
        </div>

        {/* Songs */}
        <div className="bg-white">
          <SongList songList={songs} />
        </div>
      </div>
    </Layout>
  );
}
