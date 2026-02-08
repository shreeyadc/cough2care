"use client";

import React, { useMemo, useEffect, useState } from "react";

export type RiskScores = {
  cold: number;
  cough: number;
  pneumonia: number;
  asthma: number;
  covid: number;
};

type AnalyticsBoardProps = {
  scores: RiskScores;
};

const AnimationSpeed = 2;

const AnalyticsBoard: React.FC<AnalyticsBoardProps> = ({ scores }) => {
  const [animatedScores, setAnimatedScores] = useState<RiskScores>({
    cold: 0,
    cough: 0,
    pneumonia: 0,
    asthma: 0,
    covid: 0,
  });

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      let done = true;
      const nextScores: RiskScores = { ...animatedScores };

      (Object.keys(scores) as Array<keyof RiskScores>).forEach((key) => {
        const target = scores[key];
        const current = animatedScores[key];
        if (current < target) {
          nextScores[key] = Math.min(current + AnimationSpeed, target);
          done = false;
        }
      });

      setAnimatedScores(nextScores);

      if (!done) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [scores]);

  const sortedRisks = useMemo(() => {
    return Object.entries(animatedScores).sort((a, b) => b[1] - a[1]);
  }, [animatedScores]);

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

// Color-coded circles
function RiskCircle({ label, value }: { label: string; value: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

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
