import React, { useState } from "react";

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

  const allDaysInMonth = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: totalDaysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => setViewDate(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, monthIndex + 1, 1));

  return (
    <>
      <section id="calendar_date_picker">
        <div className="p-4">
          <h2 className="text-center flex align-center gap-4 justify-center">
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
              <div className="day_name">Sun</div>
              <div className="day_name">Mon</div>
              <div className="day_name">Tue</div>
              <div className="day_name">Wed</div>
              <div className="day_name">Thu</div>
              <div className="day_name">Fri</div>
              <div className="day_name">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {allDaysInMonth.map((day, index) => (
                <div key={index} className={day ? "day" : "empty-day"}>
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

