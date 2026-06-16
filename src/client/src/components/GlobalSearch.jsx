import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { getTrackAlbumArt } from "../services/spotifyService";

const TYPE_ROUTES = {
  student: (id) => `/students/${id}`,
  song: (id) => `/songs/${id}`,
  tag: (id, title) => `/tags/${title.replace(/^#/, "")}`,
  lesson: (id) => `/lessons/${id}`,
};

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [albumArtMap, setAlbumArtMap] = useState({});
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setAlbumArtMap({}); return; }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => []);
        const list = Array.isArray(data) ? data : [];
        setResults(list);

        // Fetch album art for song results that have a spotifyTrackId
        list.forEach((result) => {
          if (result.type === "song" && result.spotifyTrackId) {
            getTrackAlbumArt(result.spotifyTrackId)
              .then((art) => setAlbumArtMap((prev) => ({ ...prev, [result.id]: art.url })))
              .catch(() => {});
          }
        });
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <section id="search">
      <div className="panel">
        <div className="form-group relative">
          <img
            src="/assets/svg/icon-search.svg"
            alt="Search Icon"
            className="search-icon absolute left-4 top-4 bottom-4"
          />
          <input
            id="global_search"
            type="text"
            placeholder="Search students, lessons, songs, etc."
            className="input input-lg w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {query.trim() && (
          <div className="mt-2">
            {loading && <p className="text-sm text-gray-400 p-2">Searching...</p>}
            {!loading && results.length === 0 && (
              <p className="text-sm text-gray-400 p-2">No results for "{query}"</p>
            )}
            {!loading && results.length > 0 && (
              <ul className="flex flex-col">
                {results.map((result) => (
                  <li key={`${result.type}-${result.id}`}>
                    <Link
                      to={TYPE_ROUTES[result.type]?.(result.id, result.title) ?? "/"}
                      className="flex items-center justify-between p-2 hover:bg-white/5 rounded"
                      onClick={() => setQuery("")}
                    >
                      <div className="flex items-center gap-3">
                        {result.type === "song" && (
                          <img
                            src={albumArtMap[result.id] || "/assets/svg/icon-music-note.svg"}
                            alt=""
                            className="w-8 h-8 rounded object-cover shrink-0"
                          />
                        )}
                        <span>{result.title}</span>
                      </div>
                      <span className="tag-link text-xs px-2 py-0.5 ml-2">{result.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
