'use client'

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/**
 * Wraps Framer Motion's useReducedMotion — checks prefers-reduced-motion system pref.
 * Returns true if motion should be reduced.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}
