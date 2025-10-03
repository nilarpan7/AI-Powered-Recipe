import React from 'react'
import { Link } from 'react-router-dom'

export function Welcome() {
  return (
    <section className="hero">
      <h2 className="hero-title">Healthy recipes, tailored to you</h2>
      <p className="hero-subtitle">Quick, nutritious meals in under 45 minutes. Generate AI-powered recipes and save your favorites.</p>
      <div className="actions">
        <Link to="/generate" className="btn primary">Try as guest</Link>
        <a href="#" aria-disabled className="btn">Sign in (coming soon)</a>
      </div>
    </section>
  )
}


