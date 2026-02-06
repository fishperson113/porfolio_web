'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { useActiveSection } from '@/hooks/use-active-section'
import { useReducedMotion } from '@/hooks'
import ScrollProgress from './scroll-progress'
import MotionToggleButton from '@/components/ui/motion-toggle-button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]

const SECTION_IDS = NAV_LINKS.map((l) => l.id)

export default function StickyNavigation() {
  const { scrollY } = useScroll()
  const direction = useScrollDirection(10)
  const activeSection = useActiveSection(SECTION_IDS)
  const prefersReduced = useReducedMotion()
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => {
      setShouldShow(y > 100 && direction !== 'up')
    })
    return () => unsubscribe()
  }, [scrollY, direction])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.offsetTop - 80
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' })
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: shouldShow ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="relative bg-[rgba(18,18,26,0.8)] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleClick('hero')}
              className="text-xl font-bold text-[#FAFAFA] hover:text-[#ADFF2F] transition-colors"
            >
              DP
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex gap-8">
                {NAV_LINKS.filter((l) => l.id !== 'hero').map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleClick(link.id)}
                    className={cn(
                      'text-sm font-medium transition-colors duration-200',
                      activeSection === link.id
                        ? 'text-[#ADFF2F]'
                        : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                    )}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="h-5 w-px bg-white/10" />
              <MotionToggleButton />
            </div>
          </div>
        </div>
        <ScrollProgress />
      </div>
    </motion.nav>
  )
}
