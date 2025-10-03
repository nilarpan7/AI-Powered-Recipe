import React, { useMemo, useState } from 'react'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export function Generate() {
  const [goal, setGoal] = useState('')
  const [mealType, setMealType] = useState<MealType>('dinner')
  const [minutes, setMinutes] = useState(35)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  const disabled = useMemo(() => loading || minutes < 5 || connectionStatus === 'disconnected', [loading, minutes, connectionStatus])

  // Check backend connection on component mount
  React.useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch(`${apiBase}/health`)
        if (response.ok) {
          setConnectionStatus('connected')
          setError(null)
        } else {
          setConnectionStatus('disconnected')
          setError('Backend server is not responding properly')
        }
      } catch (err) {
        setConnectionStatus('disconnected')
        setError('Cannot connect to backend server. Make sure it\'s running on port 4000.')
      }
    }
    checkConnection()
  }, [apiBase])

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const resp = await fetch(`${apiBase}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: null,
          input: { goal, available_time: minutes, meal_type: mealType },
          user_id: null
        })
      })
      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(data.error || `Server error: ${resp.status}`)
      }
      setResult(data)
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong'
      setError(errorMessage)
      console.error('Generate error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Generate Recipe</h2>
      
      {/* Connection Status */}
      <div style={{ marginBottom: 16, padding: 8, borderRadius: 4, fontSize: 14 }}>
        {connectionStatus === 'checking' && (
          <div style={{ color: '#666' }}>🔄 Checking connection...</div>
        )}
        {connectionStatus === 'connected' && (
          <div style={{ color: '#22c55e' }}>✅ Connected to backend</div>
        )}
        {connectionStatus === 'disconnected' && (
          <div style={{ color: '#ef4444' }}>❌ Backend disconnected</div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={onGenerate} className="form-grid">
        <label>
          Goal
          <input aria-label="goal" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., weight management" />
        </label>
        <label>
          Meal type
          <select value={mealType} onChange={e => setMealType(e.target.value as MealType)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </label>
        <label>
          Available time (minutes)
          <input type="number" min={5} max={60} value={minutes} onChange={e => setMinutes(Number(e.target.value))} />
        </label>
        <button disabled={disabled} aria-busy={loading}>
          {loading ? 'Generating…' : connectionStatus === 'disconnected' ? 'Backend Disconnected' : 'Generate'}
        </button>
      </form>

      {result && (
        <article className="card">
          <h3>{result.recipe?.title}</h3>
          {result.recipe?.overview && <p>{result.recipe.overview}</p>}
          <p><span className="pill">{result.recipe?.meal_type}</span></p>
          <h4>Ingredients</h4>
          <ul>
            {result.recipe?.ingredients?.map((ing: any, idx: number) => (
              <li key={idx}>{ing.quantity ?? ''} {ing.unit ?? ''} {ing.name}</li>
            ))}
          </ul>
          <h4>Steps</h4>
          <ol>
            {result.recipe?.steps?.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ol>
          <h4>Nutrition (estimated)</h4>
          <p>
            {['calories','protein','carbs','fat'].map(k => (
              <span key={k} style={{ marginRight: 12 }}>
                {k}: {result.recipe?.nutrition?.[k] ?? '—'}
              </span>
            ))}
          </p>
          <h4>Tutorial</h4>
          <p>
            YouTube search: <a target="_blank" rel="noreferrer" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(result.youtube_query)}`}>{result.youtube_query}</a>
          </p>
        </article>
      )}
    </section>
  )
}


