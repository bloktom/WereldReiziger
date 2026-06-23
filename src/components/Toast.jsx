import { useEffect } from 'react'

// Kleine, vrolijke feedback-melding rechtsonder.
export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [message, onDone])

  if (!message) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__emoji">✨</span>
      <span className="toast__text">{message}</span>
    </div>
  )
}

