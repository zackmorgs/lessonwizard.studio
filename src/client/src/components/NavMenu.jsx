import React, { useState } from "react";

import { NavLink } from "react-router";
import Logo from "./Logo";

import { Authenticated } from "../contexts/AuthContext";

import mainNavItems from "../data/navItems";
import authNavItems from "../data/authNavItems";
import featureItems from "../data/featureItems";

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const _today = new Date();
  const today = `${_today.getFullYear()}/${_today.getMonth() + 1}/${_today.getDate()}`;

  const handleNavToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <nav
      id="nav_menu"
      className={`sticky w-full top-0 z-100 ${isOpen ? " nav-open" : ""}`}
    >
      <div className="max-w-custom mx-auto">
        <div className="nav-bar flex flex-row justify-between items-center p-4">
          <div className="nav-logo">
            <NavLink to="/" id="nav_logo_link" onClick={closeNav}>
              <Logo height="2.5rem" />
            </NavLink>
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
        <div
          id="nav_list_container"
          className={`flex flex-col fixed flex m-0 p-0 w-full ${isOpen ? "" : "hidden"}`}
        >
          <Authenticated>
            <div className="nav-title p-4">
              <h3 className="h3">Features</h3>
            </div>
            <ul
              id="feature_nav_list"
              className={`nav-list flex flex-col list-none w-full m-0 p-0`}
            >
              {featureItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={
                      item.name === "Schedule"
                        ? `/schedule/${today}`
                        : item.path
                    }
                    className={({ isActive }) =>
                      `nav-link block${isActive ? " active" : ""}`
                    }
                  >
                    <span className="nav-text">
                      <img
                        src={`/assets/svg/icon-${item.icon}.svg`}
                        alt={`${item.name} icon`}
                        className="icon"
                      />
                      <span className="text">{item.name}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </Authenticated>
          <div className="nav-title p-4">
            <h3 className="h3">Main</h3>
          </div>

          <ul
            id="main_nav_list"
            className={`nav-list flex flex-col list-none w-full m-0 p-0 ${isOpen ? "" : "hidden"}`}
          >
            {mainNavItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link block${isActive ? " active" : ""}`
                  }
                >
                  <img
                    src={`/assets/svg/icon-${item.icon}.svg`}
                    alt={`${item.name} icon`}
                    className="icon"
                  />
                  <span className="nav-text mt-2 mb-0">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

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
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link block flex flex-col items-center justify-center${isActive ? " active" : ""}`
                    }
                  >
                    <img
                      src={`/assets/svg/${item.icon}.svg`}
                      alt={`${item.name} icon`}
                      className="icon"
                    />
                    <span className="nav-text">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </Authenticated>
        </div>
      </div>
    </nav>
  );
}
