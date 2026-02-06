'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface MotionContextValue {
  /** Whether animations are currently enabled (considers system pref + user override) */
  motionEnabled: boolean
  /** Toggle motion on/off — persists to localStorage */
  toggleMotion: () => void
  /** Raw system preference (true = user prefers reduced motion) */
  systemPrefersReduced: boolean
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined)

const STORAGE_KEY = 'motion-preference'

export function MotionProvider({ children }: { children: ReactNode }) {
  const systemPrefersReduced = useReducedMotion()
  const [userOverride, setUserOverride] = useState<boolean | null>(null)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setUserOverride(stored === 'enabled')
      }
    } catch {
      // localStorage unavailable (SSR, privacy mode) — keep default
    }
  }, [])

  // User override wins over system preference
  const motionEnabled = userOverride !== null ? userOverride : !systemPrefersReduced

  const toggleMotion = () => {
    const next = !motionEnabled
    setUserOverride(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'enabled' : 'disabled')
    } catch {
      // Silently fail if storage unavailable
    }
  }

  return (
    <MotionContext value={{ motionEnabled, toggleMotion, systemPrefersReduced }}>
      {children}
    </MotionContext>
  )
}

export function useMotionPreference(): MotionContextValue {
  const context = useContext(MotionContext)
  if (!context) {
    throw new Error('useMotionPreference must be used within MotionProvider')
  }
  return context
}
