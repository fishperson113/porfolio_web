'use client'

import { motion } from 'framer-motion'
import { useMotionPreference } from '@/hooks'
import { cn } from '@/lib/utils'

export default function MotionToggleButton() {
  const { motionEnabled, toggleMotion } = useMotionPreference()

  return (
    <motion.button
      onClick={toggleMotion}
      className={cn(
        'relative p-2 rounded-lg transition-colors',
        'bg-white/5 hover:bg-white/10',
        'border border-white/10'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={motionEnabled ? 'Disable animations' : 'Enable animations'}
      title={`Animations: ${motionEnabled ? 'ON' : 'OFF'}`}
    >
      <div className="relative w-5 h-5">
        {motionEnabled ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#ADFF2F]">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#FAFAFA]">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
    </motion.button>
  )
}
