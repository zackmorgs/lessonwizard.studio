import React, { useState } from "react";

export default function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion px-4">
      <div
        className="accordion-header accordion-toggle flex flex-row mb-2 justify-between items-center w-full cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex-1">{title}</div>
        <img
          src="/assets/svg/icon-arrow-down.svg"
          alt="Toggle"
          height="1rem"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
}
