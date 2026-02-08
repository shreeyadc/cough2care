"use client";

import React, { useMemo } from "react";

export type RiskScores = {
  cough: number;
  cold: number;
  asthma: number;
  pneumonia: number;
  covid: number;
};

type AnalyticsBoardProps = {
  scores: RiskScores;
};

const AnalyticsBoard: React.FC<AnalyticsBoardProps> = ({ scores }) => {
  // 1. REMOVED: useState for animation
  // 2. REMOVED: useEffect for animation

  const sortedRisks = useMemo(() => {
    // 3. Use 'scores' directly instead of 'animatedScores'
    return Object.entries(scores).sort((a, b) => b[1] - a[1]);
  }, [scores]);

  return (
    <div
      className="card"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "24px",
        textAlign: "center",
      }}
    >
      {sortedRisks.map(([label, value]) => (
        <RiskCircle key={label} label={label} value={value} />
      ))}
    </div>
  );
};

export default AnalyticsBoard;

// ... Keep RiskCircle exactly the same ...
function RiskCircle({ label, value }: { label: string; value: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Ensure value doesn't exceed 100 for the stroke calculation
  const safeValue = Math.min(Math.max(value, 0), 100); 
  const offset = circumference - (safeValue / 100) * circumference;

  let strokeColor = "#38a169"; // green
  if (value > 70) strokeColor = "#e53e3e"; // red
  else if (value > 40) strokeColor = "#d69e2e"; // yellow

  return (
    <div>
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }} // CSS Animation is better!
        />
        <text
          x="60"
          y="66"
          textAnchor="middle"
          fontSize="22"
          fill="white"
          fontWeight="700"
        >
          {Math.round(value)}%
        </text>
      </svg>
      <div style={{ marginTop: "8px", textTransform: "capitalize", fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}