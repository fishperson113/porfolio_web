'use client'

import { useRef, useEffect, useState } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { useReducedMotion } from './use-reduced-motion'

interface MagneticOptions {
  strength?: number
  radius?: number
}

interface MagneticResult {
  ref: React.RefObject<HTMLElement | null>
  x: MotionValue<number>
  y: MotionValue<number>
}

export function useMagneticEffect(options: MagneticOptions = {}): MagneticResult {
  const { strength = 0.3, radius = 80 } = options
  const ref = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const x = useSpring(mouseX, { stiffness: 150, damping: 15 })
  const y = useSpring(mouseY, { stiffness: 150, damping: 15 })

  useEffect(() => {
    if (!ref.current || prefersReduced) return

    const el = ref.current

    const onMove = (e: MouseEvent) => {
      if (!isHovered) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < radius) {
        const force = strength * (1 - dist / radius)
        mouseX.set(dx * force)
        mouseY.set(dy * force)
      } else {
        mouseX.set(0)
        mouseY.set(0)
      }
    }

    const onEnter = () => setIsHovered(true)
    const onLeave = () => {
      setIsHovered(false)
      mouseX.set(0)
      mouseY.set(0)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousemove', onMove)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousemove', onMove)
    }
  }, [isHovered, mouseX, mouseY, radius, strength, prefersReduced])

  return { ref, x, y }
}
