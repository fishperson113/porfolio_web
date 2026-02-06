# Code Standards & Conventions

## File Organization

### Directory Structure
```
src/
├── app/               # Next.js App Router pages
├── components/        # React components
│   ├── 3d/           # Three.js/R3F components
│   ├── sections/     # Page sections
│   └── ui/           # Reusable UI primitives
├── data/             # Static data files
└── lib/              # Utilities and helpers
```

### File Naming Rules

**Components:** PascalCase
```
Hero.tsx
NeuralNetwork.tsx
BentoCard.tsx
```

**Utilities:** camelCase
```
utils.ts
helpers.ts
```

**Data Files:** camelCase
```
skills.ts
projects.ts
achievements.ts
```

**Stylesheets:** kebab-case
```
globals.css
```

## TypeScript Standards

### Strict Mode Configuration
```json
{
  "strict": true,
  "noEmit": true,
  "esModuleInterop": true,
  "moduleResolution": "bundler"
}
```

### Type Safety Rules
1. **Zero `any` types**: Use `unknown` if type truly unknown
2. **Explicit return types**: For exported functions
3. **Interface over type**: For object shapes
4. **Const assertions**: For literal types

**Example:**
```typescript
// ✓ Good
export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: number
}

export const getSkill = (id: string): Skill | undefined => {
  return allSkills.find(skill => skill.id === id)
}

// ✗ Bad
export const getSkill = (id: any) => {
  return allSkills.find(skill => skill.id === id)
}
```

### Path Aliases
```typescript
// Always use @ alias for src imports
import Hero from '@/components/sections/Hero'
import { cn } from '@/lib/utils'

// Not relative paths
import Hero from '../components/sections/Hero'
```

## Component Architecture

### Component Types

**Server Components (Default)**
```typescript
// app/layout.tsx, app/page.tsx
export default function Page() {
  return <main>...</main>
}
```

**Client Components (Interactive)**
```typescript
'use client'

export default function Hero() {
  const [state, setState] = useState()
  return <div>...</div>
}
```

**3D Components (Dynamic Import)**
```typescript
// Always dynamic import with ssr: false
const Scene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})
```

### Component Size Limits
- **Maximum:** 200 LOC per component
- **Preferred:** 50-150 LOC
- **Strategy:** Extract sub-components, custom hooks

**Example Extraction:**
```typescript
// Before (180 LOC)
function Projects() {
  // Complex spotlight logic (80 LOC)
  // Render (100 LOC)
}

// After (refactored)
function Projects() {
  return projects.map(p => <ProjectCard key={p.id} {...p} />)
}

function ProjectCard({ title, description, tags }: Project) {
  const spotlight = useSpotlight()
  return <BentoCard spotlight={spotlight}>...</BentoCard>
}
```

### Component Structure
```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// 1. Types/Interfaces
interface Props {
  title: string
  items: Item[]
}

// 2. Component
export default function MyComponent({ title, items }: Props) {
  // 3. Hooks (useState, useEffect, custom hooks)
  const [active, setActive] = useState(0)

  // 4. Event handlers
  const handleClick = () => setActive(prev => prev + 1)

  // 5. Render helpers (if needed)
  const renderItem = (item: Item) => <div>{item.name}</div>

  // 6. Return JSX
  return (
    <motion.div>
      <h2>{title}</h2>
      {items.map(renderItem)}
    </motion.div>
  )
}
```

## Styling Standards

### Tailwind CSS v4

**Configuration:** CSS-first with `@theme`
```css
/* globals.css */
@theme {
  --color-bg-primary: #0A0A0F;
  --color-accent: #ADFF2F;
}
```

**Usage:** Utility-first
```tsx
<div className="bg-[#0A0A0F] text-[#FAFAFA]">
  <h1 className="text-4xl font-bold">Title</h1>
</div>
```

### Class Name Composition

**Use `cn()` utility** for conditional classes:
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === 'large' && "text-2xl"
)} />
```

**Implementation:**
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Design Tokens

**Colors** (from globals.css):
```css
--bg-primary: #0A0A0F
--bg-surface: #12121A
--border: #1E1E2E
--text-primary: #FAFAFA
--text-secondary: #A1A1AA
--text-tertiary: #71717A
--accent: #ADFF2F
--accent-glow: rgba(173, 255, 47, 0.3)
```

**Glassmorphism:**
```css
.glass-card {
  background: rgba(18, 18, 26, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Typography:**
```css
font-family: var(--font-geist);        /* Body text */
font-family: var(--font-geist-mono);   /* Code/mono */
```

## Animation Patterns

### Framer Motion Standards

**Entrance Animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
```

**Stagger Pattern:**
```typescript
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1, duration: 0.6 }}
  />
))}
```

**Hover Transitions:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.15 }}
>
```

**Scroll-Linked Animation:**
```typescript
const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0, 150], [1, 0])

return <motion.div style={{ opacity }} />
```

### 3D Animation Standards

**useFrame Pattern:**
```typescript
useFrame((state, delta) => {
  if (!meshRef.current) return

  // Rotate
  meshRef.current.rotation.y += delta * 0.5

  // Update uniforms
  materialRef.current.uniforms.time.value = state.clock.elapsedTime
})
```

**Performance Rules:**
- Update uniforms, not material properties
- Batch updates in single useFrame
- Use `useMemo` for geometries/materials
- Dispose resources in cleanup

## Data Patterns

### Static Data Files

**Structure:**
```typescript
// data/skills.ts
export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: number
}

export const skills: Skill[] = [
  { id: 'typescript', name: 'TypeScript', category: 'languages', level: 95 },
  // ...
]

// Export filtered/transformed variants
export const featuredSkills = skills.filter(s => s.level >= 90)
```

**Naming Convention:**
- Plural for arrays: `skills`, `projects`, `achievements`
- Singular for single items: `skill`, `project`, `achievement`

### Type Definitions

**Co-locate with data:**
```typescript
// data/projects.ts
export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  featured: boolean
  hackathon?: {
    name: string
    placement: string
  }
}
```

## Import Standards

### Import Order
```typescript
// 1. React/Next.js
import { useState } from 'react'
import Image from 'next/image'

// 2. Third-party libraries
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'

// 3. Local components
import Hero from '@/components/sections/Hero'

// 4. Data/utilities
import { skills } from '@/data/skills'
import { cn } from '@/lib/utils'

// 5. Types (if separate files)
import type { Skill } from '@/types'

// 6. Styles
import './styles.css'
```

### Dynamic Imports

**3D Components (Required):**
```typescript
import dynamic from 'next/dynamic'

const NeuralNetwork = dynamic(
  () => import('@/components/3d/NeuralNetwork'),
  { ssr: false }
)
```

**Heavy Components (Optional):**
```typescript
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

## Error Handling

### Try-Catch Pattern
```typescript
// For async operations
async function loadData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed to load')
    return await response.json()
  } catch (error) {
    console.error('Load error:', error)
    return null
  }
}
```

### Defensive Coding
```typescript
// Always check existence
function updateNode(node: Node | null) {
  if (!node) return
  node.position.set(x, y, z)
}

// Use optional chaining
const userName = user?.profile?.name ?? 'Anonymous'
```

## Performance Patterns

### React Optimization

**useMemo for expensive calculations:**
```typescript
const sortedSkills = useMemo(
  () => skills.sort((a, b) => b.level - a.level),
  [skills]
)
```

**useCallback for callbacks:**
```typescript
const handleClick = useCallback((id: string) => {
  setActiveId(id)
}, [])
```

**React.memo for pure components:**
```typescript
const SkillCard = React.memo(({ skill }: { skill: Skill }) => {
  return <div>{skill.name}</div>
})
```

### 3D Performance

**Device Detection:**
```typescript
const isMobile = /mobile/i.test(navigator.userAgent)
const cpuCores = navigator.hardwareConcurrency || 4

const nodeCount = isMobile || cpuCores < 4 ? 160 : 400
```

**Geometry Reuse:**
```typescript
const geometry = useMemo(() => new SphereGeometry(0.05, 8, 8), [])

// Reuse for all instances
nodes.map(node => <mesh geometry={geometry} position={node.pos} />)
```

**Dispose Pattern:**
```typescript
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
  }
}, [geometry, material])
```

## Testing Standards

### Component Testing (Future)
```typescript
// Not implemented yet, but preferred pattern:
describe('BentoCard', () => {
  it('renders title', () => {
    render(<BentoCard title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('applies spotlight on hover', () => {
    // Test spotlight logic
  })
})
```

### Type Testing
```typescript
// Use TypeScript compiler for type testing
// npm run type-check (npx tsc --noEmit)
```

## Linting Configuration

### ESLint Rules
```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Auto-fix on Save
```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Git Conventions

### Commit Messages
```
feat: Add 3D neural network component
fix: Resolve spotlight performance issue
refactor: Extract useSpotlight hook
docs: Update component documentation
style: Format with Prettier
perf: Optimize mobile node count
```

### Branch Strategy
- **Main branch:** Production-ready code only
- **Feature branches:** `feature/neural-network-shader`
- **Bugfix branches:** `fix/spotlight-performance`

## Code Review Checklist

- [ ] TypeScript strict mode (no `any`)
- [ ] Component <200 LOC
- [ ] Path aliases used (`@/`)
- [ ] Proper import order
- [ ] 3D components dynamically imported
- [ ] Tailwind classes organized
- [ ] Animations use Framer Motion patterns
- [ ] Performance optimizations applied
- [ ] Error handling implemented
- [ ] No console.log (use console.error for errors)

## Anti-Patterns to Avoid

### ✗ Avoid
```typescript
// Inline styles (use Tailwind)
<div style={{ color: 'red' }}>

// Relative imports from deep paths
import '../../../components/Hero'

// Any types
function handle(data: any) {}

// Direct DOM manipulation
document.getElementById('root').innerHTML = '...'

// Imperative animations
element.style.transform = 'translateX(100px)'
```

### ✓ Prefer
```typescript
// Tailwind utilities
<div className="text-red-500">

// Path aliases
import Hero from '@/components/Hero'

// Explicit types
function handle(data: UserData) {}

// React refs
const ref = useRef<HTMLDivElement>(null)

// Framer Motion
<motion.div animate={{ x: 100 }} />
```

## Comments & Documentation

### When to Comment
- Complex algorithms or math
- Non-obvious performance optimizations
- Workarounds for browser bugs
- Shader code (GLSL)

### JSDoc for Exported Functions
```typescript
/**
 * Calculates node attraction based on mouse position
 * @param nodePos - Current node position [x, y, z]
 * @param mousePos - Mouse position in 3D space [x, y, z]
 * @param strength - Attraction force multiplier (0-1)
 * @returns New position vector
 */
export function calculateAttraction(
  nodePos: Vector3,
  mousePos: Vector3,
  strength: number
): Vector3 {
  // Implementation
}
```

### Inline Comments for Complex Logic
```typescript
// Calculate distance using Euclidean formula
const distance = Math.sqrt(
  Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
)

// Apply exponential falloff for natural-looking attraction
const force = Math.exp(-distance / radius) * strength
```

## Accessibility Standards

### Semantic HTML
```typescript
// ✓ Good
<nav>
  <ul>
    <li><a href="#about">About</a></li>
  </ul>
</nav>

// ✗ Bad
<div className="nav">
  <div onClick={goTo}>About</div>
</div>
```

### ARIA Labels
```typescript
<button aria-label="View project details">
  <IconExternal />
</button>

<motion.div role="img" aria-label="3D neural network visualization">
  <Canvas>...</Canvas>
</motion.div>
```

### Keyboard Navigation
```typescript
<GlowButton
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
```

## Summary

Follow these standards to maintain code quality:
1. TypeScript strict mode, zero `any`
2. Component size <200 LOC
3. Tailwind CSS v4 for all styling
4. Framer Motion for all animations
5. Dynamic import 3D components
6. Path aliases (`@/`) for imports
7. Defensive error handling
8. Performance optimizations (device detection, memoization)
9. Semantic HTML + ARIA labels
10. Conventional commits

These standards ensure maintainability, performance, and professional quality.
