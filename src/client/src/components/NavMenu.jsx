import React, { useState } from "react";

import { Link } from "react-router";

import navItems from "../data/navItems";

export default function NavMenu() {

  const [isOpen, setIsOpen] = useState(false);

  const handleNavToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav id="nav_menu" className={`sticky w-full top-0 bg-white shadow z-10${isOpen ? " nav-open" : ""}`}>
      <div className="nav-bar flex flex-row justify-between items-center p-4">
        <div className="nav-logo">
          <Link to="/" id="nav_logo_link">
            zoilerplate
          </Link>
        </div>
        <button id="nav_toggle" aria-label="Toggle navigation menu" onClick={handleNavToggle}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <ul className={`nav-list fixed flex flex-col list-none w-full m-0 p-0 ${isOpen ? "" : "hidden"} bg-white shadow `}>
        {navItems.map((item) => (
          <li key={item.path} className="nav-item block">
            <Link to={item.path} className="nav-link py-2 px-4 block ">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
