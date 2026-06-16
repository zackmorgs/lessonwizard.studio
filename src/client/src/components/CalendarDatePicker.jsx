import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Accordion from "./Accordion";
import { getLessonDaysInMonth } from "../services/lessonService";

const today = new Date();

export default function CalendarDatePicker({ defaultOpen = false }) {
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [lessonDays, setLessonDays] = useState([]);

  const month = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const monthNumber = monthIndex + 1;
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const totalDaysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const prevMonthDate = new Date(year, monthIndex - 1, 1);
  const prevMonthYear = prevMonthDate.getFullYear();
  const prevMonthNumber = prevMonthDate.getMonth() + 1;

  const nextMonthDate = new Date(year, monthIndex + 1, 1);
  const nextMonthYear = nextMonthDate.getFullYear();
  const nextMonthNumber = nextMonthDate.getMonth() + 1;

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

  useEffect(() => {
    getLessonDaysInMonth(year, monthNumber)
      .then((days) => setLessonDays(Array.isArray(days) ? days : []))
      .catch(() => setLessonDays([]));
  }, [year, monthNumber]);

  const lessonDaySet = useMemo(() => new Set(lessonDays), [lessonDays]);

  const prevMonth = () => setViewDate(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, monthIndex + 1, 1));

  return (
    <section id="calendar_date_picker" className="section">
      <Accordion
        title={
          <h2 className="h2 flex flex-row">
            {" "}
            <img
              src="/assets/svg/icon-calendar-month.svg"
              alt="Calendar"
              className="mr-4"
            />
            <span>Calendar{lessonDays.length > 0 && <> (<Link to="/calendar" className="lesson-count" onClick={(e) => e.stopPropagation()}>{lessonDays.length}</Link>)</>}</span>
          </h2>
        }
        defaultOpen={defaultOpen}
      >
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
                  to={`/schedule/${prevMonthYear}/${prevMonthNumber}/${day}`}
                  className="day empty-day date-link"
                >
                  {day}
                </Link>
              </li>
            ))}
            {allDaysInMonth.map((day, index) => (
              <li key={index}>
                <Link
                  to={`/schedule/${year}/${monthNumber}/${day}`}
                  className="day-in-month day date-link"
                >
                  {day}
                  {lessonDaySet.has(day) && (
                    <span className="lesson-dot calendar-lesson-dot" />
                  )}
                </Link>
              </li>
            ))}    
            {nextMonthDays.map((day, index) => (
              <li key={`next-${index}`}>
                <Link
                  to={`/schedule/${nextMonthYear}/${nextMonthNumber}/${day}`}
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
          <b>Go to a date</b> to view scheduled lessons or to create one on that
          date.
        </p>
      </Accordion>
    </section>
  );
}
