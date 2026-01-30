'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Suspense, ReactNode } from 'react'

interface SceneProps {
  children: ReactNode
  className?: string
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#ADFF2F] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function Scene({ children, className = '' }: SceneProps) {
  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          style={{ background: 'transparent' }}
        >
          {children}
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}
