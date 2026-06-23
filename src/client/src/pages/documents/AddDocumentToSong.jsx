import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";

import { getSongs } from "../../services/songService";
import { uploadSongPdf } from "../../services/documentService";

export default function AddDocumentToSong() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSongs()
      .then(setSongs)
      .catch(() => setError("Failed to load songs."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.artist?.toLowerCase().includes(query.toLowerCase())
      )
    : songs;

  const handleFile = (files) => {
    const pdf = Array.from(files).find((f) => f.type === "application/pdf");
    if (pdf) setPdfFile(pdf);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSong) { setError("Please select a song."); return; }
    if (!pdfFile) { setError("Please attach a PDF."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const renamed = new File(
        [pdfFile],
        `${selectedSong.title} - ${selectedSong.artist}.pdf`,
        { type: pdfFile.type }
      );
      await uploadSongPdf(selectedSong.id, renamed);
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
      <div id="add_document_to_song" className="md:max-w-lg mx-auto">
        <section className="section">
          <div className="panel">
            <h1 className="h1 mb-4 text-3xl mt-8">Add PDF to Song</h1>

            {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Song picker */}
              <div className="flex flex-col gap-2">
                <label className="label">Song</label>

                {selectedSong ? (
                  <div className="flex items-center gap-3 p-3">
                    {selectedSong.albumArtUrl && (
                      <img
                        src={selectedSong.albumArtUrl}
                        alt={selectedSong.title}
                        className="w-10 h-10 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedSong.title}</p>
                      <p className="text-sm text-gray-500 truncate">{selectedSong.artist}</p>
                    </div>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 text-lg leading-none shrink-0"
                      onClick={() => setSelectedSong(null)}
                      title="Change song"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      className="input"
                      placeholder="Search songs..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      autoFocus
                    />
                    {loading ? (
                      <p className="text-sm text-gray-400 px-1">Loading songs…</p>
                    ) : (
                      <ul id="add_pdf_song_list" className="rounded max-h-56 overflow-y-auto">
                        {filtered.length === 0 && (
                          <li className="px-3 py-2 text-sm text-gray-400">No songs found.</li>
                        )}
                        {filtered.map((song) => {
                          const hasDoc = !!song.documentId;
                          return (
                            <li key={song.id} className="song-item">
                              <button
                                type="button"
                                disabled={hasDoc}
                                className={`pdf-song-btn bg-white w-full flex items-center gap-3 px-3 py-2 text-left ${hasDoc ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
                                onClick={() => { if (!hasDoc) { setSelectedSong(song); setQuery(""); } }}
                              >
                                {song.albumArtUrl ? (
                                  <img
                                    src={song.albumArtUrl}
                                    alt={song.title}
                                    className="w-8 h-8 rounded object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-gray-200 shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate">{song.title}</p>
                                  <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                                </div>
                                {hasDoc && (
                                  <span className="shrink-0 text-xs text-gray-400 italic">Has document</span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* PDF upload */}
              <div className="flex flex-col gap-1">
                <label className="label">PDF File</label>
                <div
                  className="file-upload"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => inputRef.current?.click()}
                >
                  {pdfFile ? (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="icon shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                        <path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                      </svg>
                      <span className="truncate font-medium">{pdfFile.name}</span>
                      <button
                        type="button"
                        className="ml-auto text-gray-400 hover:text-red-500 shrink-0"
                        onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {selectedSong
                        ? `Drag the PDF for "${selectedSong.title}" here, or click to select`
                        : "Drag a PDF here, or click to select"}
                    </p>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-2"
                disabled={submitting || !selectedSong || !pdfFile}
              >
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                </svg>
                <span className="btn-text">
                  {submitting ? "Uploading…" : "Upload PDF"}
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
