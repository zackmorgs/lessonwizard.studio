import React from "react";

import { getTags} from './../services/tagService';

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

export default function Tags() {
  const [tags, setTags] = React.useState([]);

  React.useEffect(() => {
    getTags().then(setTags).catch(() => {});
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
            Tags
          </h2>
        }
        defaultOpen={true}
      >
        <ul id="tag_list" className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag.id}>
              <Link to={`/tags/${tag.name}`} className="tag-link p-4">
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </Accordion>
    </section>
  );
}
