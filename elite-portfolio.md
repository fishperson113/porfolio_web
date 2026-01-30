# Elite End-to-End Engineer Portfolio

> **Project Type:** WEB (Static Export)
> **Primary Agent:** `frontend-specialist`
> **Status:** PLANNING

---

## Overview

Build a high-performance, single-page portfolio website for an AI Engineer & Full-stack Generalist. The site will showcase technical depth through an interactive 3D neural network hero, sophisticated Bento Grid layouts, and scroll-triggered animations.

**Key Differentiator:** This isn't a template—it's a technical flex demonstrating mastery of Three.js, React, and modern web performance.

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 100/100 |
| Lighthouse Accessibility | 100/100 |
| First Contentful Paint | < 1.5s |
| Layout Shift (CLS) | 0 |
| Mobile 3D FPS | ≥ 30fps (throttled) |
| Bundle Size (gzipped) | < 200KB (excluding 3D) |

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14 (App Router) | Static export, React Server Components |
| **Styling** | Tailwind CSS v4 | Utility-first, design tokens |
| **Components** | Shadcn/ui | Accessible, unstyled primitives |
| **Animation** | Framer Motion | Declarative, performant animations |
| **3D** | React Three Fiber + Drei | Declarative Three.js with React |
| **Fonts** | Geist (Vercel) | Modern, variable weight |
| **Deploy** | Netlify | Static hosting, edge CDN |

---

## Design System

### Theme: Deep Space / Obsidian (Dark Only)

```
Background:     #0A0A0F (near-black)
Surface:        #12121A (cards, elevated)
Border:         #1E1E2E (subtle separation)
Text Primary:   #FAFAFA (white)
Text Secondary: #A1A1AA (muted)
Accent:         #ADFF2F (Cyber Lime)
Accent Glow:    rgba(173, 255, 47, 0.3)
```

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 (Hero) | Geist | 4rem/64px | 700 |
| H2 (Section) | Geist | 2.5rem/40px | 600 |
| H3 (Cards) | Geist | 1.5rem/24px | 600 |
| Body | Geist | 1rem/16px | 400 |
| Code | Geist Mono | 0.875rem | 400 |

### Glassmorphism Tokens

```css
--glass-bg: rgba(18, 18, 26, 0.7);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: blur(12px);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
```

---

## File Structure

```
porfolio_web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + fonts
│   │   ├── page.tsx            # Main page (all sections)
│   │   └── globals.css         # Tailwind + custom properties
│   │
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── NeuralNetwork.tsx    # Hero 3D component
│   │   │   ├── SkillOrbit.tsx       # Skills 3D orbit
│   │   │   └── Scene.tsx            # R3F Canvas wrapper
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.tsx             # Hero section
│   │   │   ├── Projects.tsx         # Bento grid
│   │   │   ├── Skills.tsx           # Skill orbit section
│   │   │   └── Achievements.tsx     # Timeline section
│   │   │
│   │   └── ui/
│   │       ├── BentoCard.tsx        # Glass card with spotlight
│   │       ├── GlassCard.tsx        # Base glass component
│   │       ├── GlowButton.tsx       # CTA button
│   │       └── Timeline.tsx         # Vertical timeline
│   │
│   ├── data/
│   │   ├── projects.ts          # Project/hackathon data
│   │   ├── skills.ts            # Skills with icons
│   │   └── achievements.ts      # Award timeline data
│   │
│   ├── hooks/
│   │   ├── useReducedMotion.ts  # Accessibility
│   │   └── useDevicePerf.ts     # Mobile detection
│   │
│   └── lib/
│       └── utils.ts             # cn() helper
│
├── public/
│   └── fonts/                   # Geist font files
│
├── next.config.js               # Static export config
├── tailwind.config.ts           # Design tokens
└── package.json
```

---

## Task Breakdown

### Phase 1: Foundation (P0)

#### Task 1.1: Scaffold Next.js Project
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `nextjs-react-expert` |
| **Input** | Empty directory |
| **Output** | Next.js 14 app with App Router |
| **Verify** | `npm run dev` starts without errors |

```bash
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

#### Task 1.2: Install Dependencies
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Input** | Base Next.js project |
| **Output** | All dependencies installed |
| **Verify** | `npm list` shows all packages |

```bash
npm install @react-three/fiber @react-three/drei three framer-motion
npm install -D @types/three
npx shadcn@latest init
```

#### Task 1.3: Configure Design Tokens
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `tailwind-patterns`, `frontend-design` |
| **Input** | Default Tailwind config |
| **Output** | Custom theme with Cyber Lime, glass tokens |
| **Verify** | Tailwind classes apply correctly in dev |

---

### Phase 2: 3D Components (P1)

#### Task 2.1: Create Scene Wrapper
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `nextjs-react-expert` |
| **Input** | R3F installed |
| **Output** | `Scene.tsx` with Canvas, Suspense, error boundary |
| **Verify** | Empty Canvas renders without hydration errors |

**Key Considerations:**
- Dynamic import with `ssr: false`
- Suspense fallback (loading skeleton)
- Performance hints: `dpr={[1, 2]}`, `frameloop="demand"`

#### Task 2.2: Build Neural Network Hero
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `frontend-design` |
| **Input** | Scene wrapper |
| **Output** | Interactive neural network with ~500 nodes |
| **Verify** | Mouse interaction visible, 60fps on desktop |

**Implementation Details:**
- Nodes: InstancedMesh for performance
- Connections: LineSegments with custom shader
- Mouse interaction: useFrame + lerp for smooth follow
- Cyber Lime glow: emissive material + bloom optional

#### Task 2.3: Mobile Performance Throttling
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `performance-profiling` |
| **Input** | Neural network component |
| **Output** | Reduced particles (200 nodes) on mobile |
| **Verify** | Mobile FPS ≥ 30, no jank |

**Detection Strategy:**
```typescript
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const isLowPerf = navigator.hardwareConcurrency < 4;
```

---

### Phase 3: UI Components (P1)

#### Task 3.1: Create Glass Card Component
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `frontend-design` |
| **Input** | Design tokens |
| **Output** | Reusable `GlassCard.tsx` |
| **Verify** | Renders with blur, border, correct colors |

#### Task 3.2: Build Bento Grid with Spotlight
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `frontend-design`, `nextjs-react-expert` |
| **Input** | GlassCard, project data |
| **Output** | Responsive Bento Grid with hover spotlight |
| **Verify** | Grid adapts to viewport, spotlight follows mouse |

**Spotlight Effect:**
```typescript
// Track mouse position relative to card
// Apply radial gradient at cursor position
// Use CSS custom properties for performance
```

#### Task 3.3: Build Skill Orbit (3D)
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `frontend-design` |
| **Input** | Scene wrapper, skills data |
| **Output** | 3D orbiting skill icons |
| **Verify** | Auto-rotation, hover pause, click handler |

**Domains:**
- AI Engineering (center)
- Web Dev (orbit 1)
- App Dev (orbit 2)
- Game Dev (orbit 3)

#### Task 3.4: Build Achievement Timeline
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `frontend-design` |
| **Input** | Achievement data, Framer Motion |
| **Output** | Scroll-triggered vertical timeline |
| **Verify** | Items animate in on scroll, accessible |

---

### Phase 4: Data & Content (P2)

#### Task 4.1: Create Data Files
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Input** | TypeScript types |
| **Output** | `projects.ts`, `skills.ts`, `achievements.ts` |
| **Verify** | Types match usage, no TS errors |

**Projects Schema:**
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
  featured: boolean;
  hackathon?: {
    name: string;
    placement: string;
  };
}
```

#### Task 4.2: Assemble Main Page
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Input** | All sections |
| **Output** | Complete `page.tsx` |
| **Verify** | All sections render, smooth scroll |

---

### Phase 5: Polish & Deploy (P3)

#### Task 5.1: Static Export Configuration
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Input** | Completed site |
| **Output** | `next.config.js` with `output: 'export'` |
| **Verify** | `npm run build` produces `/out` folder |

#### Task 5.2: Performance Optimization
| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skills** | `performance-profiling` |
| **Input** | Built site |
| **Output** | Optimized bundle, lazy loading |
| **Verify** | Lighthouse 100/100 |

**Checklist:**
- [ ] Dynamic imports for 3D
- [ ] Image optimization (if any)
- [ ] Font preloading
- [ ] CSS purging

---

## Phase X: Verification

### Automated Tests

```bash
# Lint & Types
npm run lint
npx tsc --noEmit

# Build verification
npm run build

# Lighthouse (requires dev server)
npm run dev &
python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000
```

### Manual Verification

| Check | Steps |
|-------|-------|
| 3D Hero | Open site → Move mouse → Neural network reacts |
| Mobile 3D | Open DevTools → Toggle mobile → FPS remains smooth |
| Spotlight | Hover project cards → Gradient follows cursor |
| Timeline | Scroll to achievements → Items animate in |
| Static Export | Run `npm run build` → Check `/out` folder exists |

### Verification Checklist

- [ ] Lint passes (no errors)
- [ ] TypeScript compiles (no errors)
- [ ] Build succeeds
- [ ] All sections render
- [ ] 3D works on desktop (60fps)
- [ ] 3D throttled on mobile (30fps)
- [ ] Spotlight effect works
- [ ] Timeline animates
- [ ] Static export works
- [ ] Lighthouse ≥ 95 all categories

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| 3D hydration errors | High | Dynamic import with `ssr: false` |
| Mobile performance | Medium | Aggressive throttling, reduce geometry |
| Bundle size | Medium | Code splitting, dynamic imports |
| Browser compatibility | Low | Progressive enhancement |

---

## Next Steps After Approval

1. Run `/create` or `/enhance` to start implementation
2. Begin with Task 1.1 (scaffold project)
3. Implement foundation → 3D → UI → Polish
