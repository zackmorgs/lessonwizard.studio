import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { getLessons } from "../../services/lessonService";

export default function Lessons() {
    const { user } = useAuth();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getLessons()
            .then(setLessons)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <header id="user_lessons">
                <div className="panel">
                    <h2 className="h2">{user?.displayName ? `${user.displayName}'s Lessons (${lessons.length})` : "Lessons"}</h2>
                </div>
            </header>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : lessons.length === 0 ? (
                <p>No lessons found.</p>
            ) : (
                <ul>
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>
                            <Link to={`/lessons/${lesson.id}`}>
                                {lesson.date ? new Date(lesson.date).toLocaleDateString() : "No date"} — {lesson.instrument || "Unknown instrument"}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </Layout>
    );
}

