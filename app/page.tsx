'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <main className="dashboard">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="title">AI-Powered Respiratory Screening</h1>
          <p className="subtitle">
            Fast, non-invasive detection of respiratory illnesses
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-primary">Start Testing</button>
          <button className="btn">Login</button>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <section className="dashboard-body">
        {/* ---------- SIDEBAR ---------- */}
        <aside className="sidebar card">
          <h3 className="section-title">Previous Sessions</h3>

          <ul className="session-list">
            <li className="session-item">Session with advice</li>
            <li className="session-item">Conference check</li>
            <li className="session-item">Follow-up notes</li>
          </ul>
        </aside>

        {/* ---------- MAIN CONTENT ---------- */}
        <div className="content">
          {/* ====== TOP ROW ====== */}
          <div className="grid-2">
            {/* Cough Analysis */}
            <div className="card">
              <h3 className="section-title">Cough Analysis</h3>

              {/* Placeholder for spectrogram */}
              <div className="spectrogram">
                <p className="muted">Spectrogram visualization</p>
              </div>

              <div className="legend">
                <span className="status-green">Normal</span>
                <span className="status-yellow">Moderate Risk</span>
                <span className="status-red">High Risk</span>
              </div>
            </div>

            {/* Lung Visualization */}
            <div className="card">
              <h3 className="section-title">Lung Assessment</h3>

              <div className="lung-visual glow-red">
                <p className="muted">Affected lung regions</p>
              </div>
            </div>
          </div>

          {/* ====== RISK ASSESSMENT ====== */}
          <div className="card">
            <h3 className="section-title">Risk Assessment</h3>

            <div className="risk-bar danger">
              <span>Pneumonia</span>
              <span>76%</span>
            </div>

            <div className="risk-bar warning">
              <span>Tuberculosis</span>
              <span>45%</span>
            </div>

            <div className="risk-bar success">
              <span>Asthma</span>
              <span>21%</span>
            </div>
          </div>

          {/* ====== ILLNESS DETAILS ====== */}
          <div className="card">
            <h3 className="section-title">Pneumonia</h3>

            <div className="details-grid">
              <div>
                <h4>Symptoms</h4>
                <ul>
                  <li>Persistent cough</li>
                  <li>Chest pain</li>
                  <li>Shortness of breath</li>
                </ul>
              </div>

              <div>
                <h4>Next Steps</h4>
                <ul>
                  <li>Seek medical confirmation</li>
                  <li>Chest imaging</li>
                  <li>Antibiotic treatment (if bacterial)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
