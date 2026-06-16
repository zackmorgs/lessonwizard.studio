import React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";

import { getTags, renameTag, deleteTag } from "./../../services/tagService";
import { getSongsByTag } from "./../../services/songService";
import { getLessonsByTag } from "./../../services/lessonService";

import Layout from "./../../components/Layout";

export default function TagPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [tag, setTag] = useState(null);
  const [songs, setSongs] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getTags().then((tags) => {
      const found = tags.find((t) => t.name === name);
      setTag(found ?? null);
      setNewName(found?.name ?? "");
    }).catch(() => {});
    getSongsByTag(name).then((data) => setSongs(data ?? [])).catch(() => {});
    getLessonsByTag(name).then((data) => setLessons(data ?? [])).catch(() => {});
  }, [name]);

  const handleRename = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !tag) return;
    try {
      await renameTag(tag.id, newName.trim());
      setRenaming(false);
      navigate(`/tags/${newName.trim()}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!tag) return;
    if (!confirm(`Delete tag "#${tag.name}"? This cannot be undone.`)) return;
    try {
      await deleteTag(tag.id);
      navigate("/tags");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <header>
        <div className="panel">
          <div>
            <Link to="/tags" className="text-sm text-blue-600 hover:underline flex flex-row">
              <img src="/assets/svg/icon-arrow-left.svg" alt="All Tags" className="icon" />
              <span className="link-text">All Tags</span>
            </Link>
            {renaming ? (
              <form onSubmit={handleRename} className="flex gap-2 mt-2">
                <input
                  className="input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary"><span className="btn-text">
                  Save</span></button>
                <button type="button" className="btn btn-grey" onClick={() => setRenaming(false)}>Cancel</button>
              </form>
            ) : (
              <h1 className="h1 text-4xl mb-4">#{name}</h1>
            )}
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex gap-4">
            {!renaming && (
              <button className="btn btn-grey" onClick={() => setRenaming(true)}>
                <img src="/assets/svg/icon-edit-pen.svg" alt="Rename"className="icon"  />
                <span className="btn-text">Rename</span>
              </button>
            )}
            <button className="btn btn-danger" onClick={handleDelete}>
              <img src="/assets/svg/icon-delete.svg" alt="Delete" className="icon" />
              <span className="btn-text">Delete</span>
            </button>
          </div>
        </div>
      </header>

      <section id="tagged_songs" className="section">
        <div className="panel">
          <h2 className="h2 mb-3">Songs ({songs.length})</h2>
          {songs.length === 0 ? (
            <div className="well well-info"><p>No songs with this tag.</p></div>
          ) : (
            <ul className="flex flex-col gap-2">
              {songs.map((song) => (
                <li key={song.id}>
                  <Link to={`/songs/${song.id}`} className="hover:underline">
                    {song.title}{song.artist ? ` — ${song.artist}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="tagged_lessons" className="section">
        <div className="panel">
          <h2 className="h2 mb-3">Lessons ({lessons.length})</h2>
          {lessons.length === 0 ? (
            <div className="well well-info"><p>No lessons with this tag.</p></div>
          ) : (
            <ul className="flex flex-col gap-2">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link to={`/lessons/${lesson.id}`} className="hover:underline">
                    {new Date(lesson.date).toLocaleDateString()} — {lesson.instrument}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Layout>
  );
}
