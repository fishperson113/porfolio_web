'use client'

import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTiltEffect } from '@/hooks/use-tilt-effect'

interface BentoCardProps {
  children: ReactNode
  className?: string
  spotlight?: boolean
  featured?: boolean
}

export default function BentoCard({
  children,
  className = '',
  spotlight = true,
  featured = false,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const { ref: tiltRef, style: tiltStyle, handlers: tiltHandlers } = useTiltEffect({
    maxRotation: 10,
    scale: 1.02,
  })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && spotlight) {
      const rect = cardRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
    tiltHandlers.onMouseMove(e)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    tiltHandlers.onMouseEnter()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    tiltHandlers.onMouseLeave()
  }

  return (
    <motion.div
      ref={(node) => {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        ;(tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-2xl p-6 overflow-hidden',
        'bg-[rgba(18,18,26,0.7)] backdrop-blur-xl',
        'border border-[rgba(255,255,255,0.1)]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        'transition-colors duration-300 ease-out',
        'hover:border-[rgba(255,255,255,0.2)]',
        featured && 'border-[rgba(173,255,47,0.2)] hover:border-[rgba(173,255,47,0.4)]',
        className
      )}
    >
      {spotlight && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none z-10 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(173, 255, 47, 0.1), transparent 40%)`,
          }}
        />
      )}
      {featured && (
        <div
          className={cn(
            'absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(173, 255, 47, 0.15), transparent 50%)`,
          }}
        />
      )}
      <div className="relative z-20">{children}</div>
    </motion.div>
  )
}
