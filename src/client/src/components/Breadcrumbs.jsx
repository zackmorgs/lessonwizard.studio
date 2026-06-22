import React from "react";

import {Link} from 'react-router';

export default function Breadcrumbs({ to, label }) {
  return (
    <div className="breadcrumbs">
      <div className="max-w-custom mx-auto">
        <nav className="panel">
          <Link to={to} className="flex flex-row items-center">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
            <div className="btn-text">{label}</div>
          </Link>
        </nav>
      </div>
    </div>
  );
}
