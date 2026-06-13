import React from "react";

import { Link } from "react-router-dom";
import Accordion from "./Accordion";

// let dummyLessons = [
//   {
//     studentName: "John Doe",
//     time: "10:00 AM",
//     instrument: "piano",
//   },
//   {
//     studentName: "Jane Doe",
//     time: "10:15 AM",
//     instrument: "violin",

//   },
//   {
//     studentName: "Emily Davis",
//     time: "10:45 AM",
//     instrument: "flute",
//   },
//   {
//     studentName: "Mary Smith",
//     time: "10:30 AM",
//     instrument: "guitar",
//   },
//   {
//     studentName: "Alice Johnson",
//     time: "11:00 AM",
//     instrument: "violin",
//   },
//   {
//     studentName: "Bob Brown",
//     time: "11:30 AM",
//     instrument: "drums",
//   },
// ];

export default function TodayView({todaysLessons = []}) {
  return (
    <section id="today_view" className="section pt-4">
      <Accordion
        title={
          <h2 className="h2">
            Today's Scheduled Lessons (
            <span className="lesson-count">{todaysLessons.length}</span>)
          </h2>
        }
        defaultOpen={true}
      >
          <hr className="rule-sm" />
          <div className="scrollable max-h-72">
            {todaysLessons.length === 0 ? (
              <span className="well well-info">
                <p>You have no lessons scheduled for today.</p>
              </span>
            ) : (
              <ul id="today_lessons">
                {todaysLessons.map((lesson, index) => (
                  <li key={index} className="block">
                    <Link
                      to={`/lessons/${index}`}
                      className="lesson-link p-4 block mt-4 flex flex-row justify-between items-center relative overflow-hidden"
                    >
                      <div className={"lesson-instrument lesson-instrument" + `-${lesson.instrument}` + " absolute top-0 right-0 bottom-0 left-0 z-0"}></div>
                      <div className="flex flex-row gap-1 items-center justify-start">
                        <span className="lesson-dot today-lesson-dot mr-2"></span>
                        <div className="lesson-info z-10">
                          <div className="student-name">
                            {lesson.studentName}
                          </div>
                          <div className="lesson-time">{lesson.time}</div>
                        </div>
                      </div>
                      <div className="instrument-title z-10">
                        {lesson.instrument.charAt(0).toUpperCase() + lesson.instrument.slice(1)}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="2rem"
                        viewBox="0 -960 960 960"
                        width="2rem"
                        fill="currentColor"
                        className="lesson-link-icon z-10"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <hr className="rule-sm" />
          <Link
            to="/lessons/new"
            className="btn btn-success mt-4 block text-center"
          >
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              height="1.5rem"
              viewBox="0 -960 960 960"
              width="1.5rem"
              fill="#e3e3e3"
            >
              <path d="M680-80v-120H560v-80h120v-120h80v120h120v80H760v120h-80Zm-480-80q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h40v-80h80v80h240v-80h80v80h40q33 0 56.5 23.5T760-720v244q-20-3-40-3t-40 3v-84H200v320h280q0 20 3 40t11 40H200Zm0-480h480v-80H200v80Zm0 0v-80 80Z" />
            </svg>
            <span className="btn-text">Plan New Lesson</span>
          </Link>
      </Accordion>
    </section>
  );
}
