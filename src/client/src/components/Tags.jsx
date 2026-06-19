import React from "react";

import { getTags, getTagCounts } from './../services/tagService';

import {Link} from 'react-router'

import Accordion from "./Accordion";

// const tags = [
//   {
//     id: 1,
//     name: "fingerstyle",
//   },
//   {
//     id: 2,
//     name: "acoustic",
//   },
//   {
//     id: 3,
//     name: "rock",
//   },
//   {
//     id: 4,
//     name: "metal",
//   },
//   {
//     id: 5,
//     name: "pop",
//   },
//   {
//     id: 6,
//     name: "jazz",
//   },
//   {
//     id: 7,
//     name: "open-chords",
//   },
//   {
//     id: 8,
//     name: "sweep-picking",
//   },
//     {
//     id: 9,
//     name: "barre-chords",
//   }
// ];

export default function Tags({ defaultOpen = false }) {
  const [tags, setTags] = React.useState([]);
  const [counts, setCounts] = React.useState({});

  React.useEffect(() => {
    getTags().then(setTags).catch(() => {});
    getTagCounts().then(setCounts).catch(() => {});
  }, []);

  return (
    <section id="tags" className="section">
      <Accordion
        title={
          <h2 className="h2 flex flex-row">
            <img
              src="/assets/svg/icon-hashtag.svg"
              alt="Tags"
              className="mr-4"
            />
            Tags{tags.length > 0 && <> (<Link to="/tags" className="lesson-count" onClick={(e) => e.stopPropagation()}>{tags.length}</Link>)</>}
          </h2>
        }
        defaultOpen={defaultOpen}
      >
        <ul id="tag_list" className="flex flex-wrap gap-2 md:w-max-md">
          {tags.length === 0 ? (
            <div className="well well-info text-center"><p>No tags found.</p></div>
          ) : (
            [...tags]
            .sort((a, b) => {
              const diff = (counts[b.name] ?? 0) - (counts[a.name] ?? 0);
              return diff !== 0 ? diff : a.name.localeCompare(b.name);
            })
            .map((tag) => (
            <li key={tag.id}>
              <Link to={`/tags/${tag.name}`} className="tag-link p-4 flex flex-row items-center relative">
                {tag.name}
                {counts[tag.name] !== undefined && (
                  <span className="tag-count">{counts[tag.name]}</span>
                )}
              </Link>
            </li>
            )))}
        </ul>
      </Accordion>
    </section>
  );
}
