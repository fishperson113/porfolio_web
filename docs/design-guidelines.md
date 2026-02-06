# Design Guidelines

## Design System Overview

Elite Portfolio uses a **Dark Space Glassmorphism** theme with Cyber Lime accents, focused on depth, interactivity, and premium feel.

## Color System

### Core Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--bg-primary` | #0A0A0F | rgb(10, 10, 15) | Main background |
| `--bg-surface` | #12121A | rgb(18, 18, 26) | Cards, elevated surfaces |
| `--border` | #1E1E2E | rgb(30, 30, 46) | Subtle borders |
| `--text-primary` | #FAFAFA | rgb(250, 250, 250) | Headings, body text |
| `--text-secondary` | #A1A1AA | rgb(161, 161, 170) | Descriptions, labels |
| `--text-tertiary` | #71717A | rgb(113, 113, 122) | Metadata, timestamps |
| `--accent` | #ADFF2F | rgb(173, 255, 47) | CTAs, highlights, links |
| `--accent-glow` | rgba(173, 255, 47, 0.3) | - | Glow effects, shadows |

### Color Psychology

**Deep Space Background (#0A0A0F):**
- Evokes depth, professionalism
- Reduces eye strain
- Makes colors pop

**Cyber Lime Accent (#ADFF2F):**
- High energy, innovation
- Maximum contrast on dark background
- Tech/AI association (matrix aesthetic)

### Color Usage Rules

**Text Hierarchy:**
```css
h1, h2 → --text-primary (#FAFAFA)
p, body → --text-primary (#FAFAFA)
labels → --text-secondary (#A1A1AA)
timestamps → --text-tertiary (#71717A)
links, CTAs → --accent (#ADFF2F)
```

**Surface Hierarchy:**
```css
Level 0 (Page) → --bg-primary (#0A0A0F)
Level 1 (Cards) → --bg-surface (#12121A) + glass effect
Level 2 (Nested) → rgba(18, 18, 26, 0.5) + glass effect
```

**Border Strategy:**
```css
Default borders → --border (#1E1E2E)
Glass borders → rgba(255, 255, 255, 0.1)
Active/hover borders → --accent (#ADFF2F)
```

### Semantic Colors

**Success/Positive:**
- Primary: #10B981 (Emerald)
- Use: Achievement badges, success states

**Warning/Neutral:**
- Primary: #F59E0B (Amber)
- Use: In-progress states, game dev category

**Error/Critical:**
- Primary: #EF4444 (Red)
- Use: Error messages (rare)

**Info/Tech:**
- Primary: #3B82F6 (Blue)
- Use: Web dev category, links

### Category Colors

**Skill Categories:**
```typescript
Languages:  #ADFF2F  // Cyber Lime
AI/ML:      #FF6F00  // Deep Orange
Web:        #3B82F6  // Blue
App:        #10B981  // Emerald
Game:       #F59E0B  // Amber
Backend:    #EC4899  // Pink
Tools:      #8B5CF6  // Purple
```

**Visual Mapping:**
- Each category gets unique color for 3D orbit rings
- Color persists across skill cards, tags

## Typography System

### Font Families

**Display Font: Geist**
```css
font-family: var(--font-geist), sans-serif;
```
- Modern, geometric sans-serif
- Excellent readability at all sizes
- Variable font (flexible weights)
- Loading: `display: swap` (FOUT strategy)

**Monospace Font: Geist Mono**
```css
font-family: var(--font-geist-mono), monospace;
```
- Code snippets, technical details
- Consistent character width
- Matches Geist aesthetic

### Type Scale

| Level | Size (rem) | Size (px) | Line Height | Usage |
|-------|-----------|-----------|-------------|-------|
| Display | 4.5 | 72 | 1.1 | Hero title (mobile: 2.5rem) |
| H1 | 3 | 48 | 1.2 | Section headings |
| H2 | 2 | 32 | 1.3 | Subsection headings |
| H3 | 1.5 | 24 | 1.4 | Card titles |
| Body | 1 | 16 | 1.6 | Paragraphs |
| Small | 0.875 | 14 | 1.5 | Labels, metadata |
| Tiny | 0.75 | 12 | 1.4 | Timestamps, footnotes |

### Font Weights

```css
font-weight: 400;  /* Regular - body text */
font-weight: 500;  /* Medium - labels */
font-weight: 600;  /* Semibold - subheadings */
font-weight: 700;  /* Bold - headings */
font-weight: 900;  /* Black - hero title */
```

### Typography Usage

**Hero Section:**
```tsx
<h1 className="text-5xl md:text-7xl font-black">
  Duong Pham
</h1>
<p className="text-xl md:text-2xl text-[#A1A1AA]">
  AI Engineer & Full-Stack Generalist
</p>
```

**Section Headings:**
```tsx
<h2 className="text-4xl md:text-5xl font-bold text-[#FAFAFA]">
  Featured Projects
</h2>
```

**Body Text:**
```tsx
<p className="text-base leading-relaxed text-[#FAFAFA]">
  Description content...
</p>
```

**Metadata:**
```tsx
<span className="text-sm text-[#71717A]">
  2025
</span>
```

### Responsive Typography

**Mobile-First Scale:**
```css
/* Mobile (default) */
h1 { font-size: 2rem; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  h1 { font-size: 3rem; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  h1 { font-size: 4rem; }
}
```

**Tailwind Approach:**
```tsx
className="text-2xl md:text-3xl lg:text-4xl"
```

## Glassmorphism Design System

### Core Glass Effect

**Standard Glass Card:**
```css
background: rgba(18, 18, 26, 0.7);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
```

**Tailwind Implementation:**
```tsx
<div className="
  bg-[rgba(18,18,26,0.7)]
  backdrop-blur-xl
  shadow-[0_8px_32px_rgba(0,0,0,0.4)]
  border border-white/10
  rounded-2xl
">
```

### Glass Variants

**Subtle Glass (Background Elements):**
```css
background: rgba(18, 18, 26, 0.4);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.05);
```

**Elevated Glass (Interactive Cards):**
```css
background: rgba(18, 18, 26, 0.8);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
```

**Accent Glass (CTAs):**
```css
background: rgba(173, 255, 47, 0.1);
backdrop-filter: blur(12px);
border: 1px solid rgba(173, 255, 47, 0.3);
box-shadow: 0 0 24px rgba(173, 255, 47, 0.2);
```

### Depth Layers

```
Layer 0: Page background (#0A0A0F, no glass)
  ↓
Layer 1: Section containers (subtle glass, 0.4 opacity)
  ↓
Layer 2: Content cards (standard glass, 0.7 opacity)
  ↓
Layer 3: Interactive elements (elevated glass, 0.8 opacity)
  ↓
Layer 4: Modals/tooltips (full glass, 0.9 opacity)
```

### Blur Recommendations

| Context | Blur Amount | Performance |
|---------|-------------|-------------|
| Mobile | 8px | Good |
| Desktop | 12px | Good |
| Heavy content | 16px | Moderate |
| Overlays | 20px | Lower |

**Note:** `backdrop-filter` can impact performance. Use sparingly on mobile.

## Spacing System

### Base Unit: 4px (0.25rem)

**Scale:**
```
0   →  0px
1   →  4px   (0.25rem)
2   →  8px   (0.5rem)
3   →  12px  (0.75rem)
4   →  16px  (1rem)
6   →  24px  (1.5rem)
8   →  32px  (2rem)
12  →  48px  (3rem)
16  →  64px  (4rem)
24  →  96px  (6rem)
32  →  128px (8rem)
```

### Layout Spacing

**Section Spacing:**
```css
padding-top: 6rem;      /* 96px between sections */
padding-bottom: 6rem;
```

**Container Spacing:**
```css
padding-left: 1rem;     /* 16px mobile */
padding-right: 1rem;

@media (min-width: 768px) {
  padding-left: 2rem;   /* 32px tablet */
  padding-right: 2rem;
}

@media (min-width: 1024px) {
  padding-left: 4rem;   /* 64px desktop */
  padding-right: 4rem;
}
```

**Component Spacing:**
```css
gap: 1rem;              /* Grid gaps (mobile) */
gap: 1.5rem;            /* Grid gaps (tablet) */
gap: 2rem;              /* Grid gaps (desktop) */
```

### Content Spacing

**Text Blocks:**
```css
margin-bottom: 1rem;    /* Paragraph spacing */
margin-bottom: 2rem;    /* Heading spacing */
```

**Lists:**
```css
gap: 0.5rem;            /* List item spacing */
```

**Cards:**
```css
padding: 1.5rem;        /* Card padding (mobile) */
padding: 2rem;          /* Card padding (desktop) */
```

## Border Radius System

```css
--radius-sm:  0.25rem;  /* 4px - small elements */
--radius-md:  0.5rem;   /* 8px - buttons, inputs */
--radius-lg:  1rem;     /* 16px - cards */
--radius-xl:  1.5rem;   /* 24px - large cards */
--radius-2xl: 2rem;     /* 32px - hero elements */
--radius-full: 9999px;  /* Pills, circular */
```

**Usage:**
```css
Buttons:        border-radius: 0.5rem;
Cards:          border-radius: 1rem;
Modals:         border-radius: 1.5rem;
3D containers:  border-radius: 2rem;
Avatars:        border-radius: 9999px;
```

## Shadow System

### Elevation Shadows

**Level 1 (Subtle):**
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```
Use: Small cards, buttons

**Level 2 (Standard):**
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
```
Use: Glass cards, modals

**Level 3 (Elevated):**
```css
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
```
Use: Dropdowns, interactive cards

**Level 4 (Dramatic):**
```css
box-shadow: 0 20px 64px rgba(0, 0, 0, 0.8);
```
Use: Hero elements, feature showcases

### Glow Shadows (Accent)

**Subtle Glow:**
```css
box-shadow: 0 0 12px rgba(173, 255, 47, 0.2);
```

**Medium Glow:**
```css
box-shadow: 0 0 24px rgba(173, 255, 47, 0.3);
```

**Strong Glow:**
```css
box-shadow: 0 0 48px rgba(173, 255, 47, 0.5);
```

**Usage:**
```tsx
// Hover state
className="hover:shadow-[0_0_24px_rgba(173,255,47,0.3)]"
```

## Animation & Motion

### Duration Tokens

```css
--duration-instant: 100ms;
--duration-fast:    150ms;
--duration-normal:  300ms;
--duration-slow:    500ms;
--duration-slower:  700ms;
```

### Easing Functions

**Standard Ease Out:**
```css
transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
```
Use: Most transitions (smooth deceleration)

**Ease In Out:**
```css
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```
Use: Bidirectional animations

**Spring:**
```typescript
// Framer Motion
transition={{ type: "spring", stiffness: 300, damping: 30 }}
```
Use: Interactive elements

### Animation Patterns

**Entrance (Scroll-Triggered):**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
/>
```

**Stagger:**
```typescript
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }}
  />
))}
```

**Hover:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.15 }}
/>
```

**Continuous (3D):**
```typescript
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta * 0.2
})
```

### Motion Principles

1. **Purpose-Driven:** Every animation has a reason (feedback, guidance, delight)
2. **Subtle:** Prefer 80% opacity, 20px movement over dramatic effects
3. **Performance:** GPU-accelerated properties only (transform, opacity)
4. **Consistency:** Same duration/easing for similar interactions
5. **Respect Preferences:** Honor `prefers-reduced-motion`

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Layout Patterns

### Container Widths

```css
max-width: 1280px;      /* Desktop container */
max-width: 1024px;      /* Tablet container */
max-width: 768px;       /* Mobile container */
```

**Responsive Container:**
```tsx
<div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
```

### Grid Systems

**Bento Grid (Projects):**
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 1.5rem;
```

**Skill Grid:**
```css
display: grid;
grid-template-columns: repeat(2, 1fr);  /* Mobile */
grid-template-columns: repeat(3, 1fr);  /* Tablet */
grid-template-columns: repeat(4, 1fr);  /* Desktop */
gap: 1rem;
```

**Timeline (Achievements):**
```css
display: flex;
flex-direction: column;
gap: 2rem;
```

### Aspect Ratios

**Project Cards:**
- Landscape: 16:9
- Portrait: 3:4
- Square: 1:1

**3D Canvas:**
- Hero: 100vh (full viewport)
- Skills: 600px (fixed height)

## Interactive Elements

### Buttons

**Primary (CTA):**
```tsx
<button className="
  bg-[#ADFF2F]
  text-[#0A0A0F]
  px-8 py-3
  rounded-lg
  font-semibold
  shadow-[0_0_24px_rgba(173,255,47,0.3)]
  hover:shadow-[0_0_48px_rgba(173,255,47,0.5)]
  transition-all duration-300
">
```

**Secondary (Ghost):**
```tsx
<button className="
  bg-transparent
  text-[#ADFF2F]
  border border-[#ADFF2F]
  px-8 py-3
  rounded-lg
  font-semibold
  hover:bg-[rgba(173,255,47,0.1)]
  transition-all duration-300
">
```

**Tertiary (Link):**
```tsx
<a className="
  text-[#ADFF2F]
  underline-offset-4
  hover:underline
  transition-all duration-150
">
```

### Cards

**Standard Card:**
```tsx
<div className="
  bg-[rgba(18,18,26,0.7)]
  backdrop-blur-xl
  border border-white/10
  rounded-2xl
  p-6
  shadow-[0_8px_32px_rgba(0,0,0,0.4)]
  hover:border-[#ADFF2F]/30
  transition-all duration-300
">
```

**Spotlight Card (Bento):**
```tsx
// With mouse-tracking spotlight
<div className="relative overflow-hidden">
  <div className="spotlight" style={{ left: x, top: y }} />
  <div className="content">...</div>
</div>
```

### Inputs (Future)

**Text Input:**
```tsx
<input className="
  bg-[rgba(18,18,26,0.7)]
  border border-white/10
  rounded-lg
  px-4 py-2
  text-[#FAFAFA]
  focus:border-[#ADFF2F]
  focus:outline-none
  transition-all duration-150
" />
```

## Iconography

### Icon Style
- **Library:** Lucide React (future, not yet implemented)
- **Size:** 24px default
- **Stroke Width:** 2px
- **Color:** Inherit from parent

### Icon Usage
```tsx
<Icon className="w-6 h-6 text-[#ADFF2F]" />
```

**Social Icons (Contact Section):**
- GitHub, LinkedIn, Email
- Size: 32px
- Hover: Glow effect

## Responsive Design

### Breakpoints

```css
sm:  640px   /* Small tablets, large phones */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Mobile-First Strategy

**Default:** Mobile (< 640px)
**Progressively enhance** with `md:`, `lg:` prefixes

**Example:**
```tsx
<div className="
  text-2xl        {/* Mobile */}
  md:text-4xl     {/* Tablet */}
  lg:text-5xl     {/* Desktop */}
">
```

### Touch Targets

**Minimum Size:** 44x44px (WCAG AA)
```css
min-width: 44px;
min-height: 44px;
```

## Accessibility Guidelines

### Color Contrast

**WCAG AA Requirements:**
- Text: 4.5:1 minimum
- Large text: 3:1 minimum

**Current Ratios:**
- #FAFAFA on #0A0A0F: 18.5:1 ✓
- #ADFF2F on #0A0A0F: 15.2:1 ✓
- #A1A1AA on #0A0A0F: 8.3:1 ✓

### Focus Indicators

```css
focus-visible:outline-2
focus-visible:outline-offset-2
focus-visible:outline-[#ADFF2F]
```

### ARIA Labels

```tsx
<button aria-label="View project details">
  <IconExternal />
</button>
```

## Design Principles

1. **Depth Through Layers:** Use glassmorphism to create visual hierarchy
2. **Contrast for Impact:** Dark background + bright accent = attention
3. **Motion with Purpose:** Animations guide eye, provide feedback
4. **Consistency:** Same patterns across all sections
5. **Performance First:** Beauty shouldn't compromise speed
6. **Accessibility:** Design for all users, all devices

## Brand Voice (Visual)

- **Professional:** Clean, structured layouts
- **Innovative:** 3D elements, interactive features
- **Technical:** Monospace fonts, code-inspired aesthetics
- **Premium:** Glassmorphism, smooth animations, attention to detail

## Asset Guidelines

### Images
- **Format:** WebP (with PNG fallback)
- **Compression:** 80% quality
- **Dimensions:** 1920x1080 max for project images
- **Loading:** Lazy load below-the-fold

### Fonts
- **Format:** WOFF2 (variable fonts)
- **Preload:** Critical fonts only
- **Fallback:** System sans-serif

### Icons
- **Format:** SVG (inline)
- **Optimization:** SVGO compression
- **Color:** Use currentColor for theme flexibility

## Design Checklist

- [ ] Uses glassmorphism effect (blur + transparency)
- [ ] Cyber Lime accent for CTAs/highlights
- [ ] Dark background (#0A0A0F)
- [ ] Geist font family
- [ ] Smooth animations (300ms ease-out-expo)
- [ ] 4.5:1 color contrast minimum
- [ ] 44x44px minimum touch targets
- [ ] Responsive across breakpoints
- [ ] Reduced motion support
- [ ] Focus indicators on interactive elements

## Summary

Elite Portfolio design system prioritizes:
- **Visual Impact:** Glassmorphism + Cyber Lime = memorable
- **Depth:** Layered surfaces create 3D feel
- **Interactivity:** Smooth animations provide feedback
- **Consistency:** Unified tokens across all components
- **Performance:** GPU-accelerated, optimized assets
- **Accessibility:** WCAG AA compliance, keyboard navigation

All design decisions support the core goal: Showcase technical excellence through visual excellence.
