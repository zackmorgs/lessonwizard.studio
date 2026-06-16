import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout";
import TagPicker from "../../components/TagPicker";
import { getSongById, updateSong, deleteSong } from "../../services/songService";

export default function SongById() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [song, setSong] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getSongById(id)
            .then((data) => {
                setSong(data);
                setForm(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

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

    if (loading) return <Layout><p className="p-6 text-sm text-gray-500">Loading...</p></Layout>;
    if (error || !song) return <Layout><p className="p-6 text-sm text-red-600">{error ?? "Song not found."}</p></Layout>;

    return (
        <Layout>
            <header>
                <div className="panel flex items-center justify-between">
                    <div>
                        <Link to="/songs" className="text-sm text-blue-600 hover:underline">&larr; All Songs</Link>
                        <h1 className="h1 mt-1">{song.title}</h1>
                        <p className="text-sm text-gray-500">{song.artist}</p>
                    </div>
                    <button onClick={handleDelete} className="btn btn-danger">
                        Delete
                    </button>
                </div>
            </header>
            <section className="section">
                <div className="panel">
                    <form onSubmit={handleSave} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="label">Title</label>
                            <input name="title" className="input" value={form.title} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="label">Artist</label>
                            <input name="artist" className="input" value={form.artist} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="label">Difficulty (0–10)</label>
                            <input name="difficulty" type="number" min="0" max="10" className="input" value={form.difficulty} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="label">Tuning</label>
                            <input name="tuning" className="input" value={form.tuning ?? ""} onChange={handleChange} placeholder="e.g. Standard, Drop D..." />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="label">PDF URL</label>
                            <input name="pdfUrl" className="input" value={form.pdfUrl ?? ""} onChange={handleChange} placeholder="https://..." />
                        </div>
                        <div className="flex items-center gap-2">
                            <input name="isExplicit" type="checkbox" className="checkbox" id="isExplicit" checked={form.isExplicit} onChange={handleChange} />
                            <label htmlFor="isExplicit" className="label">Explicit</label>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="label">Tags</label>
                            <TagPicker value={form.tagIds} onChange={(tags) => setForm({ ...form, tagIds: tags })} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
}

