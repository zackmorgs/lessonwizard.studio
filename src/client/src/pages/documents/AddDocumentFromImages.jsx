import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import Breadcrumbs from './../../components/Breadcrumbs';

import TagPicker from "../../components/TagPicker";
import { createDocumentFromImages } from "../../services/documentService";

export default function NewDocument() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [form, setForm] = useState({ title: "", description: "", tagIds: [] });
  const [images, setImages] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // object URL strings
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!valid.length) return;
    setImages((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!images.length) { setError("At least one image is required."); return; }
    setError(null);
    setSubmitting(true);
    try {
      await createDocumentFromImages({ ...form, images });
      navigate("/documents");
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Breadcrumbs to="/documents" label="Documents" />
      <div className="md:max-w-lg mx-auto">
        <section id="new_document" className="section">
          <div className="panel">
            <h1 className="h1 mb-4 text-3xl mt-8">Add Document from Images</h1>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="input"
                  placeholder="e.g. Pentatonic Scale Chart"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="input"
                  rows={3}
                  placeholder="Brief description of this document..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {/* Tags */}
              <TagPicker
                value={form.tagIds}
                onChange={(tagIds) => setForm({ ...form, tagIds })}
              />

              {/* Image drop zone */}
              <div className="flex flex-col gap-1">
                <label>Images</label>
                <div
                  className="file-upload"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => inputRef.current?.click()}
                >
                  <p className="text-sm text-gray-500">
                    Drag &amp; drop images here, or click to select
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <ul className="grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <li key={src} className="relative group">
                      <img
                        src={src}
                        alt={`Page ${i + 1}`}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs rounded px-1">
                        {i + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Creating…" : "Create Document"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/documents")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}