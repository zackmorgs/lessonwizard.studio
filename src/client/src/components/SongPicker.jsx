import React, { useState, useRef, useEffect } from "react";
import { searchTracks } from "../services/spotifyService";

export default function SongPicker({ value = null, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

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

  const selectTrack = (track) => {
    onChange(track);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  const clearTrack = () => {
    onChange(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setResults([]);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectTrack(results[activeIndex]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Song</label>

      {value?.name ? (
        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded bg-gray-50">
          {value.albumArtUrl && (
            <img
              src={value.albumArtUrl}
              alt=""
              className="w-10 h-10 rounded object-cover shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-gray-500 truncate">{value.artist}</p>
          </div>
          {value.previewUrl && (
            <audio controls src={value.previewUrl} className="h-8 shrink-0" />
          )}
          <button
            type="button"
            onClick={clearTrack}
            className="text-gray-400 hover:text-red-500 shrink-0"
            aria-label="Remove song"
          >
            &times;
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Spotify..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setResults([]), 150)}
            autoComplete="off"
            className="input w-full"
          />

          {(loading || results.length > 0) && (
            <ul className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-72 overflow-y-auto">
              {loading && (
                <li className="px-3 py-2 text-sm text-gray-400">
                  Searching...
                </li>
              )}
              {!loading &&
                results.map((track, idx) => (
                  <li
                    key={track.id}
                    onMouseDown={() => selectTrack(track)}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                      idx === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={track.albumArtUrl}
                      alt=""
                      className="w-8 h-8 rounded object-cover shrink-0"11
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {track.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {track.artist} &mdash; {track.album}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
