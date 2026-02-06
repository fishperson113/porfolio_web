# Phase 1: Foundation and Infrastructure

## Context Links

- **Plan Overview:** [plan.md](./plan.md)
- **Research - 3D/Shaders:** [research/researcher-01-3d-shaders-report.md](./research/researcher-01-3d-shaders-report.md)
- **Research - UI/Scroll:** [research/researcher-02-ui-scroll-cursor-report.md](./research/researcher-02-ui-scroll-cursor-report.md)
- **Codebase Summary:** `c:/workspace/porfolio_web/docs/codebase-summary.md`

## Overview

**Date:** 2026-02-06
**Description:** Establish performance monitoring, accessibility infrastructure, and shared utilities for all subsequent phases
**Priority:** P0 (Blocking)
**Status:** Pending
**Effort:** 6-8 hours

## Key Insights

- PerformanceMonitor from Drei enables progressive degradation (research report: 3-5 flipflops threshold)
- `prefers-reduced-motion` must be checked in every animated component (WCAG 2.3.3 requirement)
- Device detection at foundation level prevents performance issues later
- Motion context allows global toggle independent of system preference

## Requirements

### Functional Requirements

1. Install @react-three/postprocessing dependency
2. Create useReducedMotion hook wrapper (Framer Motion hook)
3. Create useDevicePerformance hook (detect mobile, CPU cores, GPU tier)
4. Create MotionProvider context for global motion toggle
5. Integrate PerformanceMonitor into Scene.tsx
6. Export all hooks from centralized location

### Non-Functional Requirements

- Zero runtime overhead when motion disabled
- Performance monitoring adds <1ms per frame
- Device detection runs once on mount
- TypeScript strict mode compliance
- Bundle size increase <10KB gzipped

## Architecture

### Component Hierarchy

```
App
├── MotionProvider (new)
│   └── Page
│       ├── Hero (uses useReducedMotion)
│       ├── About (uses useReducedMotion)
│       ├── Skills → Scene (uses PerformanceMonitor)
│       └── ...
```

### Data Flow

```
System Preference (prefers-reduced-motion)
    ↓
useReducedMotion hook
    ↓
Motion variants (conditional animation)

User Toggle (button)
    ↓
MotionContext
    ↓
useMotionPreference hook
    ↓
All animated components
```

### Hook API Design

```typescript
// useReducedMotion - wraps Framer Motion hook
const prefersReducedMotion = useReducedMotion()
// Returns: boolean (true if motion should be reduced)

// useDevicePerformance - detects device capabilities
const { isMobile, isLowEnd, tier } = useDevicePerformance()
// Returns: { isMobile: boolean, isLowEnd: boolean, tier: 'high' | 'mid' | 'low' }

// useMotionPreference - combines system + user preference
const { motionEnabled, toggleMotion } = useMotionPreference()
// Returns: { motionEnabled: boolean, toggleMotion: () => void }
```

## Related Code Files

### Files to Create

1. `src/hooks/use-reduced-motion.ts` (15-20 LOC)
2. `src/hooks/use-device-performance.ts` (40-50 LOC)
3. `src/hooks/use-motion-preference.ts` (30-40 LOC)
4. `src/contexts/motion-context.tsx` (60-80 LOC)
5. `src/hooks/index.ts` (10 LOC - barrel export)

### Files to Modify

1. `src/components/3d/Scene.tsx` - Add PerformanceMonitor wrapper
2. `src/app/layout.tsx` - Wrap with MotionProvider
3. `package.json` - Add @react-three/postprocessing

## Implementation Steps

### Step 1: Install Dependencies (10 min)

```bash
npm install @react-three/postprocessing
```

Verify version: `@react-three/postprocessing@^3.0.0` (latest as of 2026)

### Step 2: Create useReducedMotion Hook (15 min)

Create `src/hooks/use-reduced-motion.ts`:

```typescript
'use client'

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/**
 * Wrapper around Framer Motion's useReducedMotion hook
 * Checks system preference: prefers-reduced-motion
 * @returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}
```

### Step 3: Create useDevicePerformance Hook (45 min)

Create `src/hooks/use-device-performance.ts`:

```typescript
'use client'

import { useState, useEffect } from 'react'

export interface DevicePerformance {
  isMobile: boolean
  isLowEnd: boolean
  tier: 'high' | 'mid' | 'low'
  cpuCores: number
}

export function useDevicePerformance(): DevicePerformance {
  const [performance, setPerformance] = useState<DevicePerformance>({
    isMobile: false,
    isLowEnd: false,
    tier: 'high',
    cpuCores: 4
  })

  useEffect(() => {
    // Detect mobile
    const isMobile = /mobile|tablet|android|iphone|ipad/i.test(navigator.userAgent)

    // Detect CPU cores
    const cpuCores = navigator.hardwareConcurrency || 4

    // Detect GPU tier (basic heuristic)
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ''

    const isLowEndGPU = /intel hd|intel(r) hd|mali-4/i.test(renderer as string)

    // Determine tier
    let tier: 'high' | 'mid' | 'low' = 'high'
    if (isMobile && cpuCores < 4) tier = 'low'
    else if (isMobile || cpuCores < 6 || isLowEndGPU) tier = 'mid'

    setPerformance({
      isMobile,
      isLowEnd: tier === 'low',
      tier,
      cpuCores
    })
  }, [])

  return performance
}
```

### Step 4: Create MotionContext (60 min)

Create `src/contexts/motion-context.tsx`:

```typescript
'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface MotionContextValue {
  motionEnabled: boolean
  toggleMotion: () => void
  systemPreference: boolean
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined)

interface MotionProviderProps {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  const systemPreference = useReducedMotion()
  const [userOverride, setUserOverride] = useState<boolean | null>(null)

  // Load user preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('motion-preference')
    if (stored !== null) {
      setUserOverride(stored === 'enabled')
    }
  }, [])

  // Determine final motion state
  const motionEnabled = userOverride !== null
    ? userOverride
    : !systemPreference

  const toggleMotion = () => {
    const newValue = !motionEnabled
    setUserOverride(newValue)
    localStorage.setItem('motion-preference', newValue ? 'enabled' : 'disabled')
  }

  return (
    <MotionContext.Provider value={{ motionEnabled, toggleMotion, systemPreference }}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotionPreference(): MotionContextValue {
  const context = useContext(MotionContext)
  if (!context) {
    throw new Error('useMotionPreference must be used within MotionProvider')
  }
  return context
}
```

### Step 5: Create Barrel Export (10 min)

Create `src/hooks/index.ts`:

```typescript
export { useReducedMotion } from './use-reduced-motion'
export { useDevicePerformance } from './use-device-performance'
export { useMotionPreference } from '@/contexts/motion-context'
export type { DevicePerformance } from './use-device-performance'
```

### Step 6: Integrate PerformanceMonitor into Scene (30 min)

Modify `src/components/3d/Scene.tsx`:

```typescript
// Add imports
import { PerformanceMonitor } from '@react-three/drei'
import { useDevicePerformance } from '@/hooks'

// Inside Scene component
export default function Scene({ children }: SceneProps) {
  const { tier } = useDevicePerformance()
  const [degraded, setDegraded] = useState(false)

  const handleDecline = () => {
    console.warn('Performance declining, reducing quality')
    setDegraded(true)
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={degraded ? [0.5, 1] : [1, 2]}
      gl={{ alpha: true, antialias: !degraded }}
    >
      <Suspense fallback={null}>
        <PerformanceMonitor
          onDecline={handleDecline}
          flipflops={3}
          bounds={(fps) => (tier === 'low' ? fps < 20 : fps < 30)}
        >
          {children}
        </PerformanceMonitor>
      </Suspense>
      <Preload all />
    </Canvas>
  )
}
```

### Step 7: Wrap App with MotionProvider (15 min)

Modify `src/app/layout.tsx`:

```typescript
import { MotionProvider } from '@/contexts/motion-context'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
```

### Step 8: Update package.json (5 min)

Ensure dependency added:

```json
{
  "dependencies": {
    "@react-three/postprocessing": "^3.0.0"
  }
}
```

### Step 9: Test Infrastructure (45 min)

Create test file `src/components/test-motion.tsx` (temporary):

```typescript
'use client'

import { useReducedMotion, useDevicePerformance, useMotionPreference } from '@/hooks'

export default function TestMotion() {
  const prefersReduced = useReducedMotion()
  const device = useDevicePerformance()
  const { motionEnabled, toggleMotion } = useMotionPreference()

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white text-xs">
      <div>System Prefers Reduced: {String(prefersReduced)}</div>
      <div>Motion Enabled: {String(motionEnabled)}</div>
      <div>Device Tier: {device.tier}</div>
      <div>CPU Cores: {device.cpuCores}</div>
      <button onClick={toggleMotion} className="mt-2 px-2 py-1 bg-white/20">
        Toggle Motion
      </button>
    </div>
  )
}
```

Test checklist:
- [ ] Toggle button works, persists to localStorage
- [ ] System preference detected correctly
- [ ] Device tier calculated (check console)
- [ ] PerformanceMonitor triggers degradation on low FPS

## Todo List

- [ ] Install @react-three/postprocessing
- [ ] Create use-reduced-motion.ts hook
- [ ] Create use-device-performance.ts hook
- [ ] Create motion-context.tsx provider
- [ ] Create hooks/index.ts barrel export
- [ ] Modify Scene.tsx with PerformanceMonitor
- [ ] Modify layout.tsx with MotionProvider
- [ ] Create test component
- [ ] Test all hooks functionality
- [ ] Test localStorage persistence
- [ ] Test performance degradation
- [ ] Remove test component
- [ ] Commit changes

## Success Criteria

- [ ] `npm run build` succeeds with no errors
- [ ] All TypeScript types strict-mode compliant
- [ ] useReducedMotion returns correct system preference
- [ ] useDevicePerformance detects mobile devices correctly
- [ ] Motion toggle persists across page reloads
- [ ] PerformanceMonitor degrades quality on simulated low FPS (throttle CPU in DevTools)
- [ ] Bundle size increase ≤10KB gzipped (check with `next build`)
- [ ] No console errors in development or production

## Risk Assessment

**Risk:** PerformanceMonitor false positives on initial load
**Mitigation:** Set `flipflops={3}` to require 3 consecutive drops before degrading

**Risk:** localStorage not available (SSR, privacy mode)
**Mitigation:** Wrapped in try-catch, defaults to system preference

**Risk:** Device detection inaccurate on new devices
**Mitigation:** Conservative tier assignment (assume mid-tier by default), allow override

**Risk:** Hook dependency chain too complex
**Mitigation:** Keep hooks independent, MotionContext only depends on useReducedMotion

## Security Considerations

- localStorage usage safe (no sensitive data, only 'enabled'/'disabled')
- No external API calls
- GPU detection uses standard WebGL extension (no fingerprinting concern)

## Next Steps

**Dependencies:** None (Phase 1 is foundation)
**Unblocks:** Phase 2 (Cursor), Phase 3 (Shaders), Phase 5 (Scroll), Phase 6 (Text/Tilt), Phase 7 (Preloader)
**Follow-up:** After Phase 8, consider exposing motion toggle UI in navigation bar
