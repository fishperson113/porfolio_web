'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useKonamiCode } from '@/hooks/use-konami-code'

export default function EasterEgg() {
  const activated = useKonamiCode()

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          className="fixed inset-0 z-[90] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Color flash */}
          <motion.div
            className="absolute inset-0 bg-[#ADFF2F]"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />

          {/* Center message */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
          >
            <div className="text-6xl mb-4">🎮</div>
            <div className="text-2xl font-bold text-[#ADFF2F]">Secret Unlocked!</div>
            <div className="text-sm text-[#FAFAFA] mt-2">You found the easter egg</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
