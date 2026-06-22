import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "./../../components/Layout";
import Breadcrumbs from "./../../components/Breadcrumbs";
import TagPicker from "../../components/TagPicker";
import { createDocumentFromImages } from "../../services/documentService";

export default function AddDocumentsFromCamera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [form, setForm] = useState({ title: "", description: "", tagIds: [] });
  const [captures, setCaptures] = useState([]); // { file: File, preview: string }[]
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const startCamera = async (mode) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = mediaStream;
      setCameraActive(true);
    } catch {
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const preview = URL.createObjectURL(blob);
        setCaptures((prev) => [...prev, { file, preview }]);
      },
      "image/jpeg",
      0.92
    );
  };

  const removeCapture = (index) => {
    URL.revokeObjectURL(captures[index].preview);
    setCaptures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!captures.length) { setError("At least one photo is required."); return; }
    setError(null);
    setSubmitting(true);
    try {
      await createDocumentFromImages({ ...form, images: captures.map((c) => c.file) });
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
        <section className="section">
          <div className="panel">
            <h1 className="h1 mb-4 text-3xl mt-8">Add Document from Camera</h1>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label htmlFor="title" className="label">Title</label>
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
                <label htmlFor="description" className="label">Description</label>
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

              {/* Camera */}
              <div className="flex flex-col gap-2">
                <label className="label">Camera</label>

                {!cameraActive ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => startCamera()}
                  >
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                      <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z" />
                    </svg>
                    <span className="btn-text">Open Camera</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="relative rounded overflow-hidden bg-black aspect-video">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary flex-1"
                        onClick={handleCapture}
                      >
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                          <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z" />
                        </svg>
                        <span className="btn-text">Capture</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={stopCamera}
                      >
                        <span className="btn-text">Close</span>
                      </button>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <p className="text-sm text-red-600">{cameraError}</p>
                )}
              </div>

              {/* Captured photos */}
              {captures.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="label">
                    Captured Photos ({captures.length})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {captures.map((cap, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={cap.preview}
                          alt={`Capture ${i + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeCapture(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs leading-none opacity-80 hover:opacity-100"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />

              <button
                type="submit"
                className="btn btn-primary mt-2"
                disabled={submitting || !form.title || !captures.length}
              >
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
                <span className="btn-text">
                  {submitting ? "Saving…" : "Create Document"}
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
