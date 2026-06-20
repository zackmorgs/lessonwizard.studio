import React from "react";
import { Link } from "react-router-dom";
import Accordion from "./Accordion";

let documents = [
  {
    id: 1,
    title: "Pentatonic Scale Chart",
    description:
      "Major and minor pentatonic scale patterns across all 5 positions on the fretboard.",
  },
  {
    id: 2,
    title: "Circle of Fifths",
    description:
      "Full-color reference sheet showing key signatures, relative minors, and chord relationships.",
  },
  {
    id: 3,
    title: "Beginner Chord Diagrams",
    description:
      "Open chord shapes for G, C, D, E, A, Am, Em — essential first chords for new students.",
  },
  {
    id: 4,
    title: "Barre Chord Shapes",
    description:
      "E-shape and A-shape major and minor barre chords with finger placement guides.",
  },
  {
    id: 5,
    title: "Sight Reading: Grade 1",
    description:
      "10 short exercises in 4/4 and 3/4 time using quarter, half, and whole notes.",
  },
  {
    id: 6,
    title: "Blues Scale & Licks",
    description:
      "Blues scale in the key of A with 8 classic lick patterns and suggested fingerings.",
  },
  {
    id: 7,
    title: "Rhythm Notation Worksheet",
    description:
      "Fill-in exercises covering quarter, eighth, sixteenth, and dotted rhythms.",
  },
  {
    id: 8,
    title: "Fingerpicking Patterns",
    description:
      "Travis-picking and arpeggio patterns in 4/4, with notation and tab for both hands.",
  },
  {
    id: 9,
    title: "Music Theory: Intervals",
    description:
      "Reference guide covering major, minor, perfect, augmented, and diminished intervals with ear-training tips.",
  },
  {
    id: 10,
    title: "CAGED System Guide",
    description:
      "How to connect the 5 chord shapes across the entire fretboard using the CAGED framework.",
  },
  {
    id: 11,
    title: "Major Scale Modes",
    description:
      "All 7 modes of the major scale with scale degrees, characteristic notes, and mood descriptions.",
  },
  {
    id: 12,
    title: "Chord Construction Worksheet",
    description:
      "Step-by-step exercises building triads and seventh chords from scale degrees.",
  },
  {
    id: 13,
    title: "Strumming Patterns: Beginner",
    description:
      "8 essential strumming patterns in 4/4 with down/up arrow notation and accent guides.",
  },
  {
    id: 14,
    title: "Nashville Number System",
    description:
      "Quick-reference chart explaining the NNS with examples in common keys for session playing.",
  },
  {
    id: 15,
    title: "Ear Training: Melodic Dictation",
    description:
      "20 short melodic phrases to transcribe by ear, graded from stepwise motion to leaps.",
  },
  {
    id: 16,
    title: "Capo Chord Transposition Chart",
    description:
      "Lookup table showing how open chord shapes transpose when a capo is placed on frets 1–7.",
  },
  {
    id: 17,
    title: "Sight Reading: Grade 2",
    description:
      "Exercises introducing dotted rhythms, ties, and simple syncopation across both treble and bass clef.",
  },
  {
    id: 18,
    title: "Practice Log Template",
    description:
      "Weekly practice tracking sheet with columns for date, exercises, BPM goals, and notes.",
  },
  {
    id: 19,
    title: "Drop D Tuning Guide",
    description:
      "Common chord shapes, power chord positions, and riff ideas specific to Drop D tuning.",
  },
  {
    id: 20,
    title: "Harmonics Reference Sheet",
    description:
      "Natural and artificial harmonic positions on guitar with pitch equivalents and technique tips.",
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
              w
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
          <>
            <div id="document_controls" className="mb-4">
              <button className="btn btn-primary">
                <img src="/assets/svg/icon-plus.svg" className="icon" />
                <span className="btn-text">Add Document</span>
              </button>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="document_search"
                className="input w-full mb-4"
                placeholder="Search by title..."
              />
            </div>

            <div className="scrollable max-h-100">
              <ul
                id="documents_list"
                className="grid grid-cols-2 gap-4 md:grid-cols-4"
              >
                {documents.map((document) => (
                  <li key={document.id} className="document-item">
                    <Link
                      to={`/documents/${document.id}`}
                      className="document-link p-4 flex flex-col items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="100%"
                        viewBox="0 -960 960 960"
                        width="100%"
                        fill="currentColor"
                        className="icon mb-1"
                      >
                        <path d="M430-200q38 0 64-26t26-64v-150h120v-80H480v155q-11-8-23.5-11.5T430-380q-38 0-64 26t-26 64q0 38 26 64t64 26ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                      </svg>
                      <b className="text-xs text-center">{document.title}</b>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="well well-info text-center">
            <p>No documents available.</p>
          </div>
        )}
      </Accordion>
    </section>
  );
}
