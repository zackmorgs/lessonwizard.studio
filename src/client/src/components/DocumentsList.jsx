import React from "react";
import { Link } from "react-router-dom";
import Accordion from "./Accordion";

export default function DocumentsList({ documents = [], defaultOpen = false, showControls = true }) {
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
        {showControls && (
          <div id="documents_list_controls" className="flex flex-col justify-start md:flex-row-reverse md:justify-between items-center mb-4">
            <Link to="/documents/new" className="btn btn-primary sm:w-full">
              <img src="/assets/svg/icon-plus.svg" className="icon" />
              <span className="btn-text">Add Document</span>
            </Link>
            <div className="form-group form-search mt-4 md:m-0 w-full md:min-w-2/3 md:w-auto md:w-min-md">
              <img src="/assets/svg/icon-search.svg" className="icon" />
              <input
                type="search"
                id="document_search"
                className="input w-full md:w-max-12"
                placeholder="Search by title..."
              />
            </div>
          </div>
        )}
        {documents.length > 0 ? (
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
        ) : (
          <div className="well well-info text-center">
            <p>No documents available.</p>
          </div>
        )}
      </Accordion>
    </section>
  );
}
