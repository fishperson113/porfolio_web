'use client'

import { useRef, useState, MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

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
  featured = false
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotlight) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x, y })
  }
  
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative rounded-2xl p-6 overflow-hidden',
        'bg-[rgba(18,18,26,0.7)]',
        'backdrop-blur-xl',
        'border border-[rgba(255,255,255,0.1)]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        'transition-all duration-300 ease-out',
        'hover:border-[rgba(255,255,255,0.2)]',
        'hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
        featured && 'border-[rgba(173,255,47,0.2)]',
        featured && 'hover:border-[rgba(173,255,47,0.4)]',
        className
      )}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
    >
      {/* Spotlight gradient overlay */}
      {spotlight && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none z-10',
            'transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(173, 255, 47, 0.1), transparent 40%)`,
          }}
        />
      )}
      
      {/* Gradient border effect on hover */}
      {featured && (
        <div
          className={cn(
            'absolute inset-0 rounded-2xl pointer-events-none',
            'transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(173, 255, 47, 0.15), transparent 50%)`,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}
