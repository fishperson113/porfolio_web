# Phase 5: Scroll and Navigation

## Context Links

- **Plan Overview:** [plan.md](./plan.md)
- **Phase 1 (Dependency):** [phase-01-foundation-and-infrastructure.md](./phase-01-foundation-and-infrastructure.md)
- **Research - UI/Scroll:** [research/researcher-02-ui-scroll-cursor-report.md](./research/researcher-02-ui-scroll-cursor-report.md)

## Overview

**Date:** 2026-02-06
**Description:** Sticky navigation with glass blur + scroll progress indicator, active section detection, parallax depth layers, scroll-triggered transitions
**Priority:** P1
**Status:** Pending
**Effort:** 8-10 hours

## Key Insights

From research report:
- Framer Motion `useScroll` + `useTransform` for cross-browser scroll animations
- IntersectionObserver for active section detection (threshold: 0.5 recommended)
- Sticky nav with `backdrop-filter: blur(12px)` for glassmorphism
- Scroll progress indicator using `scaleX` transform (GPU-accelerated)
- Parallax layers: `y1 = scrollY * -0.2` (slow), `y2 = scrollY * -0.4` (fast)
- CSS scroll-timeline API not production-ready (Safari unsupported), stick to Framer Motion

## Requirements

### Functional Requirements

1. Sticky navigation bar appears on scroll down, hides on scroll up (smart hide)
2. Glass blur backdrop on sticky nav (`backdrop-filter: blur(12px)`)
3. Horizontal scroll progress indicator (0-100% page scroll)
4. Active section detection highlights corresponding nav link
5. Smooth scroll to section on nav click
6. Parallax depth layers on Hero section (background elements move slower)
7. Scroll-triggered section transitions (fade-in on viewport enter)
8. Respect `prefers-reduced-motion` (disable parallax, reduce transitions)

### Non-Functional Requirements

- 60fps scroll performance (passive event listeners)
- Intersection Observer efficiency (minimal reflows)
- Navigation z-index above all content (z-40)
- Progress bar GPU-accelerated (transform, not width)
- Scroll threshold: 100px before sticky nav appears
- TypeScript strict mode compliance

## Architecture

### Component Hierarchy

```
Page
├── Navigation (new, sticky)
│   ├── NavLinks (with active state)
│   └── ScrollProgress (progress bar)
├── Hero (modified)
│   ├── ParallaxLayer (background, slow)
│   ├── ParallaxLayer (midground, medium)
│   └── Content (foreground, normal)
└── Sections (modified)
    └── Scroll-triggered entrance animations
```

### Data Flow

```
Scroll Event (passive)
    ↓
useScroll hook (scrollY, scrollYProgress)
    ↓
┌─────────────────┬──────────────────┬────────────────┐
│                 │                  │                │
Sticky Nav        Progress Bar       Parallax        Section Detection
(show/hide)       (scaleX)           (translateY)    (IntersectionObserver)
    ↓                 ↓                  ↓                ↓
State Update      Transform Update   Transform Update  Active Link State
```

### Navigation State Machine

```
Scroll Direction: Down
    → Navigation visible: true
    → Transform: translateY(0)

Scroll Direction: Up
    → Navigation visible: false (if scrollY > 100)
    → Transform: translateY(-100%)

Scroll Position: Top (scrollY < 100)
    → Navigation visible: false
    → Transform: translateY(-100%)
```

## Related Code Files

### Files to Create

1. `src/components/navigation/sticky-navigation.tsx` (120-150 LOC)
2. `src/components/navigation/scroll-progress.tsx` (40-50 LOC)
3. `src/components/ui/parallax-layer.tsx` (60-80 LOC)
4. `src/hooks/use-active-section.ts` (80-100 LOC)
5. `src/hooks/use-scroll-direction.ts` (50-60 LOC)

### Files to Modify

1. `src/components/sections/Hero.tsx` - Add parallax layers
2. `src/app/page.tsx` - Add navigation, section IDs
3. `src/hooks/index.ts` - Export new hooks

## Implementation Steps

### Step 1: Create useScrollDirection Hook (45 min)

Create `src/hooks/use-scroll-direction.ts`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'

export type ScrollDirection = 'up' | 'down' | 'none'

export function useScrollDirection(threshold = 10) {
  const { scrollY } = useScroll()
  const [direction, setDirection] = useState<ScrollDirection>('none')

  useEffect(() => {
    let lastScrollY = scrollY.get()

    const updateDirection = () => {
      const currentScrollY = scrollY.get()
      const diff = currentScrollY - lastScrollY

      if (Math.abs(diff) < threshold) return

      setDirection(diff > 0 ? 'down' : 'up')
      lastScrollY = currentScrollY
    }

    const unsubscribe = scrollY.on('change', updateDirection)
    return () => unsubscribe()
  }, [scrollY, threshold])

  return direction
}
```

### Step 2: Create useActiveSection Hook (60 min)

Create `src/hooks/use-active-section.ts`:

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: [0.5],
        rootMargin: '-100px 0px -100px 0px' // Account for sticky nav height
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [sectionIds])

  return activeSection
}
```

### Step 3: Create ScrollProgress Component (30 min)

Create `src/components/navigation/scroll-progress.tsx`:

```typescript
'use client'

import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ADFF2F] origin-left"
      style={{ scaleX }}
    />
  )
}
```

### Step 4: Create StickyNavigation Component (90 min)

Create `src/components/navigation/sticky-navigation.tsx`:

```typescript
'use client'

import { motion, useScroll } from 'framer-motion'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { useActiveSection } from '@/hooks/use-active-section'
import { useReducedMotion } from '@/hooks'
import ScrollProgress from './scroll-progress'
import { cn } from '@/lib/utils'

interface NavLink {
  id: string
  label: string
}

const navLinks: NavLink[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' }
]

export default function StickyNavigation() {
  const { scrollY } = useScroll()
  const direction = useScrollDirection(10)
  const activeSection = useActiveSection(navLinks.map((link) => link.id))
  const prefersReduced = useReducedMotion()

  const shouldShow = scrollY.get() > 100 && direction !== 'up'

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (!element) return

    const offset = 80 // Account for sticky nav height
    const top = element.offsetTop - offset

    window.scrollTo({
      top,
      behavior: prefersReduced ? 'auto' : 'smooth'
    })
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: shouldShow ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="relative bg-[rgba(18,18,26,0.8)] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Name */}
            <div className="text-xl font-bold text-[#FAFAFA]">
              Duong Pham
            </div>

            {/* Nav Links */}
            <div className="flex gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleClick(link.id)}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    activeSection === link.id
                      ? 'text-[#ADFF2F]'
                      : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Progress */}
        <ScrollProgress />
      </div>
    </motion.nav>
  )
}
```

### Step 5: Create ParallaxLayer Component (45 min)

Create `src/components/ui/parallax-layer.tsx`:

```typescript
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks'

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number // 0-1, where 0 = no movement, 1 = normal scroll
  className?: string
}

export default function ParallaxLayer({
  children,
  speed = 0.5,
  className
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  // Calculate parallax offset
  // Speed 0.5 means element moves at half the scroll speed
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, prefersReduced ? 0 : -200 * speed]
  )

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
```

### Step 6: Modify Hero with Parallax Layers (45 min)

Modify `src/components/sections/Hero.tsx`:

```typescript
import ParallaxLayer from '@/components/ui/parallax-layer'

export default function Hero() {
  // ... existing code

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Layer (slowest) */}
      <ParallaxLayer speed={0.2} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/50 to-[#0A0A0F]" />
      </ParallaxLayer>

      {/* 3D Scene Layer (medium speed) */}
      <ParallaxLayer speed={0.5} className="absolute inset-0 z-10">
        <Scene>
          <NeuralNetwork />
          <FloatingParticles />
        </Scene>
      </ParallaxLayer>

      {/* Content Layer (normal speed, no parallax) */}
      <div className="relative z-20 text-center px-6">
        {/* ... existing content */}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2 text-[#A1A1AA]">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ↓
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
```

### Step 7: Add Section IDs to Page (20 min)

Modify `src/app/page.tsx`:

```typescript
export default function Home() {
  return (
    <main>
      <StickyNavigation />
      <Hero /> {/* Already has id="hero" */}
      <section id="about"><About /></section>
      <section id="projects"><Projects /></section>
      <section id="skills"><Skills /></section>
      <section id="achievements"><Achievements /></section>
      <section id="contact"><Contact /></section>
    </main>
  )
}
```

### Step 8: Enhance Section Entrance Animations (30 min)

Update section components to use scroll-triggered animations:

```typescript
// Example: src/components/sections/About.tsx
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks'

export default function About() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.section
      initial={{ opacity: 0, y: prefersReduced ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {/* ... existing content */}
    </motion.section>
  )
}
```

### Step 9: Update Hooks Barrel Export (5 min)

Modify `src/hooks/index.ts`:

```typescript
export { useScrollDirection } from './use-scroll-direction'
export { useActiveSection } from './use-active-section'
export type { ScrollDirection } from './use-scroll-direction'
```

### Step 10: Test Scroll and Navigation (60 min)

Test checklist:
- [ ] Sticky nav appears after scrolling 100px down
- [ ] Sticky nav hides when scrolling up
- [ ] Sticky nav always visible when scrolling down
- [ ] Glass blur visible on nav background
- [ ] Scroll progress bar animates 0-100% on page scroll
- [ ] Active section highlights correct nav link
- [ ] Click nav link smoothly scrolls to section
- [ ] Parallax layers move at different speeds in Hero
- [ ] Section entrance animations trigger on scroll
- [ ] All effects disabled with `prefers-reduced-motion`
- [ ] 60fps scroll performance (Chrome DevTools)

## Todo List

- [ ] Create use-scroll-direction.ts hook
- [ ] Create use-active-section.ts hook
- [ ] Create scroll-progress.tsx component
- [ ] Create sticky-navigation.tsx component
- [ ] Create parallax-layer.tsx component
- [ ] Modify Hero.tsx with parallax layers
- [ ] Modify page.tsx with section IDs and navigation
- [ ] Enhance section entrance animations
- [ ] Update hooks/index.ts barrel export
- [ ] Test sticky nav show/hide behavior
- [ ] Test scroll progress bar
- [ ] Test active section detection
- [ ] Test smooth scroll to section
- [ ] Test parallax effect in Hero
- [ ] Test reduced-motion compliance
- [ ] Verify 60fps scroll performance
- [ ] Commit changes

## Success Criteria

- [ ] Sticky nav appears/hides based on scroll direction
- [ ] Nav shows after 100px scroll, hides on scroll up
- [ ] Glass blur effect visible on nav backdrop
- [ ] Scroll progress bar reaches 100% at page bottom
- [ ] Active section detected correctly (50% intersection threshold)
- [ ] Smooth scroll works on nav link click
- [ ] Parallax layers move at different speeds (visual confirmation)
- [ ] Section animations trigger on viewport enter
- [ ] All effects respect `prefers-reduced-motion`
- [ ] Scroll maintains 60fps (Chrome DevTools Performance tab)
- [ ] Bundle size increase ≤20KB gzipped

## Risk Assessment

**Risk:** Sticky nav covers content on mobile (viewport height too small)
**Mitigation:** Reduce nav height on mobile, ensure min-height sections account for nav

**Risk:** IntersectionObserver triggers incorrectly (multiple sections active)
**Mitigation:** Set threshold: 0.5, use rootMargin to account for nav, only set active on highest ratio

**Risk:** Parallax causes motion sickness (vestibular disorders)
**Mitigation:** Disable on `prefers-reduced-motion`, keep speed values subtle (0.2-0.5)

**Risk:** Smooth scroll breaks on older browsers
**Mitigation:** Feature detect `scrollBehavior`, fallback to instant scroll

## Security Considerations

- No external dependencies beyond Framer Motion
- IntersectionObserver API is safe (browser-native)
- Smooth scroll uses native browser API (no security risk)

## Next Steps

**Dependencies:** Phase 1 (useReducedMotion hook)
**Unblocks:** Phase 6 (Section headings can use scroll-triggered text reveals)
**Follow-up:** In Phase 7, add motion toggle button to sticky navigation
