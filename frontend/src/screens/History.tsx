import React, { useState, useEffect } from 'react'

export function History() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch(`${apiBase}/health`)
        if (response.ok) {
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('disconnected')
        }
      } catch (err) {
        setConnectionStatus('disconnected')
      }
    }
    checkConnection()
  }, [apiBase])

  return (
    <section>
      <h2>History</h2>
      
      {/* Connection Status */}
      <div style={{ marginBottom: 16, padding: 8, borderRadius: 4, fontSize: 14 }}>
        {connectionStatus === 'checking' && (
          <div style={{ color: '#666' }}>🔄 Checking connection...</div>
        )}
        {connectionStatus === 'connected' && (
          <div style={{ color: '#22c55e' }}>✅ Connected to backend</div>
        )}
        {connectionStatus === 'disconnected' && (
          <div style={{ color: '#ef4444' }}>❌ Backend disconnected - History features unavailable</div>
        )}
      </div>

      <p>Sign in to view your saved and recent recipes.</p>
    </section>
  )
}


