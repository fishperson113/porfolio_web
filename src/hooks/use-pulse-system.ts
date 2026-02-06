'use client'

import { useRef, useCallback } from 'react'
import { Vector3 } from 'three'

interface Pulse {
  origin: Vector3
  startTime: number
}

const MAX_PULSES = 5

/**
 * Manages click-triggered shockwave pulses for NeuralNetwork shaders.
 * Returns origins/times arrays sized for shader uniforms.
 */
export function usePulseSystem() {
  const pulsesRef = useRef<Pulse[]>([])

  const addPulse = useCallback((origin: Vector3) => {
    const pulses = pulsesRef.current
    if (pulses.length >= MAX_PULSES) pulses.shift()
    pulses.push({ origin: origin.clone(), startTime: performance.now() / 1000 })
  }, [])

  const getUniforms = useCallback((now: number) => {
    // Remove expired pulses (>3s)
    pulsesRef.current = pulsesRef.current.filter((p) => now - p.startTime < 3)

    const origins: Vector3[] = []
    const times: number[] = []

    for (let i = 0; i < MAX_PULSES; i++) {
      if (i < pulsesRef.current.length) {
        origins.push(pulsesRef.current[i].origin)
        times.push(now - pulsesRef.current[i].startTime)
      } else {
        origins.push(new Vector3(0, 0, 0))
        times.push(0)
      }
    }

    return { origins, times }
  }, [])

  return { addPulse, getUniforms }
}
