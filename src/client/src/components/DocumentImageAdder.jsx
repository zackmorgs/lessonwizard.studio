import React, { useState, useEffect, useRef } from "react";

// import { getDocuments } from "../services/documentService";
import { createDocumentFromImages } from "./../services/documentService";

export default function DocumentAdder({ song = {}, hasSelection = () => {} }) {
  const [allDocs, setAllDocs] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const inputRef = useRef(null);
  const [form, setForm] = useState({ title: "", description: "", tagIds: [] });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    // getDocuments()
    //   .then(setAllDocs)
    //   .catch(() => {});
  }, []);

  useEffect(() => {
    const q = input.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }
    setSuggestions(
      allDocs.filter(
        (d) => d.title.toLowerCase().includes(q) && !value.includes(d.id),
      ),
    );
  }, [input, allDocs, song]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);

    console.log("DocumentAdder mounted:", song);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addDoc = (doc) => {
    onChange([...value, doc.id]);
    hasSelection(true);
    setInput("");
    setSuggestions([]);
    setOpen(false);
  };

  const removeDoc = (id) => {
    onChange(value.filter((v) => v !== id));
    if (value.length === 1) {
      hasSelection(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("application/pdf"));
    if (!valid.length) return;
    setImages((prev) => [...prev, ...valid]);
    setPreviews((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!images.length) {
      setError("At least one image is required.");
      return;
    }
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

  const selectedDocs = allDocs.filter((d) => value.includes(d.id));

  return (
    <div id="document_adder" className="flex flex-col gap-2" ref={containerRef}>
      {/* <label className="text-sm font-medium text-gray-700">Documents</label> */}
      {/* Image drop zone */}
      <div className="flex flex-col gap-1">
        <label>PDF Upload</label>
        <div
          className="file-upload"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          {song.name != "" ? (
            <>
              <p className="text-sm text-gray-500">
                Drag the PDF file for "<b>{song.name}</b>" here..
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </>
          ) : (
            <p>No song selected.</p>
          )}
        </div>
      </div>

      {/* Selected */}
      {selectedDocs.length > 0 && (
        <ul className="flex flex-col gap-1">
          {selectedDocs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-2 px-3 py-2 border border-gray-200 rounded bg-gray-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{doc.title}</p>
                {doc.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {doc.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                className="text-gray-400 hover:text-red-500 shrink-0"
                aria-label={`Remove ${doc.title}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Search input */}
      <div className="relative">
        {/* <input
          type="text"
          placeholder="Search documents..."
          className="input w-full"
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        /> */}

        {/* {open && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto">
            {suggestions.map((doc) => (
              <li
                key={doc.id}
                onMouseDown={() => addDoc(doc)}
                className="flex flex-col px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <span className="text-sm font-medium">{doc.title}</span>
                {doc.description && (
                  <span className="text-xs text-gray-500 truncate">{doc.description}</span>
                )}
              </li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
}
