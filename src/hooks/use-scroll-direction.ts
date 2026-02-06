'use client'

import { useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'

export type ScrollDirection = 'up' | 'down' | 'none'

export function useScrollDirection(threshold = 10) {
  const { scrollY } = useScroll()
  const [direction, setDirection] = useState<ScrollDirection>('none')

  useEffect(() => {
    let lastY = scrollY.get()

    const unsubscribe = scrollY.on('change', (current) => {
      const diff = current - lastY
      if (Math.abs(diff) < threshold) return
      setDirection(diff > 0 ? 'down' : 'up')
      lastY = current
    })

    return () => unsubscribe()
  }, [scrollY, threshold])

  return direction
}
