'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
}

export default function GlowButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
  href
}: GlowButtonProps) {
  const baseStyles = cn(
    'relative inline-flex items-center justify-center',
    'font-semibold rounded-xl',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-[#ADFF2F] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]',
    
    // Size variants
    size === 'sm' && 'px-4 py-2 text-sm',
    size === 'md' && 'px-6 py-3 text-base',
    size === 'lg' && 'px-8 py-4 text-lg',
    
    // Primary variant
    variant === 'primary' && [
      'bg-[#ADFF2F] text-[#0A0A0F]',
      'hover:bg-[#8BCC26]',
      'shadow-[0_0_20px_rgba(173,255,47,0.3)]',
      'hover:shadow-[0_0_30px_rgba(173,255,47,0.5)]',
    ],
    
    // Secondary variant
    variant === 'secondary' && [
      'bg-transparent text-[#FAFAFA]',
      'border border-[rgba(255,255,255,0.2)]',
      'hover:border-[#ADFF2F] hover:text-[#ADFF2F]',
      'hover:shadow-[0_0_20px_rgba(173,255,47,0.2)]',
    ],
    
    className
  )
  
  if (href) {
    const isInternal = href.startsWith('#') || href.startsWith('/')
    return (
      <a 
        href={href} 
        className={baseStyles} 
        target={isInternal ? undefined : '_blank'} 
        rel={isInternal ? undefined : 'noopener noreferrer'}
      >
        {children}
      </a>
    )
  }
  
  return (
    <button onClick={onClick} className={baseStyles}>
      {children}
    </button>
  )
}
