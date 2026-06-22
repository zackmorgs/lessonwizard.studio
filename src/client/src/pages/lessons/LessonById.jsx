import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";

import { getLessonById, deleteLesson, getLessonDocuments, addDocumentToLesson, removeDocumentFromLesson } from "../../services/lessonService";
import { getStudentById } from "../../services/studentService";
import { getSongById } from "../../services/songService";
import { getDocuments } from "../../services/documentService";

function formatDate(date) {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatTime(time) {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function LessonById() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [student, setStudent] = useState(null);
    const [songs, setSongs] = useState({});
    const [documents, setDocuments] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [docQuery, setDocQuery] = useState("");
    const [docPickerOpen, setDocPickerOpen] = useState(false);
    const docPickerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getLessonById(id)
            .then((lessonData) => {
                setLesson(lessonData);
                const fetches = [
                    getLessonDocuments(id).then(setDocuments).catch(() => []),
                    getDocuments().then(setAllDocuments).catch(() => []),
                ];
                if (lessonData.studentId) {
                    fetches.push(getStudentById(lessonData.studentId).then(setStudent).catch(() => null));
                }
                if (lessonData.songIds?.length > 0) {
                    fetches.push(
                        Promise.all(
                            lessonData.songIds.map((sid) =>
                                getSongById(sid)
                                    .then((song) => [sid, song])
                                    .catch(() => [sid, null])
                            )
                        ).then((entries) => {
                            const map = {};
                            entries.forEach(([sid, song]) => { if (song) map[sid] = song; });
                            setSongs(map);
                        })
                    );
                }
                return Promise.all(fetches);
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
            await addDocumentToLesson(id, doc.id);
            setDocuments((prev) => [...prev, doc]);
        } catch (err) {
            setError(err.message);
        }
        setDocQuery("");
        setDocPickerOpen(false);
    };

    const handleRemoveDocument = async (docId) => {
        try {
            await removeDocumentFromLesson(id, docId);
            setDocuments((prev) => prev.filter((d) => d.id !== docId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this lesson? This cannot be undone.")) return;
        try {
            await deleteLesson(id);
            navigate("/lessons");
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

    if (error || !lesson) {
        return (
            <Layout>
                <p className="p-6 text-sm text-red-600">{error ?? "Lesson not found."}</p>
            </Layout>
        );
    }

    console.log(songs);

    return (
        <Layout>
            <Breadcrumbs to="/lessons" label="Lessons" />
            <div className="panel max-w-2xl mx-auto flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold mt-1">{formatDate(lesson.date)}</h1>
                        <p className="text-sm text-gray-500 mt-0.5 capitalize">{lesson.instrument}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to={`/lessons/${id}/edit`}
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

                {/* Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</h2>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                            <dt className="text-gray-400">Date</dt>
                            <dd className="text-gray-800 font-medium">{formatDate(lesson.date)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Time</dt>
                            <dd className="text-gray-800 font-medium">{formatTime(lesson.time) || "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Instrument</dt>
                            <dd className="text-gray-800 font-medium capitalize">{lesson.instrument || "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Student</dt>
                            <dd className="font-medium">
                                {student ? (
                                    <Link to={`/students/${lesson.studentId}`} className="text-blue-600 hover:underline">
                                        {student.name}
                                    </Link>
                                ) : "—"}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Notes</h2>
                    {lesson.notes ? (
                        <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: lesson.notes }} />
                    ) : (
                        <p className="text-sm text-gray-400">No notes for this lesson.</p>
                    )}
                </div>

                {/* Songs */}
                {lesson.songIds?.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Songs</h2>
                        <ul className="flex flex-col gap-3">
                            {lesson.songIds.map((sid) => {
                                const song = songs[sid];
                                return (
                                    <li key={sid} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{song?.title ?? sid}</p>
                                            <p className="text-xs text-gray-500">{song?.artist ?? ""}</p>
                                        </div>
                                        {song && (
                                            <a
                                                href={`https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1DB954] rounded-full hover:bg-[#1aa34a] transition-colors"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                                </svg>
                                                Open in Spotify
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Documents */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-3">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Documents</h2>
                    {documents.length > 0 && (
                        <ul className="flex flex-col gap-1">
                            {documents.map((doc) => (
                                <li key={doc.id} className="flex items-center justify-between gap-2 px-3 py-2 bg-white rounded">
                                    
                                   <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3333339f"><path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>
                                   <a
                                        href={doc.pdfUrl ? `${doc.pdfUrl}` : undefined}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-medium truncate hover:underline"
                                    >
                                        {doc.title}
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
                    <div className="relative" ref={docPickerRef}>
                        <input
                            type="text"
                            className="input w-full"
                            placeholder="Add document..."
                            value={docQuery}
                            onChange={(e) => { setDocQuery(e.target.value); setDocPickerOpen(true); }}
                            onFocus={() => setDocPickerOpen(true)}
                        />
                        {docPickerOpen && (
                            <ul className="absolute z-10 w-full border rounded bg-white shadow max-h-48 overflow-y-auto mt-1">
                                {allDocuments
                                    .filter(
                                        (d) =>
                                            !documents.some((linked) => linked.id === d.id) &&
                                            d.title.toLowerCase().includes(docQuery.toLowerCase())
                                    )
                                    .map((doc) => (
                                        <li key={doc.id}>
                                            <button
                                                type="button"
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 truncate"
                                                onClick={() => handleAddDocument(doc)}
                                            >
                                                {doc.title}
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </Layout>
    );
}

