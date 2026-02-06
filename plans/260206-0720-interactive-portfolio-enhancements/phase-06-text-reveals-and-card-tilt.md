# Phase 6: Text Reveals and Card Tilt

## Context Links

- **Plan Overview:** [plan.md](./plan.md)
- **Phase 2 (Dependency):** [phase-02-custom-cursor-and-magnetic-effects.md](./phase-02-custom-cursor-and-magnetic-effects.md)
- **Research - UI/Scroll:** [research/researcher-02-ui-scroll-cursor-report.md](./research/researcher-02-ui-scroll-cursor-report.md)

## Overview

**Date:** 2026-02-06
**Description:** Word-by-word text reveal animations, 3D CSS perspective tilt on BentoCards, button press micro-animations, enhanced SkillOrbit hover
**Priority:** P1
**Status:** Pending
**Effort:** 8-10 hours

## Key Insights

From research report:
- Manual text splitting pattern: `text.split(' ')` with `staggerChildren: 0.05`
- Motion+ splitText utility is premium, use manual approach
- Character-by-character stagger limited to <200 chars for performance
- 3D tilt: `rotateX = (y - centerY) / sensitivity`, `rotateY = -(x - centerX) / sensitivity`
- vanilla-tilt.js (5KB) vs custom implementation (more control)
- Tilt perspective: 1000px typical, lower = more extreme effect
- GPU acceleration: `will-change: transform`, `transform: translate3d(0,0,0)`
- Layer tilt over existing spotlight effect (both can coexist)

## Requirements

### Functional Requirements

1. Word-by-word text reveal for section headings (stagger delay: 0.05s)
2. 3D CSS perspective tilt on BentoCards (layered with existing spotlight)
3. Tilt reacts to mouse position relative to card center
4. Button press micro-animation (scale-down + glow pulse on click)
5. Enhanced SkillOrbit hover: pause rotation, scale ring, glow effect
6. Text reveal triggers on scroll into viewport (once only)
7. Respect `prefers-reduced-motion` (instant reveal, no tilt)

### Non-Functional Requirements

- Text reveal: 60fps animation (GPU-accelerated transforms)
- Tilt effect: <1ms overhead per card
- No layout shift during tilt (transform only)
- Tilt sensitivity: 15-25° max rotation
- Button animation: <200ms duration for snappy feel
- TypeScript strict mode compliance

## Architecture

### Component Hierarchy

```
Sections
├── SectionHeading (new)
│   └── AnimatedText (word-by-word)
├── Projects
│   └── BentoCard (enhanced)
│       ├── MouseTracker (existing spotlight)
│       └── TiltEffect (new, layered)
├── Contact
│   └── GlowButton (enhanced)
│       └── PressAnimation (new)
└── Skills
    └── SkillOrbit (enhanced)
        └── HoverEffect (enhanced)
```

### Data Flow

```
Text Reveal:
Scroll Event → IntersectionObserver → Trigger Animation → Stagger Children

Card Tilt:
Mouse Move → Calculate Relative Position → Calculate Rotation Angles → Apply Transform

Button Press:
Click Event → Scale Down + Glow → Wait 150ms → Scale Up + Reset
```

### Tilt Algorithm

```typescript
// Mouse position relative to card center
const rect = cardRef.current.getBoundingClientRect()
const centerX = rect.left + rect.width / 2
const centerY = rect.top + rect.height / 2

const mouseX = event.clientX - centerX
const mouseY = event.clientY - centerY

// Calculate rotation (sensitivity: 20 = 20px movement = 1° rotation)
const rotateY = (mouseX / rect.width) * maxRotation // -15 to 15°
const rotateX = -(mouseY / rect.height) * maxRotation // -15 to 15°

// Apply perspective transform
transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`
```

## Related Code Files

### Files to Create

1. `src/components/ui/animated-text.tsx` (80-100 LOC)
2. `src/components/ui/section-heading.tsx` (40-50 LOC)
3. `src/hooks/use-tilt-effect.ts` (80-100 LOC)
4. `src/hooks/use-button-press.ts` (40-50 LOC)

### Files to Modify

1. `src/components/ui/BentoCard.tsx` - Add tilt effect layer
2. `src/components/ui/GlowButton.tsx` - Add press animation
3. `src/components/3d/SkillOrbit.tsx` - Enhance hover behavior
4. `src/components/sections/About.tsx` - Use SectionHeading
5. `src/components/sections/Projects.tsx` - Use SectionHeading
6. `src/components/sections/Skills.tsx` - Use SectionHeading
7. `src/hooks/index.ts` - Export new hooks

## Implementation Steps

### Step 1: Create AnimatedText Component (60 min)

Create `src/components/ui/animated-text.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks'

interface AnimatedTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  staggerDelay?: number
}

export default function AnimatedText({
  text,
  className,
  as: Component = 'p',
  staggerDelay = 0.05
}: AnimatedTextProps) {
  const prefersReduced = useReducedMotion()
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : staggerDelay,
        delayChildren: prefersReduced ? 0 : 0.1
      }
    }
  }

  const child = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.5 }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={child}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
```

### Step 2: Create SectionHeading Component (30 min)

Create `src/components/ui/section-heading.tsx`:

```typescript
import AnimatedText from './animated-text'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn('text-center mb-16', className)}>
      <AnimatedText
        text={title}
        as="h2"
        className="text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-4"
        staggerDelay={0.05}
      />
      {subtitle && (
        <AnimatedText
          text={subtitle}
          as="p"
          className="text-lg text-[#A1A1AA]"
          staggerDelay={0.03}
        />
      )}
    </div>
  )
}
```

### Step 3: Create useTiltEffect Hook (75 min)

Create `src/hooks/use-tilt-effect.ts`:

```typescript
'use client'

import { useRef, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from './use-reduced-motion'

interface TiltOptions {
  maxRotation?: number // degrees, default 15
  perspective?: number // pixels, default 1000
  scale?: number // scale on hover, default 1.02
  speed?: number // spring stiffness, default 300
}

export function useTiltEffect(options: TiltOptions = {}) {
  const {
    maxRotation = 15,
    perspective = 1000,
    scale = 1.02,
    speed = 300
  } = options

  const ref = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springConfig = { stiffness: speed, damping: 20 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!ref.current || prefersReduced) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY

    const rotY = (mouseX / rect.width) * maxRotation * 2
    const rotX = -(mouseY / rect.height) * maxRotation * 2

    rotateX.set(rotX)
    rotateY.set(rotY)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
  }

  const transform = prefersReduced
    ? {}
    : {
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: isHovered ? scale : 1,
        transformPerspective: perspective
      }

  return {
    ref,
    transform,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  }
}
```

### Step 4: Create useButtonPress Hook (30 min)

Create `src/hooks/use-button-press.ts`:

```typescript
'use client'

import { useState } from 'react'
import { useReducedMotion } from './use-reduced-motion'

export function useButtonPress() {
  const [isPressed, setIsPressed] = useState(false)
  const prefersReduced = useReducedMotion()

  const handlePress = () => {
    if (prefersReduced) return

    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
  }

  const scale = isPressed ? 0.95 : 1
  const glowIntensity = isPressed ? 1.5 : 1

  return {
    isPressed,
    handlePress,
    scale,
    glowIntensity
  }
}
```

### Step 5: Enhance BentoCard with Tilt (60 min)

Modify `src/components/ui/BentoCard.tsx`:

```typescript
import { useTiltEffect } from '@/hooks/use-tilt-effect'
import { motion } from 'framer-motion'

export default function BentoCard({ children, className, ...props }: BentoCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { ref, transform, handlers } = useTiltEffect({
    maxRotation: 12,
    scale: 1.02
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Existing spotlight logic
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })

    // Tilt effect
    handlers.onMouseMove(e)
  }

  return (
    <motion.div
      ref={ref}
      style={transform} // Tilt transform
      onMouseMove={handleMouseMove}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={() => {
        handlers.onMouseLeave()
        setMousePosition({ x: 0, y: 0 }) // Reset spotlight
      }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-[rgba(18,18,26,0.7)] backdrop-blur-xl',
        'border border-white/10',
        className
      )}
      {...props}
    >
      {/* Spotlight effect (existing) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(173,255,47,0.1), transparent)`
        }}
      />

      {children}
    </motion.div>
  )
}
```

### Step 6: Enhance GlowButton with Press Animation (45 min)

Modify `src/components/ui/GlowButton.tsx`:

```typescript
import { useButtonPress } from '@/hooks/use-button-press'
import { motion } from 'framer-motion'

const GlowButton = forwardRef<HTMLElement, GlowButtonProps>(
  ({ onClick, children, ...props }, forwardedRef) => {
    const { handlePress, scale, glowIntensity } = useButtonPress()
    const { ref: magneticRef, x, y } = useMagneticEffect({ /* ... */ })

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      handlePress()
      onClick?.(e)
    }

    return (
      <motion.div style={{ x, y }} className="inline-block">
        <motion.button
          ref={mergedRef}
          onClick={handleClick}
          animate={{ scale }}
          transition={{ duration: 0.15 }}
          style={{
            boxShadow: `0 0 ${20 * glowIntensity}px rgba(173, 255, 47, ${0.3 * glowIntensity})`
          }}
          className={cn(/* ... */)}
          {...props}
        >
          {children}
        </motion.button>
      </motion.div>
    )
  }
)
```

### Step 7: Enhance SkillOrbit Hover (45 min)

Modify `src/components/3d/SkillOrbit.tsx`:

```typescript
export default function SkillOrbit() {
  const [hoveredRing, setHoveredRing] = useState<number | null>(null)

  return (
    <group>
      {skillCategories.map((category, index) => (
        <group key={category.name} rotation={[0, 0, index * 0.1]}>
          <mesh
            onPointerEnter={() => setHoveredRing(index)}
            onPointerLeave={() => setHoveredRing(null)}
          >
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshBasicMaterial
              color={category.color}
              transparent
              opacity={hoveredRing === index ? 0.8 : 0.4}
              emissive={category.color}
              emissiveIntensity={hoveredRing === index ? 0.6 : 0.2}
            />
          </mesh>

          {/* Skills text - scale on hover */}
          {category.skills.map((skill, skillIndex) => {
            const angle = (skillIndex / category.skills.length) * Math.PI * 2
            const isHovered = hoveredRing === index

            return (
              <Float key={skill.name} speed={isHovered ? 0.5 : 2}>
                <Text
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    0
                  ]}
                  fontSize={isHovered ? 0.3 : 0.25}
                  color={isHovered ? '#ADFF2F' : '#FAFAFA'}
                >
                  {skill.name}
                </Text>
              </Float>
            )
          })}
        </group>
      ))}
    </group>
  )
}
```

### Step 8: Apply SectionHeading to Sections (30 min)

Modify section components:

```typescript
// src/components/sections/About.tsx
import SectionHeading from '@/components/ui/section-heading'

export default function About() {
  return (
    <section>
      <SectionHeading
        title="About Me"
        subtitle="AI Engineer & Full-Stack Generalist"
      />
      {/* ... rest of content */}
    </section>
  )
}

// Repeat for Projects, Skills, Achievements sections
```

### Step 9: Update Hooks Barrel Export (5 min)

Modify `src/hooks/index.ts`:

```typescript
export { useTiltEffect } from './use-tilt-effect'
export { useButtonPress } from './use-button-press'
```

### Step 10: Test Text Reveals and Tilt Effects (60 min)

Test checklist:
- [ ] Section headings reveal word-by-word on scroll
- [ ] Text stagger delay feels natural (0.05s)
- [ ] BentoCards tilt on mouse movement
- [ ] Tilt resets smoothly on mouse leave
- [ ] Spotlight and tilt effects coexist without conflict
- [ ] Button scales down + glows on click
- [ ] Button resets after 150ms
- [ ] SkillOrbit rings pause/glow on hover
- [ ] Skill text scales and changes color on hover
- [ ] All effects disabled with `prefers-reduced-motion`
- [ ] 60fps animation performance

## Todo List

- [ ] Create animated-text.tsx component
- [ ] Create section-heading.tsx component
- [ ] Create use-tilt-effect.ts hook
- [ ] Create use-button-press.ts hook
- [ ] Modify BentoCard.tsx with tilt effect
- [ ] Modify GlowButton.tsx with press animation
- [ ] Modify SkillOrbit.tsx with enhanced hover
- [ ] Apply SectionHeading to About section
- [ ] Apply SectionHeading to Projects section
- [ ] Apply SectionHeading to Skills section
- [ ] Apply SectionHeading to Achievements section
- [ ] Update hooks/index.ts barrel export
- [ ] Test text reveal animations
- [ ] Test card tilt effect
- [ ] Test button press animation
- [ ] Test SkillOrbit hover enhancements
- [ ] Test reduced-motion compliance
- [ ] Commit changes

## Success Criteria

- [ ] Section headings animate word-by-word on scroll entry
- [ ] Text reveal maintains 60fps (Chrome DevTools)
- [ ] BentoCards tilt smoothly following mouse (15° max rotation)
- [ ] Tilt and spotlight effects layer correctly (both visible)
- [ ] Button press animation snappy (<200ms total)
- [ ] Button glow pulses on click
- [ ] SkillOrbit rings pause rotation on hover (smooth easing)
- [ ] Skill text scales and glows on ring hover
- [ ] All effects respect `prefers-reduced-motion`
- [ ] No layout shift during tilt (transform only)
- [ ] Bundle size increase ≤15KB gzipped

## Risk Assessment

**Risk:** Too many animated words cause performance issues
**Mitigation:** Limit to section headings only (<10 words typically), use GPU-accelerated transforms

**Risk:** Tilt effect feels nauseating (too aggressive)
**Mitigation:** Conservative max rotation (15°), smooth spring animation, disable on reduced-motion

**Risk:** Tilt interferes with spotlight tracking
**Mitigation:** Separate event handlers, both use mouse position independently

**Risk:** Button press animation conflicts with magnetic effect
**Mitigation:** Layer animations (magnetic: outer div, press: inner button), independent springs

## Security Considerations

- No external dependencies beyond Framer Motion
- Text splitting uses native JavaScript (no XSS risk)
- All animations client-side (no server interaction)

## Next Steps

**Dependencies:** Phase 2 (Magnetic effects in GlowButton)
**Unblocks:** Phase 7 (Preloader can use text reveal pattern)
**Follow-up:** In Phase 8, test tilt effect on various card sizes and aspect ratios
