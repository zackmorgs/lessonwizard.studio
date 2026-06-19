import React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";

import { getTags, renameTag, deleteTag } from "./../../services/tagService";
import { getSongsByTag } from "./../../services/songService";
import { getLessonsByTag } from "./../../services/lessonService";

import Layout from "./../../components/Layout";
import SongList from "./../../components/SongList";
import LessonList from "./../../components/LessonList";

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
      <div className="md:max-w-lg mx-auto">
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

      <SongList songList={songs} defaultOpen={true} />

      <LessonList lessons={lessons} />
      </div>
    </Layout>
  );
}
