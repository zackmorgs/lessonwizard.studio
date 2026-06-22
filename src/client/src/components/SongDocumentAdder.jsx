import React, { useState, useRef } from "react";
import { uploadSongPdf } from "../services/documentService";

export default function SongDocumentAdder({ song = {}, onUploaded }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (files) => {
    const pdf = Array.from(files).find((f) => f.type === "application/pdf");
    if (!pdf) { setError("Please select a PDF file."); return; }
    setError(null);
    setUploading(true);
    try {
      const doc = await uploadSongPdf(song.id, pdf);
      onUploaded?.(doc);
    } catch (err) {
      setError(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="file-upload cursor-pointer"
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      >
        <img src="/assets/svg/icon-file-upload.svg" className="mx-auto icon mb-2" alt="" />
        <p className="text-sm text-gray-500 text-center">
          {uploading
            ? "Uploading…"
            : `Drop a PDF for "${song.title}" here, or click to browse`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
