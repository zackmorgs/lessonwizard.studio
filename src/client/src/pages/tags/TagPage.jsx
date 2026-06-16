import React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { getSongsByTag } from "./../../services/songService";
import { getLessonsByTag } from "./../../services/lessonService";

import Layout from "./../../components/Layout";

export default function TagPage() {
  const { name } = useParams();

  const [songs, setSongs] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    getSongsByTag(name).then((data) => setSongs(data ?? [])).catch(() => {});
  }, [name]);
  
  useEffect(() => {
    getLessonsByTag(name).then((data) => setLessons(data ?? [])).catch(() => {});
  }, [name]);

  return (
    <Layout>
      <header>
        <div className="p-4">
          <h1>#{name}</h1>
        </div>
      </header>
      <section id="tagged_songs" className="section">
        <div className="panel">
          <h2 className="h2">Songs with tag:</h2>
          {songs?.length === 0 ? (
            <p>None.</p>
          ) : (
            <ul>
              {songs.map((song) => (
                <li key={song.id}>{song.title}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section id="tagged_lessons">
        <div className="panel">
          <h2 className="h2">Lessons with tag:</h2>
          {lessons?.length === 0 ? (
            <p>None.</p>
          ) : (
            <ul>
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  {new Date(lesson.date).toLocaleDateString()} — {lesson.instrument}
                </li>
              ))}
            </ul>
          )} 
        </div>
      </section>
    </Layout>
  );
}
