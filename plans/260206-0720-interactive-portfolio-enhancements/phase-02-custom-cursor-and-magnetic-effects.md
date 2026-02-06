# Phase 2: Custom Cursor and Magnetic Effects

## Context Links

- **Plan Overview:** [plan.md](./plan.md)
- **Phase 1 (Dependency):** [phase-01-foundation-and-infrastructure.md](./phase-01-foundation-and-infrastructure.md)
- **Research - UI/Scroll:** [research/researcher-02-ui-scroll-cursor-report.md](./research/researcher-02-ui-scroll-cursor-report.md)

## Overview

**Date:** 2026-02-06
**Description:** Implement custom cursor with dot/ring follower, magnetic button effects, mobile/touch handling, reduced-motion compliance
**Priority:** P1
**Status:** Pending
**Effort:** 8-10 hours

## Key Insights

From research report:
- Framer Motion `useMotionValue` + `useSpring` provides smooth cursor tracking without GSAP
- Magnetic effect uses `Math.atan2()` for direction calculation, proximity-based strength (0.15-0.5)
- Must hide on touch devices with `@media (hover: none) and (pointer: coarse)`
- Cursor lag effect: main dot 0.1s duration, follower ring 0.3-0.6s for premium feel
- GPU-accelerated with CSS `transform` (not `top`/`left`)

## Requirements

### Functional Requirements

1. Custom cursor component with dot (8px) + ring (32px) follower
2. Cursor follows mouse with spring physics (stiffness: 300, damping: 30)
3. Magnetic effect on interactive elements (buttons, links, cards)
4. Cursor state changes on hover: dot scales, ring expands, color shifts
5. Hide cursor on mobile/touch devices
6. Disable cursor when `useReducedMotion` returns true
7. Integrate magnetic behavior into GlowButton component

### Non-Functional Requirements

- 60fps cursor tracking (requestAnimationFrame via Framer Motion)
- <1ms per frame performance overhead
- Zero layout shift (cursor positioned `fixed`)
- Cursor z-index above all content (z-50 or higher)
- Smooth transitions using GPU-accelerated transforms
- TypeScript strict mode compliance

## Architecture

### Component Hierarchy

```
App
├── CustomCursor (new, global)
│   ├── CursorDot (absolute positioned)
│   └── CursorRing (absolute positioned)
└── Page
    ├── Hero
    │   └── GlowButton (with magnetic props)
    └── Contact
        └── GlowButton (with magnetic props)
```

### Data Flow

```
Mouse Move Event
    ↓
useMotionValue (cursorX, cursorY)
    ↓
useSpring (smooth interpolation)
    ↓
motion.div transform style
    ↓
CursorDot/Ring position update (60fps)

Mouse Enter Interactive Element
    ↓
setCursorState('hover')
    ↓
Cursor style change (scale, color)
```

### Magnetic Effect Algorithm

```typescript
// Distance from cursor to element center
const distance = Math.sqrt((cursorX - centerX) ** 2 + (cursorY - centerY) ** 2)

// Only apply if within magnetic radius
if (distance < magneticRadius) {
  // Calculate angle from element to cursor
  const angle = Math.atan2(cursorY - centerY, cursorX - centerX)

  // Calculate offset (strength decreases with distance)
  const strength = 0.3 * (1 - distance / magneticRadius)
  const offsetX = Math.cos(angle) * distance * strength
  const offsetY = Math.sin(angle) * distance * strength

  // Apply to element transform
  element.style.transform = `translate(${offsetX}px, ${offsetY}px)`
}
```

## Related Code Files

### Files to Create

1. `src/components/ui/custom-cursor.tsx` (120-150 LOC)
2. `src/hooks/use-cursor-state.ts` (40-50 LOC)
3. `src/hooks/use-magnetic-effect.ts` (80-100 LOC)

### Files to Modify

1. `src/components/ui/GlowButton.tsx` - Add magnetic effect integration
2. `src/app/layout.tsx` - Add CustomCursor component
3. `src/hooks/index.ts` - Export new hooks

## Implementation Steps

### Step 1: Create useCursorState Hook (30 min)

Create `src/hooks/use-cursor-state.ts`:

```typescript
'use client'

import { useState, useCallback } from 'react'

export type CursorState = 'default' | 'hover' | 'click'

export function useCursorState() {
  const [state, setState] = useState<CursorState>('default')

  const setDefault = useCallback(() => setState('default'), [])
  const setHover = useCallback(() => setState('hover'), [])
  const setClick = useCallback(() => setState('click'), [])

  return {
    state,
    setDefault,
    setHover,
    setClick
  }
}
```

### Step 2: Create CustomCursor Component (90 min)

Create `src/components/ui/custom-cursor.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks'
import { useCursorState } from '@/hooks/use-cursor-state'

export default function CustomCursor() {
  const prefersReduced = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const { state } = useCursorState()

  // Motion values for cursor position
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Spring physics for smooth following
  const springConfig = { stiffness: 300, damping: 30 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Slower spring for ring follower
  const ringSpringConfig = { stiffness: 150, damping: 20 }
  const ringX = useSpring(cursorX, ringSpringConfig)
  const ringY = useSpring(cursorY, ringSpringConfig)

  useEffect(() => {
    setIsMounted(true)

    // Detect touch device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(hasTouch)

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorX, cursorY])

  // Don't render on server, touch devices, or reduced motion
  if (!isMounted || isTouchDevice || prefersReduced) return null

  // Cursor styles based on state
  const dotScale = state === 'hover' ? 1.5 : state === 'click' ? 0.8 : 1
  const ringScale = state === 'hover' ? 1.5 : state === 'click' ? 0.9 : 1
  const dotColor = state === 'hover' ? '#ADFF2F' : '#FAFAFA'

  return (
    <>
      {/* Cursor Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: dotColor,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ scale: dotScale }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Cursor Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY
        }}
      >
        <motion.div
          className="w-8 h-8 border border-white/40 rounded-full"
          style={{
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ scale: ringScale }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  )
}
```

### Step 3: Create useMagneticEffect Hook (90 min)

Create `src/hooks/use-magnetic-effect.ts`:

```typescript
'use client'

import { useRef, useEffect, useState } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from './use-reduced-motion'

interface MagneticOptions {
  strength?: number // 0-1, default 0.3
  radius?: number   // pixels, default 80
}

export function useMagneticEffect(options: MagneticOptions = {}) {
  const { strength = 0.3, radius = 80 } = options
  const ref = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (!ref.current || prefersReduced) return

    const element = ref.current

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return

      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      if (distance < radius) {
        // Calculate magnetic pull
        const angle = Math.atan2(distanceY, distanceX)
        const force = strength * (1 - distance / radius)

        mouseX.set(Math.cos(angle) * distance * force)
        mouseY.set(Math.sin(angle) * distance * force)
      } else {
        mouseX.set(0)
        mouseY.set(0)
      }
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
      setIsHovered(false)
      mouseX.set(0)
      mouseY.set(0)
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isHovered, mouseX, mouseY, radius, strength, prefersReduced])

  return { ref, x, y }
}
```

### Step 4: Integrate Magnetic Effect into GlowButton (60 min)

Modify `src/components/ui/GlowButton.tsx`:

```typescript
// Add imports
import { motion } from 'framer-motion'
import { useMagneticEffect } from '@/hooks/use-magnetic-effect'

// Update component signature
interface GlowButtonProps {
  // ... existing props
  magnetic?: boolean
  magneticStrength?: number
}

const GlowButton = forwardRef<HTMLElement, GlowButtonProps>(
  ({ magnetic = true, magneticStrength = 0.3, ...props }, forwardedRef) => {
    const { ref: magneticRef, x, y } = useMagneticEffect({
      strength: magneticStrength,
      radius: 100
    })

    // Merge refs
    const mergedRef = (node: HTMLElement | null) => {
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
      magneticRef.current = node
    }

    // Wrap with motion div if magnetic
    const button = (
      <Component
        ref={mergedRef}
        className={cn(/* ... */)}
        {...rest}
      >
        {children}
      </Component>
    )

    if (!magnetic) return button

    return (
      <motion.div style={{ x, y }} className="inline-block">
        {button}
      </motion.div>
    )
  }
)
```

### Step 5: Add CustomCursor to App Layout (15 min)

Modify `src/app/layout.tsx`:

```typescript
import CustomCursor from '@/components/ui/custom-cursor'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MotionProvider>
          <CustomCursor />
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
```

### Step 6: Add CSS for Native Cursor Hide (10 min)

Add to `src/app/globals.css`:

```css
/* Hide native cursor when custom cursor active */
@media (hover: hover) and (pointer: fine) {
  body {
    cursor: none;
  }

  a, button {
    cursor: none;
  }
}

/* Show native cursor on touch devices */
@media (hover: none) and (pointer: coarse) {
  body, a, button {
    cursor: auto;
  }
}
```

### Step 7: Update Hooks Barrel Export (5 min)

Modify `src/hooks/index.ts`:

```typescript
export { useCursorState } from './use-cursor-state'
export { useMagneticEffect } from './use-magnetic-effect'
```

### Step 8: Test Cursor and Magnetic Effects (60 min)

Test checklist:
- [ ] Cursor visible on desktop (non-touch)
- [ ] Cursor hidden on mobile/touch
- [ ] Cursor follows mouse smoothly (60fps)
- [ ] Ring lags behind dot (visual confirmation)
- [ ] Cursor changes on button hover (scale, color)
- [ ] Magnetic effect pulls buttons toward cursor
- [ ] Magnetic effect resets on mouse leave
- [ ] Cursor disabled with reduced-motion preference
- [ ] No cursor on initial server render (hydration safe)

## Todo List

- [ ] Create use-cursor-state.ts hook
- [ ] Create custom-cursor.tsx component
- [ ] Create use-magnetic-effect.ts hook
- [ ] Modify GlowButton.tsx with magnetic integration
- [ ] Add CustomCursor to layout.tsx
- [ ] Add cursor CSS to globals.css
- [ ] Update hooks/index.ts barrel export
- [ ] Test cursor visibility (desktop vs mobile)
- [ ] Test cursor tracking smoothness
- [ ] Test magnetic effect on GlowButton
- [ ] Test reduced-motion compliance
- [ ] Verify no hydration errors
- [ ] Commit changes

## Success Criteria

- [ ] Cursor renders only on desktop (hover: hover devices)
- [ ] Cursor hidden on mobile/touch devices
- [ ] Cursor tracking maintains 60fps (Chrome DevTools Performance)
- [ ] Magnetic effect pulls buttons within 100px radius
- [ ] Cursor respects `prefers-reduced-motion` (hidden when enabled)
- [ ] No layout shift or hydration errors
- [ ] GlowButton `magnetic` prop works (can disable per-button)
- [ ] Bundle size increase ≤15KB gzipped

## Risk Assessment

**Risk:** Cursor causes performance issues on low-end devices
**Mitigation:** useReducedMotion disables cursor, consider adding device tier check in Phase 1

**Risk:** Cursor interferes with native accessibility (screen readers, keyboard nav)
**Mitigation:** Cursor is purely visual (`pointer-events: none`), doesn't affect DOM interaction

**Risk:** Magnetic effect feels too aggressive or too subtle
**Mitigation:** Expose strength/radius as props, allow per-component tuning (default: strength=0.3)

**Risk:** Cursor positioning breaks on scroll (fixed positioning issue)
**Mitigation:** Use `fixed` positioning with mouse clientX/Y (viewport coordinates, not page)

## Security Considerations

- No external dependencies beyond Framer Motion (already installed)
- No data collection or tracking
- `mix-blend-difference` may fail in older browsers (graceful degradation)

## Next Steps

**Dependencies:** Phase 1 (useReducedMotion hook)
**Unblocks:** Phase 6 (Card tilt can layer with magnetic effects)
**Follow-up:** In Phase 6, apply magnetic effect to BentoCard components
