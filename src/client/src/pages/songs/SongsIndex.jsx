import React, { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import SongList from "../../components/SongList";
import { getSongs } from "../../services/songService";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSongs()
      .then(setSongs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? songs.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist?.toLowerCase().includes(query.toLowerCase()),
      )
    : songs;

  return (
    <Layout>
      <div className="md:max-w-md mx-auto">
        <header>
          <div className="panel">
            <h1 className="h1">
              Songs ({filtered.length}
              {query.trim() ? ` of ${songs.length}` : ""})
            </h1>
          </div>
        </header>
        <section id="song_search">
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
                placeholder="Search songs..."
                className="input input-lg w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </section>
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : error ? (
          <p className="p-4 text-red-600">{error}</p>
        ) : (
          <SongList songList={filtered} defaultOpen={true} />
        )}
      </div>
    </Layout>
  );
}
