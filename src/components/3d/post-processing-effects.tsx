'use client'

import { Bloom, Vignette, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { usePerformanceDegradation } from '@/hooks/use-performance-degradation'

export default function PostProcessingEffects() {
  const { perfLevel } = usePerformanceDegradation()

  // Don't render at all in emergency mode
  if (perfLevel.level >= 4) return null

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={perfLevel.bloomEnabled ? 0.4 : 0}
        mipmapBlur
      />
      <Vignette
        offset={perfLevel.vignetteEnabled ? 0.1 : 0}
        darkness={perfLevel.vignetteEnabled ? 1.1 : 0}
      />
      <ToneMapping />
    </EffectComposer>
  )
}
