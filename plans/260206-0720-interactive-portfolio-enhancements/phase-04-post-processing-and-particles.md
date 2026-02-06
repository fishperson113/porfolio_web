# Phase 4: Post-Processing and Particles

## Context Links

- **Plan Overview:** [plan.md](./plan.md)
- **Phase 3 (Dependency):** [phase-03-synaptic-ripple-shaders.md](./phase-03-synaptic-ripple-shaders.md)
- **Research - 3D/Shaders:** [research/researcher-01-3d-shaders-report.md](./research/researcher-01-3d-shaders-report.md)

## Overview

**Date:** 2026-02-06
**Description:** Add EffectComposer with selective Bloom + Vignette, floating particle system, progressive degradation based on device performance
**Priority:** P1
**Status:** Pending
**Effort:** 8-10 hours

## Key Insights

From research report:
- EffectComposer adds 5-8ms per frame overhead (acceptable for 60fps budget)
- Bloom: luminanceThreshold=0, luminanceSmoothing=0.9 for subtle glow
- Selective bloom via material-level control (emissive property)
- GPU instancing enables 10-20k particles at <3ms per frame
- PerformanceMonitor degradation levels: DepthOfField → Bloom → Vignette only → Disable
- ToneMapping must stay at pipeline end (after all effects)

## Requirements

### Functional Requirements

1. EffectComposer with Bloom + Vignette effects
2. Selective bloom targets: NeuralNetwork nodes/connections, SkillOrbit rings
3. Floating particle system (5000-10000 particles, instanced)
4. Particles with subtle noise-based drift, occasional brightness pulses
5. Progressive degradation system tied to PerformanceMonitor
6. Mobile: Reduce particle count to 2000, disable Bloom by default
7. Bloom intensity controlled by uniform (can be toggled)

### Non-Functional Requirements

- Post-processing overhead: <8ms per frame desktop, <5ms mobile
- Particle system: <3ms per frame
- Total combined: <60fps maintained (16.67ms budget)
- Selective bloom doesn't affect non-target objects
- Particles fade in on load (no visual pop-in)
- TypeScript strict mode compliance

## Architecture

### Effect Pipeline

```
Scene Render
    ↓
EffectComposer
    ├── Bloom (selective, luminance-based)
    ├── Vignette (subtle, offset=0.1, darkness=1.1)
    └── ToneMapping (end of pipeline)
    ↓
Final Output
```

### Degradation Levels

```
Level 0 (High-end): All effects + 10k particles
Level 1 (Mid-tier): Disable DepthOfField (not used) + 5k particles
Level 2 (Low-end): Disable Bloom + 2k particles
Level 3 (Minimal): Vignette only + 1k particles
Level 4 (Emergency): No post-processing, 500 particles
```

### Particle System Architecture

```
FloatingParticles Component
├── InstancedMesh (10k instances)
├── Particle positions (random within bounds)
├── Particle velocities (Perlin noise drift)
├── Particle lifetimes (for pulse effect)
└── Update loop (useFrame)
```

## Related Code Files

### Files to Create

1. `src/components/3d/floating-particles.tsx` (120-150 LOC)
2. `src/components/3d/post-processing-effects.tsx` (80-100 LOC)
3. `src/hooks/use-performance-degradation.ts` (60-80 LOC)

### Files to Modify

1. `src/components/3d/Scene.tsx` - Add EffectComposer wrapper
2. `src/components/3d/NeuralNetwork.tsx` - Set emissive property for bloom
3. `src/components/3d/SkillOrbit.tsx` - Set emissive property for bloom
4. `src/hooks/index.ts` - Export new hook

## Implementation Steps

### Step 1: Create usePerformanceDegradation Hook (60 min)

Create `src/hooks/use-performance-degradation.ts`:

```typescript
'use client'

import { useState, useCallback } from 'react'
import { useDevicePerformance } from './use-device-performance'

export interface PerformanceLevel {
  level: number // 0-4
  bloomEnabled: boolean
  vignetteEnabled: boolean
  particleCount: number
  antialiasing: boolean
}

export function usePerformanceDegradation() {
  const { tier, isMobile } = useDevicePerformance()

  const getInitialLevel = (): PerformanceLevel => {
    if (tier === 'low') {
      return {
        level: 3,
        bloomEnabled: false,
        vignetteEnabled: true,
        particleCount: 1000,
        antialiasing: false
      }
    }
    if (tier === 'mid' || isMobile) {
      return {
        level: 1,
        bloomEnabled: true,
        vignetteEnabled: true,
        particleCount: 5000,
        antialiasing: true
      }
    }
    return {
      level: 0,
      bloomEnabled: true,
      vignetteEnabled: true,
      particleCount: 10000,
      antialiasing: true
    }
  }

  const [perfLevel, setPerfLevel] = useState<PerformanceLevel>(getInitialLevel())

  const degrade = useCallback(() => {
    setPerfLevel((prev) => {
      const newLevel = Math.min(prev.level + 1, 4)

      switch (newLevel) {
        case 1:
          return { ...prev, level: 1, particleCount: 5000 }
        case 2:
          return { ...prev, level: 2, bloomEnabled: false, particleCount: 2000 }
        case 3:
          return { ...prev, level: 3, vignetteEnabled: true, particleCount: 1000, antialiasing: false }
        case 4:
          return { level: 4, bloomEnabled: false, vignetteEnabled: false, particleCount: 500, antialiasing: false }
        default:
          return prev
      }
    })
  }, [])

  return {
    perfLevel,
    degrade
  }
}
```

### Step 2: Create PostProcessingEffects Component (60 min)

Create `src/components/3d/post-processing-effects.tsx`:

```typescript
'use client'

import { Bloom, Vignette, EffectComposer } from '@react-three/postprocessing'
import { usePerformanceDegradation } from '@/hooks/use-performance-degradation'

export default function PostProcessingEffects() {
  const { perfLevel } = usePerformanceDegradation()

  return (
    <EffectComposer>
      {perfLevel.bloomEnabled && (
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          intensity={0.5}
          height={300}
          mipmapBlur
        />
      )}
      {perfLevel.vignetteEnabled && (
        <Vignette
          offset={0.1}
          darkness={1.1}
          eskil={false}
        />
      )}
    </EffectComposer>
  )
}
```

### Step 3: Create FloatingParticles Component (120 min)

Create `src/components/3d/floating-particles.tsx`:

```typescript
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color, SphereGeometry, MeshBasicMaterial } from 'three'
import { usePerformanceDegradation } from '@/hooks/use-performance-degradation'

interface Particle {
  position: [number, number, number]
  velocity: [number, number, number]
  phase: number
}

export default function FloatingParticles() {
  const meshRef = useRef<InstancedMesh>(null)
  const { perfLevel } = usePerformanceDegradation()
  const particleCount = perfLevel.particleCount

  // Generate particles
  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10
        ],
        velocity: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.005
        ],
        phase: Math.random() * Math.PI * 2
      })
    }
    return arr
  }, [particleCount])

  const tempObject = useMemo(() => new Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime

    particles.forEach((particle, i) => {
      // Update position with drift
      particle.position[0] += particle.velocity[0]
      particle.position[1] += particle.velocity[1]
      particle.position[2] += particle.velocity[2]

      // Wrap around boundaries
      if (Math.abs(particle.position[0]) > 10) particle.position[0] *= -0.9
      if (Math.abs(particle.position[1]) > 10) particle.position[1] *= -0.9
      if (Math.abs(particle.position[2]) > 5) particle.position[2] *= -0.9

      // Set instance transform
      tempObject.position.set(...particle.position)

      // Occasional brightness pulse (scale)
      const pulse = 1 + 0.2 * Math.sin(time * 2 + particle.phase)
      tempObject.scale.setScalar(pulse * 0.02)

      tempObject.updateMatrix()
      meshRef.current!.setMatrixAt(i, tempObject.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#FAFAFA" transparent opacity={0.15} />
    </instancedMesh>
  )
}
```

### Step 4: Modify Scene.tsx with EffectComposer (30 min)

Modify `src/components/3d/Scene.tsx`:

```typescript
import PostProcessingEffects from './post-processing-effects'
import { usePerformanceDegradation } from '@/hooks/use-performance-degradation'

export default function Scene({ children }: SceneProps) {
  const { perfLevel, degrade } = usePerformanceDegradation()

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, perfLevel.antialiasing ? 2 : 1]}
      gl={{ alpha: true, antialias: perfLevel.antialiasing }}
    >
      <Suspense fallback={null}>
        <PerformanceMonitor onDecline={degrade} flipflops={3}>
          {children}
          <PostProcessingEffects />
        </PerformanceMonitor>
      </Suspense>
      <Preload all />
    </Canvas>
  )
}
```

### Step 5: Add Particles to Hero Section (15 min)

Modify `src/components/sections/Hero.tsx`:

```typescript
const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false })
const NeuralNetwork = dynamic(() => import('@/components/3d/NeuralNetwork'), { ssr: false })
const FloatingParticles = dynamic(() => import('@/components/3d/floating-particles'), { ssr: false })

// In JSX
<Scene>
  <NeuralNetwork />
  <FloatingParticles />
</Scene>
```

### Step 6: Enable Selective Bloom on NeuralNetwork (30 min)

Modify `src/components/3d/NeuralNetwork.tsx`:

```typescript
// In shader material uniforms, ensure emissive property set
const nodeShaderMaterial = useMemo(() => {
  return new ShaderMaterial({
    uniforms: {
      // ... existing uniforms
      uEmissiveIntensity: { value: 0.3 } // Bloom will pick this up
    },
    // ...
  })
}, [])

// Alternative: If using MeshBasicMaterial for fallback
material.emissive = new Color('#ADFF2F')
material.emissiveIntensity = 0.3
```

### Step 7: Enable Selective Bloom on SkillOrbit (30 min)

Modify `src/components/3d/SkillOrbit.tsx`:

```typescript
// Add emissive glow to skill orbit rings
<mesh>
  <torusGeometry args={[radius, 0.02, 16, 100]} />
  <meshBasicMaterial
    color={color}
    transparent
    opacity={0.4}
    emissive={color}
    emissiveIntensity={0.2}
  />
</mesh>
```

### Step 8: Test Post-Processing and Particles (60 min)

Test checklist:
- [ ] Bloom visible on NeuralNetwork nodes/connections
- [ ] Bloom visible on SkillOrbit rings
- [ ] Vignette applied to entire scene
- [ ] 10k particles visible (desktop high-tier)
- [ ] Particles drift smoothly with noise
- [ ] Particles pulse brightness subtly
- [ ] Performance degradation triggers on low FPS (throttle CPU in DevTools)
- [ ] Mobile starts with reduced effects (5k particles, bloom on)
- [ ] Low-tier devices start with minimal effects
- [ ] No bloom on non-target objects (background, UI)

## Todo List

- [ ] Create use-performance-degradation.ts hook
- [ ] Create post-processing-effects.tsx component
- [ ] Create floating-particles.tsx component
- [ ] Modify Scene.tsx with EffectComposer
- [ ] Add FloatingParticles to Hero section
- [ ] Set emissive properties on NeuralNetwork
- [ ] Set emissive properties on SkillOrbit
- [ ] Update hooks/index.ts barrel export
- [ ] Test bloom on target objects only
- [ ] Test vignette effect
- [ ] Test particle rendering (10k particles)
- [ ] Test performance degradation levels
- [ ] Test mobile starts with reduced settings
- [ ] Verify <8ms post-processing overhead
- [ ] Commit changes

## Success Criteria

- [ ] Bloom visible only on NeuralNetwork + SkillOrbit (selective)
- [ ] Vignette applied subtly to scene edges
- [ ] 10k particles on high-tier desktop (5k mid, 2k low, 1k minimal)
- [ ] Particles drift smoothly without stutter
- [ ] Performance: <8ms post-processing, <3ms particles (Chrome DevTools)
- [ ] Degradation triggers correctly on simulated low FPS
- [ ] Mobile defaults to mid-tier settings
- [ ] No visual pop-in for particles (fade in)
- [ ] Bundle size increase ≤25KB gzipped

## Risk Assessment

**Risk:** Post-processing overhead exceeds 8ms budget
**Mitigation:** Aggressive degradation levels, disable Bloom on first decline (mobile)

**Risk:** Selective bloom affects unintended objects
**Mitigation:** Carefully set emissive properties only on target materials, test thoroughly

**Risk:** Too many particles cause performance issues
**Mitigation:** Hard limits per tier, instancing mandatory, particles optimized (low-poly spheres)

**Risk:** EffectComposer breaks transparency on 3D objects
**Mitigation:** Ensure transparent materials have `depthWrite: false`, render order correct

## Security Considerations

- No external particle texture loading (procedural geometry only)
- Post-processing shaders from trusted @react-three/postprocessing package
- No user-controlled effect parameters

## Next Steps

**Dependencies:** Phase 3 (Shader materials with emissive properties)
**Unblocks:** Phase 7 (Preloader can show particle system loading)
**Follow-up:** In Phase 8, benchmark post-processing overhead on mobile devices
