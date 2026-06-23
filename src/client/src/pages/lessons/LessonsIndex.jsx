import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LessonList from "../../components/LessonList";

import Layout from "../../components/Layout";
import Breadcrumbs from "./../../components/Breadcrumbs";

import { useAuth } from "../../contexts/AuthContext";
import { getPertinentLessons } from "../../services/lessonService";

export default function LessonsIndex() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPertinentLessons()
      .then(setLessons)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Breadcrumbs to="/" label="Dashboard" />
      <header className="header">
        <div className="p-4 text-center">
          <h1 className="text-3xl font-semibold">Lessons</h1>
        </div>
      </header>
      <div className="md:max-w-md mx-auto">
        <header id="user_lessons">
          <div className="panel">
            <h2 className="h2">
              {user?.displayName
                ? `${user.displayName}'s Upcoming Lessons`
                : "Lessons"}
            </h2>
          </div>
        </header>
        <LessonList lessons={lessons} />
      </div>
    </Layout>
  );
}
