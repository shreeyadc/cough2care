'use client';
import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";

export default function LoginPage() {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Cough2Care Login</h1>
        <p className="login-subtitle">Welcome back. Sign in to continue.</p>

        {!user && (
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/api/auth/login?returnTo=/dashboard";
            }}
          >
            <input type="email" placeholder="Email address" required />
            <input type="password" placeholder="Password" required />

            <button type="submit" className="btn primary">
              Sign In
            </button>
          </form>
        )}

        {user && (
          <div style={{ marginTop: "1rem" }}>
            <p>Welcome, {user.name}</p>
            <a href="/api/auth/logout">
              <button className="btn">Logout</button>
            </a>
          </div>
        )}

        <div className="login-links" style={{ marginTop: "1.5rem" }}>
          <Link href="/">← Back to Home</Link>
          <span> | </span>
          <span className="signup-link">Create account</span>
        </div>
      </div>
    </main>
  );
}
