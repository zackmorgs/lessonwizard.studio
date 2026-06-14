import React, { useEffect, useState } from "react";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");

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
            onKeyDown={(e) => {
              console.log("Search query:", query);
            }}
          />
        </div>
      </div>
    </section>
  );
}
