import React, { useState } from "react";

import { Link } from "react-router";

import { Authenticated } from "../contexts/AuthContext";

import mainNavItems from "../data/navItems";
import authNavItems from "../data/authNavItems";
import featureItems from "../data/featureItems";

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav
      id="nav_menu"
      className={`sticky w-full top-0 z-100 ${isOpen ? " nav-open" : ""}`}
    >
      <div className="nav-bar flex flex-row justify-between items-center p-4">
        <div className="nav-logo">
          <Link to="/" id="nav_logo_link">
            <span>lessonwizard</span>
            <span>.</span>
            <span>studio</span>
          </Link>
        </div>
        <button
          id="nav_toggle"
          aria-label="Toggle navigation menu"
          onClick={handleNavToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div id="nav_list_container" className={`flex flex-col fixed flex m-0 p-0 w-full ${isOpen ? "" : "hidden"}`}>
        <div className="nav-title p-4">
          <h3 className="h3">Main</h3>
        </div>
        <ul
          className={`nav-list flex flex-col list-none w-full m-0 p-0 ${isOpen ? "" : "hidden"}`}
        >
          {mainNavItems.map((item) => (
            <li key={item.path} className="nav-item block">
              <Link to={item.path} className="nav-link block">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <Authenticated>
          <div className="nav-title p-4">
            <h3 className="h3">Features</h3>
          </div>
          <ul
            className={`nav-list flex flex-col list-none w-full m-0 p-0`}
          >
            {featureItems.map((item) => (
              <li key={item.path} className="nav-item block">
                <Link to={item.path} className="nav-link block">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </Authenticated>
        <Authenticated>
          <div className="nav-title p-4">
            <h3 className="h3">Account</h3>
          </div>
          <ul
            id="account_nav_list"
            className={`nav-list flex flex-row justify-start list-none w-full m-0 p-0`}
          >
            {authNavItems.map((item) => (
              <li key={item.path} className="nav-item block">
                <Link to={item.path} className="nav-link block flex flex-col items-center justify-center">
                  <img src={`/assets/svg/${item.icon}.svg`} alt={`${item.name} icon`} className="icon"/>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Authenticated>
      </div>
    </nav>
  );
}
