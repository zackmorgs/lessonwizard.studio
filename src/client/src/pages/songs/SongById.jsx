import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import TagPicker from "../../components/TagPicker";
import SongDocumentUpload from './../../components/SongDocumentAdder';
import StudentsPicker from "../../components/StudentsPicker";
import {
  getSongById,
  updateSong,
  deleteSong,
} from "../../services/songService";

import { getTrackAlbumArt } from "./../../services/spotifyService";

export default function SongById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [albumArt, setAlbumArt] = useState(null);

  useEffect(() => {
    getSongById(id)
      .then((data) => {
        setSong(data);
        setForm(data);
        console.log("Song data loaded:", data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!song?.spotifyTrackId) return;
    getTrackAlbumArt(song.spotifyTrackId)
      .then((art) => setAlbumArt(art.url))
      .catch((err) => console.error("Album art fetch failed:", err));
  }, [song?.spotifyTrackId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateSong(id, form);
      setSong(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${song.title}"? This cannot be undone.`)) return;
    try {
      await deleteSong(id);
      navigate("/songs");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="p-6 text-sm text-gray-500">Loading...</p>
      </Layout>
    );
  if (error || !song)
    return (
      <Layout>
        <p className="p-6 text-sm text-red-600">{error ?? "Song not found."}</p>
      </Layout>
    );

  return (
    <Layout>
      <Breadcrumbs to="/songs" label="Songs" />
      <div className="md:max-w-lg mx-auto">
        <header>
          <div className="panel">
            <div className="flex flex-row items-center gap-4 justify-between items-center md:justify-start">
              {albumArt && (
                <img
                  src={albumArt}
                  alt={`${song.title} album art`}
                  className="w-24 h-24 rounded shadow"
                />
              )}
              <div>
                <h1 className="h1 mt-1 text-4xl">{song.title}</h1>
                <p className="text-lg text-gray-500">{song.artist}</p>
              </div>
            </div>
          </div>
        </header>
        <section className="section">
          <div className="panel">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="label">Title</label>
                <input
                  name="title"
                  className="input"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">Artist</label>
                <input
                  name="artist"
                  className="input"
                  value={form.artist}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">Difficulty (0–10)</label>
                <input
                  name="difficulty"
                  type="number"
                  min="0"
                  max="10"
                  className="input"
                  value={form.difficulty}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">Spotify Track ID</label>
                <input
                  name="spotifyTrackId"
                  className="input"
                  value={form.spotifyTrackId ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 4iV5W9uYEdYUVa79Axb7Rh"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">PDF URL</label>
                <input
                  name="pdfUrl"
                  className="input"
                  value={form.pdfUrl ?? ""}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  name="isExplicit"
                  type="checkbox"
                  className="checkbox"
                  id="isExplicit"
                  checked={form.isExplicit}
                  onChange={handleChange}
                />
                <label htmlFor="isExplicit" className="label">
                  Explicit
                </label>
              </div>
              <div className="flex flex-col">
                  {!song.documentId ? (
                    <>
                      <div className="well well-info text-sm text-gray-500 text-center mb-4"><p>No document uploaded.</p></div>
                      <SongDocumentUpload
                        song={song}
                        onUploaded={(doc) => setSong((prev) => ({ ...prev, documentId: doc.id }))}
                      />
                    </>
                  ) : (
                    <Link
                      to={`/documents/${song.documentId}`}
                      className="btn btn-secondary w-full justify-center"
                    >
                      <img src="/assets/svg/icon-audio-file.svg" className="icon" />
                      <span className="btn-text">View Document</span>
                    </Link>
                  )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">Tags</label>
                <TagPicker
                  value={form.tagIds}
                  onChange={(tags) => setForm({ ...form, tagIds: tags })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <StudentsPicker
                  value={form.studentIds ?? []}
                  onChange={(ids) => setForm({ ...form, studentIds: ids })}
                />
              </div>
              <button type="button" onClick={handleDelete} className="btn btn-danger">
                <img
                  src="/assets/svg/icon-delete.svg"
                  alt="Delete"
                  className="icon"
                />
                <span className="btn-text">Delete</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
