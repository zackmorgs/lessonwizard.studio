import React, { useState } from "react";

import { Link } from "react-router-dom";

const today = new Date();

export default function CalendarDatePicker() {
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const month = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const totalDaysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const prevMonthLeadingDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => totalDaysInPrevMonth - firstDayOfMonth + i + 1
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
    <>
      <section id="calendar_date_picker">
        <div className="p-4">
          <h2 id="calendar_month" className="h2 text-center flex align-center gap-4 justify-center">
            <button onClick={prevMonth}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
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
                <li key={`prev-${index}`} className="day empty-day">
                  <Link to={`/schedule/${year}/${monthIndex}/${day}`} className="date-link">
                    {day}
                  </Link>
                </li>
              ))}
              {allDaysInMonth.map((day, index) => (
                <li key={index} className="day-in-month day">
                  <Link to={`/schedule/${year}/${monthIndex + 1}/${day}`} className="date-link">
                    {day}
                  </Link>
                </li>
              ))}
              {nextMonthDays.map((day, index) => (
                <li key={`next-${index}`} className="day empty-day">
                  <Link to={`/schedule/${year}/${monthIndex + 1}/${day}`} className="date-link">
                    {day}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

