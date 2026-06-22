import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import SongPicker from "../../components/SongPicker";
import TagPicker from "../../components/TagPicker";
import { createSong } from "../../services/songService";

export default function NewSong() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", artist: "", tagIds: [] });
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isOnSpotify, setIsOnSpotify] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleChange = (e) => {
    setHasError(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasError(false);

    let result;
    try {
      result = await createSong(form);
    } catch (error) {
      console.log("error:1337", error);

      if (typeof request === "undefined") {
        setHasError(true);
      }

      console.log("result: ", result);
      // setErrorMessage("Song already exists.");
      return;
    }

    navigate("/songs");
  };

  return (
    <Layout>
      {hasError && (
        <div className="error-msg md:max-w-md mx-auto pt-4">
          <div className="well well-info mx-4">
            <p className="text-red-500 text-center">There was an error creating this song. </p>
            <p className="text-red-500 text-center">Is it already in the database?</p>
          </div>
        </div>
      )}
      <div id="new_song_container" className="md:max-w-md mx-auto">
        <header>
          <div className="panel">
            <h1 className="h1">New Song</h1>
          </div>
        </header>
        <section id="is_on_spotify">
          <div className="panel">
            <div className="form-group text-center well">
              <input
                type="checkbox"
                id="is_on_spotify"
                className="checkbox"
                name="is_on_spotify"
                checked={isOnSpotify}
                onChange={(e) => setIsOnSpotify(e.target.checked)}
              />
              <label htmlFor="is_on_spotify" className="label ml-2">
                Is on Spotify
              </label>
            </div>
          </div>
        </section>
        <section id="new_song">
          <div className="panel">
            <form onSubmit={handleSubmit}>
              {isOnSpotify ? (
                <SongPicker
                  value={selectedTrack}
                  onChange={(track) => {
                    setSelectedTrack(track);
                    setForm({
                      ...form,
                      title: track?.name ?? "",
                      artist: track?.artist ?? "",
                      spotifyTrackId: track?.id ?? "",
                      albumArtUrl: track?.albumArtUrl ?? "",
                      isExplicit: track?.isExplicit ?? false,
                    });
                  }}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="label">
                      Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="input"
                      placeholder="Song title..."
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="artist" className="label">
                      Artist
                    </label>
                    <input
                      id="artist"
                      name="artist"
                      type="text"
                      className="input"
                      placeholder="Artist name..."
                      value={form.artist}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              <div className="form-group flex flex-col mt-4">
                <label htmlFor="tags" className="label">
                  Tags
                </label>
                <TagPicker
                  value={form.tagIds}
                  onChange={(tags) => setForm({ ...form, tagIds: tags })}
                />
              </div>
              <div className="hidden form-group">
                <label htmlFor="albumArtUrl" className="label">
                  Album Art URL
                </label>
                <input
                  id="albumArtUrl"
                  name="albumArtUrl"
                  type="text"
                  className="input"
                  placeholder="Album art URL..."
                  value={form.albumArtUrl}
                  onChange={handleChange}
                />
              </div>
              <button
                id="create_song_button"
                type="submit"
                className="btn btn-primary mt-4"
                disabled={ hasError  || !form.title || !form.artist}
              >
                <svg
                  className="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="M367-167q-47-47-47-113t47-113q47-47 113-47 23 0 42.5 5.5T560-418v-422h240v160H640v400q0 66-47 113t-113 47q-66 0-113-47Zm-87-353v-120H160v-80h120v-120h80v120h120v80H360v120h-80Z" />
                </svg>
                <span className="btn-text">Create Song</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
