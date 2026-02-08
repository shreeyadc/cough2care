'use client';
import React from "react";
import "./globals.css";
import Link from "next/link";


export default function Page() {
  return (
    <main>

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <span className="logo">AI-Powered Respiratory Screening</span>
          <Link href="/login">
            <button className="btn">Login</button>
          </Link>

        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Cough2Care</h1>
          <p>Early detection of pneumonia and tuberculosis using cough sound AI.</p>
          <button className="btn primary" style={{ marginTop: "24px" }}>
            Start Screening
          </button>
        </div>

        <div className="glass-card">
          {/* Waveform on the left */}
          <div className="wave-bars">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i}></span>
            ))}
          </div>

          {/* Text on the right */}
          <div className="card-text">
            <h3>How Cough2Care Works</h3>
            <p>
              Our AI analyzes cough sounds to detect early signs of pneumonia and tuberculosis — fast, accurate, and from your smartphone.
            </p>
          </div>
        </div>



      </section>


      {/* ABOUT */}
        <section className="section">
          <h2>About Cough2Care</h2>
          <div className="cards">
            <div className="card">
              <img
                src="/images/audio-icon.png"
                alt="Audio AI"
                className="card-img"
              />
              <h3>🎙️ Audio AI</h3>
              <p>Deep learning analyzes cough acoustics for early disease detection.</p>
            </div>

            <div className="card">
              <img
                src="/images/clinical-doc-icon.png"
                alt="Clinical Insights"
                className="card-img"
              />
              <h3>📊 Clinical Insights</h3>
              <p>Generates probability scores for respiratory conditions.</p>
            </div>

            <div className="card">
              <img
                src="/images/globe-icon.png"
                alt="Global Access"
                className="card-img"
              />
              <h3>🌍 Global Access</h3>
              <p>Works on any smartphone, enabling global healthcare screening.</p>
            </div>
          </div>
        </section>


      

    </main>
  );
}
