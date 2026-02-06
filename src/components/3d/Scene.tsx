'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, PerformanceMonitor } from '@react-three/drei'
import { Suspense, ReactNode } from 'react'
import { usePerformanceDegradation } from '@/hooks/use-performance-degradation'

interface SceneProps {
  children: ReactNode
  className?: string
  postProcessing?: boolean
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#ADFF2F] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function Scene({ children, className = '', postProcessing = false }: SceneProps) {
  const { perfLevel, degrade } = usePerformanceDegradation()
  const [degraded, setDegraded] = useState(false)

  const handleDecline = () => {
    setDegraded(true)
    degrade()
  }

  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          dpr={degraded ? [0.5, 1] : [1, 2]}
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{
            antialias: !degraded,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <PerformanceMonitor
            onDecline={handleDecline}
            flipflops={3}
            bounds={() => (perfLevel.level >= 2 ? [20, 40] : [30, 60])}
          >
            {children}
          </PerformanceMonitor>
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}
