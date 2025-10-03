import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function App() {
  const { pathname } = useLocation()
  return (
    <div className="layout">
      <header className="app-header">
        <h1 className="app-title">AI Powered Recipe</h1>
        <nav className="nav">
          <Link to="/" className={pathname === '/' ? 'active' : undefined}>Welcome</Link>
          <Link to="/generate" className={pathname.startsWith('/generate') ? 'active' : undefined}>Generate</Link>
          <Link to="/history" className={pathname.startsWith('/history') ? 'active' : undefined}>History</Link>
        </nav>
      </header>
      <main aria-live="polite" className="section">
        <Outlet />
      </main>
      <footer>
        <p>Disclaimer: Not medical advice; consult a doctor for allergies.</p>
      </footer>
    </div>
  )
}


