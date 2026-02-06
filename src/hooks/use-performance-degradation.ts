'use client'

import { useState, useCallback } from 'react'
import { useDevicePerformance } from './use-device-performance'

export interface PerformanceLevel {
  level: number
  bloomEnabled: boolean
  vignetteEnabled: boolean
  particleCount: number
}

export function usePerformanceDegradation() {
  const { tier, isMobile } = useDevicePerformance()

  const getInitial = (): PerformanceLevel => {
    if (tier === 'low') return { level: 3, bloomEnabled: false, vignetteEnabled: true, particleCount: 1000 }
    if (tier === 'mid' || isMobile) return { level: 1, bloomEnabled: true, vignetteEnabled: true, particleCount: 5000 }
    return { level: 0, bloomEnabled: true, vignetteEnabled: true, particleCount: 10000 }
  }

  const [perfLevel, setPerfLevel] = useState<PerformanceLevel>(getInitial)

  const degrade = useCallback(() => {
    setPerfLevel((prev) => {
      const next = Math.min(prev.level + 1, 4)
      switch (next) {
        case 1: return { ...prev, level: 1, particleCount: 5000 }
        case 2: return { ...prev, level: 2, bloomEnabled: false, particleCount: 2000 }
        case 3: return { ...prev, level: 3, particleCount: 1000 }
        case 4: return { level: 4, bloomEnabled: false, vignetteEnabled: false, particleCount: 500 }
        default: return prev
      }
    })
  }, [])

  return { perfLevel, degrade }
}
