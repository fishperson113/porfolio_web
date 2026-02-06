'use client'

import { useRef, useState } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { useReducedMotion } from './use-reduced-motion'

interface TiltOptions {
  maxRotation?: number
  perspective?: number
  scale?: number
}

interface TiltResult {
  ref: React.RefObject<HTMLDivElement | null>
  style: {
    rotateX: MotionValue<number>
    rotateY: MotionValue<number>
    scale: number
    transformPerspective: number
  } | Record<string, never>
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
}

export function useTiltEffect(options: TiltOptions = {}): TiltResult {
  const { maxRotation = 12, perspective = 1000, scale: hoverScale = 1.02 } = options
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springConfig = { stiffness: 300, damping: 20 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || prefersReduced) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    rotateY.set(x * maxRotation * 2)
    rotateX.set(-y * maxRotation * 2)
  }

  const onMouseEnter = () => setIsHovered(true)
  const onMouseLeave = () => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
  }

  const style = prefersReduced
    ? ({} as Record<string, never>)
    : {
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: isHovered ? hoverScale : 1,
        transformPerspective: perspective,
      }

  return { ref, style, handlers: { onMouseMove, onMouseEnter, onMouseLeave } }
}
