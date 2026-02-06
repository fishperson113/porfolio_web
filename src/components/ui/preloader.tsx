'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePreloader } from '@/hooks/use-preloader'

export default function Preloader() {
  const { isLoading, progress } = usePreloader(1500)

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0F]"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-6xl font-bold text-[#FAFAFA]">DP</h1>
              <motion.div
                className="h-1 bg-[#ADFF2F] mt-4 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '120px' }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl font-mono text-[#A1A1AA]"
            >
              {Math.round(progress)}%
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 text-sm text-[#71717A]"
            >
              Initializing experience...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
