import React from "react";
import { Link } from "react-router-dom";
import Accordion from "./Accordion";

let documents = [
  {
    id: 1,
    title: "Pentatonic Scale Chart",
    description: "Major and minor pentatonic scale patterns across all 5 positions on the fretboard.",
  },
  {
    id: 2,
    title: "Circle of Fifths",
    description: "Full-color reference sheet showing key signatures, relative minors, and chord relationships.",
  },
  {
    id: 3,
    title: "Beginner Chord Diagrams",
    description: "Open chord shapes for G, C, D, E, A, Am, Em — essential first chords for new students.",
  },
  {
    id: 4,
    title: "Barre Chord Shapes",
    description: "E-shape and A-shape major and minor barre chords with finger placement guides.",
  },
  {
    id: 5,
    title: "Sight Reading: Grade 1",
    description: "10 short exercises in 4/4 and 3/4 time using quarter, half, and whole notes.",
  },
  {
    id: 6,
    title: "Blues Scale & Licks",
    description: "Blues scale in the key of A with 8 classic lick patterns and suggested fingerings.",
  },
  {
    id: 7,
    title: "Rhythm Notation Worksheet",
    description: "Fill-in exercises covering quarter, eighth, sixteenth, and dotted rhythms.",
  },
  {
    id: 8,
    title: "Fingerpicking Patterns",
    description: "Travis-picking and arpeggio patterns in 4/4, with notation and tab for both hands.",
  },
  {
    id: 9,
    title: "Music Theory: Intervals",
    description: "Reference guide covering major, minor, perfect, augmented, and diminished intervals with ear-training tips.",
  },
];

export default function DocumentsList({ defaultOpen = false }) {
  return (
    <section id="documents_list_container" className="section">
      <Accordion
        defaultOpen={defaultOpen}
        title={
          <h2 className="h2 flex flex-row items-center">
            <img
              src="/assets/svg/icon-audio-file.svg"
              alt="Documents"
              className="mr-4"
            />
            Documents
            {documents.length > 0 && (
              <>
                {" "}
                (
                <Link
                  to="/documents"
                  className="lesson-count"
                  onClick={(e) => e.stopPropagation()}
                >
                  {documents.length}
                </Link>
                )
              </>
            )}
          </h2>
        }
      >
        {documents.length > 0 ? (
          <div className="scrollable max-h-100">
            <ul id="documents_list" className="grid grid-cols-2 gap-4">
              {documents.map((document) => (
                <li key={document.id} className="document-item">
                  <Link
                    to={`/documents/${document.id}`}
                    className="document-link p-4 flex flex-col items-center justify-center"
                  >
                    <img
                      src="/assets/svg/icon-audio-file.svg"
                      alt="Audio File Icon"
                      className="icon w-full"
                    />
                    <b className="text-xs text-center">{document.title}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="well well-info text-center">
            <p>No documents available.</p>
          </div>
        )}
      </Accordion>
    </section>
  );
}
