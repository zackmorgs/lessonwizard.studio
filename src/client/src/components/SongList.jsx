import React, { useEffect } from "react";

import { getTrackAlbumArt } from "./../services/spotifyService";

import { Link } from "react-router";
import Accordion from "../components/Accordion";

export default function SongList({ songList, defaultOpen = false }) {
  let [songAlbumArt, setSongAlbumArt] = React.useState([]);

  useEffect(() => {
    songList.forEach(async (song) => {
      if (song.spotifyTrackId) {
        const albumArt = await getTrackAlbumArt(song.spotifyTrackId);
        setSongAlbumArt((prev) => ({ ...prev, [song.id]: albumArt.url }));
      }
    });
  }, [songList]);

  return (
    <section id="song-list" className="section">
      <Accordion
        defaultOpen={defaultOpen}
        title={
          <h2 className="h2 flex flex-row items-center">
            <img
              src="/assets/svg/icon-music-note.svg"
              alt="Today's Lessons"
              className="mr-4"
            />
            Songs{(songList?.length ?? 0) > 0 && <> (<Link to="/songs" className="lesson-count" onClick={(e) => e.stopPropagation()}>{songList.length}</Link>)</>}
          </h2>
        }
      >
        {songList?.length > 0 ? (
          <ul>
            {songList.map((song, index) => (
              <li key={song.id}>
                <Link to={`/songs/${song.id}`}>
                  <div className="flex flex-row">
                    <img src={songAlbumArt[song.id] || "/assets/svg/icon-music-note.svg"} alt={song.title} className="mr-4" />
                    {song.title}
                    {song.artist ? ` — ${song.artist}` : ""}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="well well-info text-center">
            <p>No songs available.</p>
          </div>
        )}
        <Link to="/songs/new" className="btn btn-success mt-4">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            height="1.5rem"
            viewBox="0 -960 960 960"
            width="1.5rem"
            fill="#e3e3e3"
          >
            <path d="M367-167q-47-47-47-113t47-113q47-47 113-47 23 0 42.5 5.5T560-418v-422h240v160H640v400q0 66-47 113t-113 47q-66 0-113-47Zm-87-353v-120H160v-80h120v-120h80v120h120v80H360v120h-80Z" />
          </svg>
          <span className="btn-text">New Song</span>
        </Link>
      </Accordion>
    </section>
  );
}
