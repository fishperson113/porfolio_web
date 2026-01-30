'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ 
  children, 
  className = '',
  hover = true 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6',
        'bg-[rgba(18,18,26,0.7)]',
        'backdrop-blur-xl',
        'border border-[rgba(255,255,255,0.1)]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        hover && 'transition-all duration-300 ease-out',
        hover && 'hover:bg-[rgba(26,26,36,0.8)]',
        hover && 'hover:border-[rgba(255,255,255,0.15)]',
        hover && 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
        className
      )}
    >
      {children}
    </div>
  )
}
