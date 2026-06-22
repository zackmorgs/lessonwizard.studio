import React, { useState, useRef, useEffect } from "react";
import { searchTracks } from "../services/spotifyService";

export default function SongPicker({ value = [], onChange, onDocumentSelected }) {
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pendingFiles, setPendingFiles] = useState({});
  const debounceRef  = useRef(null);
  const inputRef     = useRef(null);
  const fileInputRef = useRef(null);
  const activeTrackRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeTrackRef.current) return;
    const track = activeTrackRef.current;
    setPendingFiles((prev) => ({ ...prev, [track.id]: file }));
    onDocumentSelected?.(track, file);
    e.target.value = "";
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) { setResults([]); return; }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const tracks = await searchTracks(trimmed);
        setResults(tracks);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const addTrack = (track) => {
    if (value.some((t) => t.id === track.id)) return;
    onChange([...value, track]);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const removeTrack = (id) => {
    onChange(value.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Escape") { setResults([]); setActiveIndex(-1); }
    else if (e.key === "Enter" && activeIndex >= 0) { e.preventDefault(); addTrack(results[activeIndex]); }
  };

  console.log({ query, results, loading, activeIndex });

  return (
    <div id="songs_picker" className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Songs</label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Spotify..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setResults([]), 150)}
          autoComplete="off"
          className="input w-full"
        />

        {(loading || results.length > 0) && (
          <ul className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-72 overflow-y-auto">
            {loading && (
              <li className="px-3 py-2 text-sm text-gray-400">Searching...</li>
            )}
            {!loading && results.map((track, idx) => (
              <li
                key={track.id}
                onMouseDown={() => addTrack(track)}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                  idx === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <img src={track.albumArtUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{track.name}</p>
                  <p className="text-xs text-gray-500 truncate">{track.artist} &mdash; {track.album}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {value.length > 0 && (
        <ul id="songpicker_list" className="flex flex-col gap-2">
          {value.map((track) => (
            <li key={track.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded bg-gray-50">
              {track.albumArtUrl && (
                <img src={track.albumArtUrl} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                {pendingFiles[track.id] && (
                  <p className="text-xs text-green-600 truncate">📎 {pendingFiles[track.id].name}</p>
                )}
              </div>
              {track.previewUrl && (
                <audio controls src={track.previewUrl} className="h-8 shrink-0" />
              )}
              <button
                type="button"
                onClick={() => { activeTrackRef.current = track; fileInputRef.current?.click(); }}
                className="text-gray-400 hover:text-blue-500 shrink-0"
                title="Attach PDF"
                aria-label={`Attach document to ${track.name}`}
              >
                <img src="/assets/svg/icon-attach-plus.svg" alt="" className="icon" />
              </button>
              <button
                type="button"
                onClick={() => removeTrack(track.id)}
                className="text-gray-400 hover:text-red-500 shrink-0"
                aria-label={`Remove ${track.name}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
