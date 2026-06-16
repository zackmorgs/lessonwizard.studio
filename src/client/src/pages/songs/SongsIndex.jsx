import React, { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import SongList from "../../components/SongList";
import { getSongs } from "../../services/songService";

export default function Songs() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSongs()
            .then(setSongs)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <header>
                <div className="panel">
                    <h1 className="h1">Songs ({songs.length})</h1>
                </div>
            </header>
            {loading ? (
                <p className="p-4">Loading...</p>
            ) : error ? (
                <p className="p-4 text-red-600">{error}</p>
            ) : (
                <SongList songList={songs} defaultOpen={true} />
            )}
        </Layout>
    );
}

