# Phase 7: Preloader and Creative Details

## Context Links

- **Plan Overview:** [plan.md](./plan.md)
- **Phase 6 (Dependency):** [phase-06-text-reveals-and-card-tilt.md](./phase-06-text-reveals-and-card-tilt.md)
- **Research - UI/Scroll:** [research/researcher-02-ui-scroll-cursor-report.md](./research/researcher-02-ui-scroll-cursor-report.md)

## Overview

**Date:** 2026-02-06
**Description:** Branded preloader with animation sequence, page entrance orchestration, easter egg (Konami code), motion toggle button
**Priority:** P1
**Status:** Pending
**Effort:** 8-10 hours

## Key Insights

From research report:
- Preloader best practices: logo reveal, progress counter, smooth transition to main content
- Page entrance orchestration: nav → hero → content with staggered delays (100-200ms)
- Easter eggs: Konami code listener (↑↑↓↓←→←→BA), click counter, console messages
- Motion toggle: top-right corner, mute/unmute style icon, persists to localStorage
- Always default to system preference, allow user override
- Exit animations before route change (SPA pattern, less critical for static site)

## Requirements

### Functional Requirements

1. Branded preloader/loading screen with logo animation
2. Progress counter (0-100%) based on asset loading
3. Smooth fade-out transition from preloader to main content
4. Page entrance orchestration: nav (0ms) → hero (200ms) → sections (400ms)
5. Konami code easter egg triggers special effect (particle burst, color shift)
6. Motion toggle button in sticky navigation (icon: play/pause)
7. Motion toggle respects system preference as default
8. Toggle state persists to localStorage
9. All animations respect final motion state

### Non-Functional Requirements

- Preloader visible minimum 1.5s (brand impression, avoid flash)
- Preloader dismisses automatically when assets loaded + min time elapsed
- Entrance animations total <2s (avoid excessive delay)
- Easter egg effect <3s duration (doesn't block interaction)
- Toggle button accessible (keyboard, screen reader)
- TypeScript strict mode compliance

## Architecture

### Component Hierarchy

```
App
├── Preloader (new)
│   ├── Logo animation
│   ├── Progress counter
│   └── Exit transition
├── PageEntrance (new wrapper)
│   ├── StickyNavigation (immediate)
│   ├── Hero (delay: 200ms)
│   └── Sections (delay: 400ms)
└── EasterEgg (new, hidden)
    └── Special effect overlay
```

### Data Flow

```
Load Event → Track Progress → Update Counter → Min Time + Assets Loaded → Hide Preloader

Preloader Exit → Trigger PageEntrance → Stagger Section Reveals

Konami Code Input → Validate Sequence → Trigger Easter Egg Effect

Motion Toggle Click → Update Context → Persist localStorage → Re-render Animations
```

### Preloader State Machine

```
Loading:
- Show preloader
- Track progress (0-100%)
- Wait for: assets loaded AND min time elapsed

Ready:
- Trigger exit animation
- Duration: 600ms
- Fade out + scale down

Complete:
- Hide preloader (display: none)
- Trigger page entrance sequence
```

## Related Code Files

### Files to Create

1. `src/components/ui/preloader.tsx` (100-120 LOC)
2. `src/components/ui/page-entrance.tsx` (60-80 LOC)
3. `src/components/ui/motion-toggle-button.tsx` (60-80 LOC)
4. `src/components/effects/easter-egg.tsx` (80-100 LOC)
5. `src/hooks/use-konami-code.ts` (60-80 LOC)
6. `src/hooks/use-preloader.ts` (80-100 LOC)

### Files to Modify

1. `src/app/layout.tsx` - Add Preloader and EasterEgg
2. `src/app/page.tsx` - Wrap with PageEntrance
3. `src/components/navigation/sticky-navigation.tsx` - Add MotionToggleButton
4. `src/hooks/index.ts` - Export new hooks

## Implementation Steps

### Step 1: Create usePreloader Hook (60 min)

Create `src/hooks/use-preloader.ts`:

```typescript
'use client'

import { useState, useEffect } from 'react'

interface PreloaderState {
  isLoading: boolean
  progress: number
}

export function usePreloader(minDuration = 1500) {
  const [state, setState] = useState<PreloaderState>({
    isLoading: true,
    progress: 0
  })

  useEffect(() => {
    const startTime = Date.now()
    let assetsLoaded = false

    // Simulate asset loading progress
    const progressInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 15, 95)
      }))
    }, 100)

    // Track actual asset loading
    const handleLoad = () => {
      assetsLoaded = true
      checkComplete()
    }

    const checkComplete = () => {
      const elapsedTime = Date.now() - startTime
      const minTimeMet = elapsedTime >= minDuration

      if (assetsLoaded && minTimeMet) {
        setState({ isLoading: false, progress: 100 })
        clearInterval(progressInterval)
      } else {
        // Wait for remaining time
        const remainingTime = Math.max(0, minDuration - elapsedTime)
        setTimeout(() => {
          setState({ isLoading: false, progress: 100 })
          clearInterval(progressInterval)
        }, remainingTime)
      }
    }

    // Listen for page load
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      clearInterval(progressInterval)
    }
  }, [minDuration])

  return state
}
```

### Step 2: Create Preloader Component (75 min)

Create `src/components/ui/preloader.tsx`:

```typescript
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
            {/* Logo Animation */}
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
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ maxWidth: '120px' }}
              />
            </motion.div>

            {/* Progress Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl font-mono text-[#A1A1AA]"
            >
              {Math.round(progress)}%
            </motion.div>

            {/* Loading Text */}
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
```

### Step 3: Create PageEntrance Component (45 min)

Create `src/components/ui/page-entrance.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks'
import type { ReactNode } from 'react'

interface PageEntranceProps {
  children: ReactNode
  delay?: number
}

export default function PageEntrance({ children, delay = 0 }: PageEntranceProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0 : 0.8,
        delay: prefersReduced ? 0 : delay / 1000,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  )
}
```

### Step 4: Create useKonamiCode Hook (60 min)

Create `src/hooks/use-konami-code.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]

export function useKonamiCode() {
  const [activated, setActivated] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...sequence, e.key].slice(-KONAMI_CODE.length)
      setSequence(newSequence)

      // Check if sequence matches Konami code
      const matches = newSequence.every((key, index) => key === KONAMI_CODE[index])

      if (matches) {
        setActivated(true)
        console.log('🎮 Konami Code Activated! 🎉')

        // Reset after effect
        setTimeout(() => {
          setActivated(false)
          setSequence([])
        }, 3000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sequence])

  return activated
}
```

### Step 5: Create EasterEgg Component (60 min)

Create `src/components/effects/easter-egg.tsx`:

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useKonamiCode } from '@/hooks/use-konami-code'
import { useMemo } from 'react'

export default function EasterEgg() {
  const activated = useKonamiCode()

  // Generate random particle positions
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 0.5
    }))
  }, [activated])

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
          {/* Color overlay flash */}
          <motion.div
            className="absolute inset-0 bg-[#ADFF2F]"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />

          {/* Particle burst */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 bg-[#ADFF2F] rounded-full"
              style={{
                left: particle.x,
                top: particle.y
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: particle.scale * 3,
                opacity: 0,
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400
              }}
              transition={{
                duration: 1.5,
                delay: particle.delay,
                ease: 'easeOut'
              }}
            />
          ))}

          {/* Center message */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
          >
            <div className="text-6xl mb-4">🎮</div>
            <div className="text-2xl font-bold text-[#ADFF2F]">
              Secret Unlocked!
            </div>
            <div className="text-sm text-[#FAFAFA] mt-2">
              You found the easter egg
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Step 6: Create MotionToggleButton Component (60 min)

Create `src/components/ui/motion-toggle-button.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { useMotionPreference } from '@/hooks'
import { cn } from '@/lib/utils'

export default function MotionToggleButton() {
  const { motionEnabled, toggleMotion, systemPreference } = useMotionPreference()

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
      title={`Animations: ${motionEnabled ? 'ON' : 'OFF'}${systemPreference ? ' (System: Reduced)' : ''}`}
    >
      <div className="relative w-5 h-5">
        {/* Play icon (when motion disabled) */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('absolute inset-0 text-[#FAFAFA]', motionEnabled && 'hidden')}
        >
          <path d="M8 5v14l11-7z" />
        </motion.svg>

        {/* Pause icon (when motion enabled) */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('absolute inset-0 text-[#ADFF2F]', !motionEnabled && 'hidden')}
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </motion.svg>
      </div>

      {/* Active indicator dot */}
      {motionEnabled && (
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-[#ADFF2F] rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </motion.button>
  )
}
```

### Step 7: Integrate Preloader into Layout (20 min)

Modify `src/app/layout.tsx`:

```typescript
import Preloader from '@/components/ui/preloader'
import EasterEgg from '@/components/effects/easter-egg'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MotionProvider>
          <Preloader />
          <CustomCursor />
          <EasterEgg />
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
```

### Step 8: Wrap Page with Entrance Orchestration (30 min)

Modify `src/app/page.tsx`:

```typescript
import PageEntrance from '@/components/ui/page-entrance'

export default function Home() {
  return (
    <main>
      {/* Navigation - immediate (delay: 0) */}
      <PageEntrance delay={0}>
        <StickyNavigation />
      </PageEntrance>

      {/* Hero - delayed (delay: 200ms) */}
      <PageEntrance delay={200}>
        <Hero />
      </PageEntrance>

      {/* Sections - staggered (delay: 400ms+) */}
      <PageEntrance delay={400}>
        <section id="about"><About /></section>
      </PageEntrance>

      <PageEntrance delay={500}>
        <section id="projects"><Projects /></section>
      </PageEntrance>

      <PageEntrance delay={600}>
        <section id="skills"><Skills /></section>
      </PageEntrance>

      <PageEntrance delay={700}>
        <section id="achievements"><Achievements /></section>
      </PageEntrance>

      <PageEntrance delay={800}>
        <section id="contact"><Contact /></section>
      </PageEntrance>
    </main>
  )
}
```

### Step 9: Add Motion Toggle to Navigation (20 min)

Modify `src/components/navigation/sticky-navigation.tsx`:

```typescript
import MotionToggleButton from '@/components/ui/motion-toggle-button'

export default function StickyNavigation() {
  return (
    <motion.nav className="...">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Duong Pham</div>

          <div className="flex items-center gap-6">
            {/* Nav Links */}
            <div className="flex gap-8">
              {navLinks.map((link) => (...))}
            </div>

            {/* Motion Toggle */}
            <MotionToggleButton />
          </div>
        </div>
      </div>
      <ScrollProgress />
    </motion.nav>
  )
}
```

### Step 10: Update Hooks Barrel Export (5 min)

Modify `src/hooks/index.ts`:

```typescript
export { useKonamiCode } from './use-konami-code'
export { usePreloader } from './use-preloader'
```

### Step 11: Test Preloader and Creative Details (60 min)

Test checklist:
- [ ] Preloader visible on page load
- [ ] Progress counter animates 0-100%
- [ ] Preloader visible minimum 1.5s
- [ ] Smooth fade-out transition to main content
- [ ] Page entrance: nav → hero → sections staggered
- [ ] Konami code triggers easter egg effect
- [ ] Particle burst animates outward
- [ ] Color flash visible briefly
- [ ] Easter egg disappears after 3s
- [ ] Motion toggle button in navigation
- [ ] Toggle persists to localStorage
- [ ] Toggle icon changes (play/pause)
- [ ] All animations respect toggle state

## Todo List

- [ ] Create use-preloader.ts hook
- [ ] Create preloader.tsx component
- [ ] Create page-entrance.tsx component
- [ ] Create use-konami-code.ts hook
- [ ] Create easter-egg.tsx component
- [ ] Create motion-toggle-button.tsx component
- [ ] Modify layout.tsx with Preloader and EasterEgg
- [ ] Modify page.tsx with PageEntrance wrappers
- [ ] Modify sticky-navigation.tsx with toggle button
- [ ] Update hooks/index.ts barrel export
- [ ] Test preloader animation and timing
- [ ] Test page entrance orchestration
- [ ] Test Konami code detection
- [ ] Test easter egg visual effect
- [ ] Test motion toggle functionality
- [ ] Test localStorage persistence
- [ ] Commit changes

## Success Criteria

- [ ] Preloader displays for minimum 1.5s
- [ ] Progress counter reaches 100% before exit
- [ ] Smooth 600ms exit transition
- [ ] Page entrance stagger: nav (0ms) → hero (200ms) → sections (400ms+)
- [ ] Konami code (↑↑↓↓←→←→BA) triggers easter egg
- [ ] Easter egg: particle burst + color flash + message
- [ ] Easter egg auto-dismisses after 3s
- [ ] Motion toggle button visible in navigation
- [ ] Toggle state persists across page reloads
- [ ] Toggle disabled state disables all animations site-wide
- [ ] Preloader respects reduced-motion (instant transition)
- [ ] Bundle size increase ≤20KB gzipped

## Risk Assessment

**Risk:** Preloader delays user interaction too long
**Mitigation:** Keep minimum duration short (1.5s), allow skip with click (optional)

**Risk:** Konami code interferes with normal keyboard navigation
**Mitigation:** Code uses arrow keys + letters (unlikely during normal use), resets after 10s

**Risk:** Easter egg effect causes seizures (rapid flashing)
**Mitigation:** Keep color flash subtle (opacity 0.3 max), duration short (1s), smooth transition

**Risk:** Motion toggle doesn't propagate to all components
**Mitigation:** Use centralized MotionContext, verify all animated components check motionEnabled

## Security Considerations

- Preloader uses native browser load event (safe)
- Konami code listener doesn't expose functionality (purely visual easter egg)
- LocalStorage used for motion preference only (no sensitive data)
- Easter egg effect purely cosmetic (no security risk)

## Next Steps

**Dependencies:** All previous phases (integrates entire experience)
**Unblocks:** Phase 8 (Testing can validate entire flow)
**Follow-up:** Consider adding skip button to preloader (accessibility improvement)
