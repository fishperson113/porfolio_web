'use client'

import { useState, useEffect } from 'react'

interface PreloaderState {
  isLoading: boolean
  progress: number
}

export function usePreloader(minDuration = 1500) {
  const [state, setState] = useState<PreloaderState>({ isLoading: true, progress: 0 })

  useEffect(() => {
    const start = Date.now()
    let done = false

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 15, done ? 100 : 95),
      }))
    }, 100)

    const finish = () => {
      done = true
      const elapsed = Date.now() - start
      const remaining = Math.max(0, minDuration - elapsed)
      setTimeout(() => {
        setState({ isLoading: false, progress: 100 })
        clearInterval(interval)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish)
    }

    return () => {
      window.removeEventListener('load', finish)
      clearInterval(interval)
    }
  }, [minDuration])

  return state
}
