import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LessonList from "../../components/LessonList";

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
            <LessonList lessons={lessons} />
        </Layout>
    );
}

