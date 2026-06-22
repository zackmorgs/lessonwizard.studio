import React from "react";

export default function Logo({ height = "1.25rem" }) {
  const scale = parseFloat(height) / 36;
  const width = Math.round(240 * scale);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 36"
      height={"auto"}
      width={"16rem"}
      overflow="visible"
      role="img"
      aria-label="LessonWizard Studio"
      id="logo"
    >
      <title>LessonWizard Studio</title>
      <defs>
        <linearGradient id="lws-hat-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#d08aff" />
          <stop offset="100%" stopColor="#8a35cc" />
        </linearGradient>
        <linearGradient id="lws-brim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9a3dd0" />
          <stop offset="100%" stopColor="#6b22a8" />
        </linearGradient>
      </defs>

      {/* Wizard hat — cone */}
      <polygon points="15,1 4,27 26,27" fill="url(#lws-hat-grad)" />
      {/* Brim shadow */}
      <ellipse cx="15" cy="28.5" rx="14.5" ry="5" fill="#4d1880" />
      {/* Brim face */}
      <ellipse cx="15" cy="27.5" rx="13.5" ry="4.5" fill="url(#lws-brim-grad)" />
      {/* Hat band */}
      <path d="M6,24 L24,24 L24,27 Q15,29 6,27 Z" fill="#5a1a96" />
      {/* Buckle */}
      <rect x="12" y="23.2" width="6" height="4.5" rx="0.8" fill="#f0c040" />
      <rect x="13.2" y="24.2" width="3.6" height="2.5" rx="0.5" fill="#5a1a96" />

      {/* Star on cone */}
      <g transform="translate(15,12)">
        <polygon
          points="0,-5.5 1.3,-1.8 5.2,-1.8 2.1,0.7 3.2,4.4 0,2.3 -3.2,4.4 -2.1,0.7 -5.2,-1.8 -1.3,-1.8"
          fill="#f0c040"
        />
      </g>

      {/* Sparkles */}
      <circle cx="31" cy="5" r="2" fill="#f0c040" opacity="0.9" />
      <circle cx="34" cy="11" r="1.3" fill="#f0c040" opacity="0.65" />
      <circle cx="30" cy="14" r="0.9" fill="#d4a0ff" opacity="0.7" />

      {/* Wordmark — uses Manrope from the page */}
      <text
        x="42"
        y="25"
        fontFamily="'Manrope', sans-serif"
        fontSize="17"
        textRendering="geometricPrecision"
      >
        <tspan fontWeight="800" fill="#f1f1f1" letterSpacing="-0.3">
          lessonwizard
        </tspan>
        <tspan fontWeight="400" fill="#c279f5">
          .studio
        </tspan>
      </text>
    </svg>
  );
}
