import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout";

import { getLessonById, deleteLesson } from "../../services/lessonService";
import { getStudentById } from "../../services/studentService";
import { getSongById } from "../../services/songService";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getLessonById(id)
            .then((lessonData) => {
                setLesson(lessonData);
                const fetches = [];
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
            <div className="panel max-w-2xl mx-auto flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link to="/lessons" className="text-sm text-blue-600 hover:underline">&larr; All Lessons</Link>
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

            </div>
        </Layout>
    );
}

