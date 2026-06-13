import React, { useState } from "react";

import { Link } from "react-router-dom";
import Accordion from "./Accordion";

const today = new Date();

// TODO: replace with API data
const lessonDates = [
  { year: 2026, month: 6, day: 11 },
  { year: 2026, month: 6, day: 15 },
  { year: 2026, month: 6, day: 18 },
  { year: 2026, month: 6, day: 22 },
];

function hasLesson(year, month, day) {
  return lessonDates.some(
    (l) => l.year === year && l.month === month && l.day === day,
  );
}

export default function CalendarDatePicker() {
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const month = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const totalDaysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const prevMonthLeadingDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => totalDaysInPrevMonth - firstDayOfMonth + i + 1,
  );

  const allDaysInMonth = [
    ...Array.from({ length: totalDaysInMonth }, (_, i) => i + 1),
  ];

  const totalCells = firstDayOfMonth + totalDaysInMonth;
  const trailingDays = (7 - (totalCells % 7)) % 7;
  const nextMonthDays = Array.from({ length: trailingDays }, (_, i) => i + 1);

  const prevMonth = () => setViewDate(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, monthIndex + 1, 1));

  return (
    <section id="calendar_date_picker" className="section">
      <Accordion title={<h2 className="h2">Calendar</h2>} defaultOpen={false}>
            <h2
              id="calendar_month"
              className="h2 text-center flex align-center gap-4 justify-center"
            >
              <button onClick={prevMonth}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                  className="calendar-nav-icon"
                >
                  <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                </svg>
              </button>
              <span className="month-year">
                {month} {year}
              </span>
              <button onClick={nextMonth}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                  className="calendar-nav-icon"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </button>
            </h2>
            <div className="calendar mt-4">
              <div className="days-of-week grid grid-cols-7 gap-2">
                <div className="day-name">Sun</div>
                <div className="day-name">Mon</div>
                <div className="day-name">Tue</div>
                <div className="day-name">Wed</div>
                <div className="day-name">Thu</div>
                <div className="day-name">Fri</div>
                <div className="day-name">Sat</div>
              </div>
              <ul className="grid grid-cols-7 gap-2">
                {prevMonthLeadingDays.map((day, index) => (
                  <li key={`prev-${index}`}>
                    <Link
                      to={`/schedule/${year}/${monthIndex}/${day}`}
                      className="day empty-day date-link"
                    >
                      {day}
                    </Link>
                  </li>
                ))}
                {allDaysInMonth.map((day, index) => (
                  <li key={index}>
                    <Link
                      to={`/schedule/${year}/${monthIndex + 1}/${day}`}
                      className="day-in-month day date-link"
                    >
                      {day}
                      {hasLesson(year, monthIndex + 1, day) && (
                        <span className="lesson-dot calendar-lesson-dot" />
                      )}
                    </Link>
                  </li>
                ))}
                {nextMonthDays.map((day, index) => (
                  <li key={`next-${index}`}>
                    <Link
                      to={`/schedule/${year}/${monthIndex + 1}/${day}`}
                      className="day empty-day date-link"
                    >
                      {day}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="rule-sm" />
            <p className="mt-4">
              <b>Go to a date</b> to view scheduled lessons or to create one on
              that date.
            </p>
      </Accordion>
    </section>
  );
}
