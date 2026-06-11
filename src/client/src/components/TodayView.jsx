import React, { useState } from "react";

import {Link} from "react-router-dom";

let dummyLessons = [
    {
        studentName: "John Doe",
        time: "10:00 AM"
    },
        {
        studentName: "Mary Smith",
        time: "10:30 AM"
    }
]

export default function TodayView() {
  return (
    <>
      <section id="today_view">
        <div className="panel p-4">
          <h2 className="pb-4">Today's Lessons</h2>
          <hr className="rule-sm" />
            {dummyLessons.length === 0 ? (  
                <p>You have no lessons scheduled for today.</p>
            ) : (
                <ul>
                    {dummyLessons.map((lesson, index) => (
                        <li key={index} className="block">
                            <Link to={`/lessons/${index}`} className="lesson-link p-4 block mt-4 flex flex-row justify-between items-center">
                                <span>
                                    {lesson.studentName} - at {lesson.time}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem" fill="currentColor"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}  
        </div>
      </section>
    </>
  );
}
