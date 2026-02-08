"use client";

import React, { useState } from "react";
import CoughRecorder from "../components/CoughRecorder";
import AnalyticsBoard, { RiskScores } from "../components/AnalyticsBoard";

export default function DashboardPage() {
  const [riskScores, setRiskScores] = useState<RiskScores>({
    cold: 0,
    cough: 0,
    pneumonia: 0,
    asthma: 0,
    covid: 0,
  });

  const [spectrogram, setSpectrogram] = useState<string | null>(null);

  const handleRecordingComplete = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to analyze audio");

      const data = await response.json();
      console.log("Received data:", data);

      // Explicitly map the backend keys to your state keys
      // Also convert 0.56 -> 56 for better UI display
      const newScores: RiskScores = {
        cold: Math.round(data.predictions.cold * 100),
        cough: Math.round(data.predictions.cough * 100),
        pneumonia: Math.round(data.predictions.pneumonia * 100),
        asthma: Math.round(data.predictions.asthma * 100),
        covid: Math.round(data.predictions.covid * 100),
      };

      console.log("Mapped scores:", newScores);

      setRiskScores(newScores);
      setSpectrogram(data.image || null);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze cough. Please try again.");
    }
  };

  return (
    <main style={{ position: "relative", paddingTop: "90px", paddingBottom: "32px", minHeight: "100vh" }}>
  {/* Background Image */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "url('/images/board-bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 0,
      filter: "brightness(0.2)" // fades it out / darkens it
    }}
  />
      

      <div style={{ maxWidth: "1200px", margin: "32px auto 0", padding: "0 24px" }}>
        {/* ===== COUGH RECORDER ===== */}
        <div style={{ marginBottom: "32px" }}>
          <CoughRecorder onRecordingComplete={handleRecordingComplete} />
        </div>

        {/* ===== ANALYTICS BOARD ===== */}
        <div style={{ marginBottom: "32px" }}>
          <AnalyticsBoard scores={riskScores} />
        </div>

        {/* ===== GRID ===== */}
        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          {/* ===== SIDEBAR: Previous Sessions ===== */}
          <aside
            className="card"
            style={{
              flex: "0 0 260px",
              display: "flex",
              flexDirection: "column",
              padding: "16px",
              boxSizing: "border-box",
              maxHeight: "600px", // keeps sidebar a reasonable length
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Previous Sessions</h3>
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  marginBottom: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <strong>Session {i + 1}</strong>
                <p style={{ fontSize: "13px", opacity: 0.7, marginTop: "4px" }}>
                  Pneumonia risk: {70 - i}%
                </p>
              </div>
            ))}
          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              flex: 1,
            }}
          >
            {/* ===== SPECTROGRAM + RISK EXPLANATION ===== */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <div className="card" style={{ height: "400px" }}>
                <h3>Spectrogram</h3>
                <p style={{ opacity: 0.7, marginTop: "8px" }}>A visual of your cough</p>
                <div
  style={{
    height: "160px",
    marginTop: "16px",
    borderRadius: "12px",
    overflow: "hidden", // Keeps the image inside the rounded corners
    background: !spectrogram 
      ? "radial-gradient(circle at center, rgba(255,80,80,0.45), rgba(0,0,0,0.85))" 
      : "transparent",
  }}
>
  {spectrogram && (
    <img 
      src={spectrogram} 
      alt="Spectrogram" 
      style={{ 
        width: "100%", 
        height: "100%", 
        objectFit: "cover", // Ensures it fills the box like background-size: cover
        display: "block" 
      }} 
    />
  )}
</div>
</div>

              <div className="card" style={{ height: "400px" }}>
                <h3>Risk Explanation</h3>
                <p style={{ marginTop: "12px", lineHeight: 1.5 }}>
                  The cough audio contains frequency and temporal patterns commonly
                  associated with airway irritation and lower lung congestion. These
                  results are probabilistic and not a diagnosis.
                </p>
              </div>
            </div>

            {/* ===== NEXT STEPS (FULL WIDTH) ===== */}
            <div
              className="card"
              style={{
                padding: "16px",
              }}
            >
              <h3>Next Steps</h3>
              <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                <li>Seek medical evaluation if symptoms persist or worsen</li>
                <li>Consider imaging or lab tests if advised</li>
                <li>Re-record cough if symptoms change</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
