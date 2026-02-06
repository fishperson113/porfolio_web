'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMagneticEffect } from '@/hooks/use-magnetic-effect'
import { useCursorState } from '@/hooks/use-cursor-state'

interface GlowButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
  magnetic?: boolean
}

export default function GlowButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  magnetic = true,
}: GlowButtonProps) {
  const { ref: magneticRef, x, y } = useMagneticEffect({ strength: 0.3, radius: 100 })
  const { setHover, setDefault } = useCursorState()

  const baseStyles = cn(
    'relative inline-flex items-center justify-center',
    'font-semibold rounded-xl',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-[#ADFF2F] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]',
    size === 'sm' && 'px-4 py-2 text-sm',
    size === 'md' && 'px-6 py-3 text-base',
    size === 'lg' && 'px-8 py-4 text-lg',
    variant === 'primary' && [
      'bg-[#ADFF2F] text-[#0A0A0F]',
      'hover:bg-[#8BCC26]',
      'shadow-[0_0_20px_rgba(173,255,47,0.3)]',
      'hover:shadow-[0_0_30px_rgba(173,255,47,0.5)]',
    ],
    variant === 'secondary' && [
      'bg-transparent text-[#FAFAFA]',
      'border border-[rgba(255,255,255,0.2)]',
      'hover:border-[#ADFF2F] hover:text-[#ADFF2F]',
      'hover:shadow-[0_0_20px_rgba(173,255,47,0.2)]',
    ],
    className
  )

  const cursorHandlers = {
    onMouseEnter: () => setHover(),
    onMouseLeave: () => setDefault(),
  }

  const content = href ? (
    <a
      href={href}
      className={baseStyles}
      target={href.startsWith('#') || href.startsWith('/') ? undefined : '_blank'}
      rel={href.startsWith('#') || href.startsWith('/') ? undefined : 'noopener noreferrer'}
      {...cursorHandlers}
    >
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={baseStyles} {...cursorHandlers}>
      {children}
    </button>
  )

  if (!magnetic) return content

  return (
    <motion.div ref={magneticRef as React.RefObject<HTMLDivElement>} style={{ x, y }} className="inline-block">
      {content}
    </motion.div>
  )
}
