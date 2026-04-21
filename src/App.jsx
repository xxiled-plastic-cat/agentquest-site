import { useEffect, useMemo, useState } from "react"

const WORLD_BASE_URL =
  import.meta.env.VITE_WORLD_API_BASE_URL ?? "http://localhost:8787"

export default function App() {
  const [health, setHealth] = useState("checking")
  const [error, setError] = useState("")

  const healthUrl = useMemo(() => `${WORLD_BASE_URL}/health`, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch(healthUrl)
        if (!active) return
        if (!res.ok) {
          setHealth("down")
          setError(`HTTP ${res.status}`)
          return
        }
        setHealth("up")
      } catch (err) {
        if (!active) return
        setHealth("down")
        setError(err instanceof Error ? err.message : "Request failed")
      }
    })()
    return () => {
      active = false
    }
  }, [healthUrl])

  return (
    <main className="app">
      <h1>AgentQuest</h1>
      <p>Website repo for public-facing views and controls.</p>

      <section className="card">
        <h2>World Service Connection</h2>
        <p>
          <strong>Base URL:</strong> {WORLD_BASE_URL}
        </p>
        <p>
          <strong>Health:</strong> {health}
        </p>
        {error ? <p className="error">Error: {error}</p> : null}
      </section>
    </main>
  )
}
