'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks'
import { useCursorState } from '@/hooks/use-cursor-state'

export default function CustomCursor() {
  const prefersReduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const { variant } = useCursorState()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Dot: fast spring
  const dotX = useSpring(cursorX, { stiffness: 300, damping: 30 })
  const dotY = useSpring(cursorY, { stiffness: 300, damping: 30 })

  // Ring: slower spring for lag effect
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20 })
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(hasTouch)
    if (hasTouch) return

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [cursorX, cursorY, visible])

  if (isTouchDevice || prefersReduced) return null

  const dotScale = variant === 'hover' ? 1.5 : variant === 'click' ? 0.8 : 1
  const ringScale = variant === 'hover' ? 1.5 : variant === 'click' ? 0.9 : 1

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="w-2 h-2 -ml-1 -mt-1 rounded-full bg-white"
          animate={{ scale: dotScale }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] mix-blend-difference"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="w-8 h-8 -ml-4 -mt-4 border border-white/40 rounded-full"
          animate={{ scale: ringScale }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  )
}
