# Research Report: UI Micro-interactions, Scroll & Cursor Patterns

**Date:** 2026-02-06
**Focus:** Custom cursors, 3D tilt effects, text reveals, scroll animations, creative patterns, accessibility

---

## 1. Custom Cursor Implementation in React/Next.js

### Performance Approaches

**GSAP Method:**
- Main cursor: 0.1s duration, follower ring: 0.3-0.6s duration for lag effect
- Use `gsap.quickTo` for optimized performance
- `useGSAP` hook for React lifecycle integration

**Framer Motion Method:**
- `useMotionValue` + `useSpring` for smooth tracking
- CSS transform-based positioning (better than top/left)
- `requestAnimationFrame` handled internally by Motion

**Motion+ Cursor (Recommended):**
- Official Motion library component with magnetic snapping
- Auto-adapts to interactive elements (links, buttons, text)
- GPU-accelerated, performant out-of-box

### Magnetic Button Effect

**Implementation Pattern:**
```tsx
// Track cursor position with useMotionValue
const cursorX = useMotionValue(0);
const cursorY = useMotionValue(0);

// Calculate distance to button center using Math.atan2()
// Apply transform based on proximity (strength: 0.15-0.5)
```

**Libraries:**
- Motion+ Cursor: built-in magnetic feature with strength control
- cursor-style.info: 6 cursor types including magnetic interactions

### Mobile/Touch Handling

```css
@media (hover: none) and (pointer: coarse) {
  .custom-cursor { display: none; }
}
```

Always hide custom cursor on touch devices to prevent ghost cursor artifacts.

### prefers-reduced-motion

```tsx
const prefersReducedMotion = useReducedMotion();
if (prefersReducedMotion) return null; // disable cursor
```

---

## 2. CSS 3D Perspective Tilt for Cards

### vanilla-tilt.js vs Custom Implementation

**vanilla-tilt.js (Recommended for quick setup):**
- 5KB, zero dependencies
- Add `data-tilt` attribute to element
- Config: max tilt (15-35°), speed (300ms), scale, glare effect
- Lower perspective value = more extreme tilt (800px typical)

**Custom Implementation (More control):**
```tsx
// Track mouse position relative to card center
const rotateX = (y - centerY) / sensitivity;
const rotateY = -(x - centerX) / sensitivity;

// Apply transform
transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
```

### Performance Optimization

```css
.tilt-card {
  will-change: transform;
  transform: translate3d(0, 0, 0); /* GPU acceleration */
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
```

### Integration with BentoCard Spotlight

Layer tilt transform over existing spotlight effect:
```tsx
<motion.div
  style={{ transform: tiltTransform }} // tilt layer
  onMouseMove={handleSpotlight} // existing spotlight
/>
```

---

## 3. Text Reveal Animations

### Motion's splitText Utility (Premium)

Motion+ exclusive: auto-splits text into chars/words/lines
```tsx
<motion.p variants={splitText}>
  Your text here
</motion.p>
```

### Manual Splitting Pattern

```tsx
const words = text.split(' ');
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};
const child = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};
```

### Character-by-Character Stagger

```tsx
text.split('').map((char, i) => (
  <motion.span
    key={i}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.03, duration: 0.5 }}
  >
    {char}
  </motion.span>
));
```

### Performance Considerations

- Avoid animating >200 characters simultaneously
- Use `will-change: transform, opacity` sparingly
- Batch DOM operations, use CSS containment

---

## 4. Scroll-Driven Animations (2025-2026)

### CSS scroll-timeline API Status

**Browser Support (as of July 2025):**
- Chrome: ✅ Stable support
- Firefox: ⚠️ Behind flag
- Safari: ❌ No support (use polyfill)

**Polyfill Available:** github.com/flackr/scroll-timeline

### Framer Motion useScroll (Recommended)

**Cross-browser, production-ready:**
```tsx
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
```

**Section-based tracking:**
```tsx
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});
```

### Motion's scroll() Function (New in 5.x)

5.1KB hybrid engine using ScrollTimeline API when available:
```tsx
import { scroll } from "motion";
scroll(animate(element, { opacity: [0, 1] }));
```

### Parallax Depth Layers

```tsx
const y1 = useTransform(scrollY, [0, 1000], [0, -200]); // slow
const y2 = useTransform(scrollY, [0, 1000], [0, -400]); // fast
```

### Sticky Nav with Scroll Progress

```tsx
const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
<motion.div style={{ scaleX: progress }} />
```

### Section Detection for Active Nav

```tsx
const { scrollY } = useScroll();
useEffect(() => {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    });
  }, { threshold: 0.5 });
  sections.forEach(s => observer.observe(s));
}, []);
```

---

## 5. Creative Developer Site Patterns

### Bruno Simon Portfolio

- **Interactive 3D world:** Drive-around experience using Three.js
- **Secret discovery:** Hidden easter eggs reveal personal info
- **Load orchestration:** Physics-based intro sequence

### Aristide Benoist Portfolio

- **Cursor-reactive typography:** Text responds dynamically to cursor proximity
- **Minimal palette:** Black/white with smooth transitions
- **Custom scroll:** Enhanced scroll behavior for narrative pacing

### Common Patterns (Award-winning portfolios)

**Preloader/Loading Screen:**
- Branded animation (logo reveal, counter, progress bar)
- Asset preloading with visual feedback
- Smooth entrance transition to main content

**Page Entrance Orchestration:**
- Staggered element reveals (100-200ms delays)
- Hierarchy: nav → hero → content
- Exit animations before route change

**Sound Design Toggle:**
- Mute/unmute button (usually top-right corner)
- Hover/click sound effects
- Ambient background audio loop
- Always default to muted (UX best practice)

**Easter Egg Approaches:**
- Konami code listener
- Click counter on specific element
- Cursor path tracking (draw pattern to unlock)
- Hidden dev console messages

---

## 6. Accessibility Considerations

### prefers-reduced-motion Integration

**Required by WCAG 2.3.3 (Animation from Interactions):**

```tsx
const prefersReducedMotion = useReducedMotion(); // Framer Motion hook

const variants = {
  visible: {
    opacity: 1,
    y: prefersReducedMotion ? 0 : -20,
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }
  }
};
```

### Keyboard Navigation with Custom Cursor

- Ensure all interactive elements are keyboard accessible
- Show focus indicators (outline/ring) even with custom cursor
- Don't rely solely on cursor hover for interaction feedback

### Screen Reader Compatibility

```tsx
<motion.div
  animate={{ x: 100 }}
  aria-hidden="true" // hide decorative animations
/>

<VisuallyHidden>Content description for SR</VisuallyHidden>
```

### WCAG Compliance for Motion-Heavy Sites

**SC 2.2.2 (Pause, Stop, Hide):**
- Provide pause button for auto-playing animations >5 seconds
- User control must be available to ALL users (not just reduced-motion)

**Health Impacts:**
- Parallax scrolling can trigger vestibular disorders
- Reactions: dizziness, nausea, headaches
- Always provide motion opt-out

**Implementation Strategy:**
1. Build motion-free version first (baseline)
2. Progressively enhance with animations
3. Respect system preference
4. Provide on-page toggle as fallback

---

## Unresolved Questions

1. **Custom cursor + BentoCard tilt integration:** Performance impact of layering both effects? Test frame rate with Chrome DevTools.
2. **Text reveal at scale:** Optimal character limit per animation before performance degrades noticeably?
3. **Scroll progress indicator z-index:** Should sticky nav progress bar sit above or below modal overlays?
4. **Sound design implementation:** Use Howler.js or native Web Audio API for portfolio sound effects?
5. **Easter egg discovery rate:** Analytics strategy for tracking which easter eggs users find most/least?
6. **Motion toggle persistence:** Store user preference in localStorage or session-only?

---

## Sources

- [Create Simple Custom Cursor In Next JS and GSAP](https://medium.com/@blaxxramadhan/create-your-simple-custom-cursor-in-next-js-and-gsap-b45bc2d44d88)
- [Interactive Cursor Animations For React/Next.js - Cursify](https://next.jqueryscript.net/next-js/cursor-animations-nextjs-cursify/)
- [Custom Cursor - React cursor animation | Motion](https://motion.dev/docs/cursor)
- [Introducing magnetic and zoning features in Motion+ Cursor](https://motion.dev/blog/introducing-magnetic-cursors-in-motion-cursor)
- [Build a Sticky Cursor Effect with Next.js, Framer Motion and Trigonometry](https://blog.olivierlarose.com/tutorials/sticky-cursor)
- [Vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/)
- [Using CSS Perspective To Create a 3D Card Tilt Animation](https://www.frontend.fyi/tutorials/css-3d-perspective-animations)
- [splitText — Split and staggered text animations | Motion](https://motion.dev/docs/split-text)
- [Enhancing UI with Staggered Text Animations](https://blog.openreplay.com/staggered-text-animations-with-framer/)
- [scroll() — Performant scroll-linked animations | Motion](https://www.framer.com/motion/scroll-function/)
- [useScroll — React scroll-linked animations | Motion](https://motion.dev/docs/react-use-scroll)
- [CSS scroll-timeline - Can I use](https://caniuse.com/css-scroll-timeline)
- [Bruno Simon Portfolio Case Study](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b)
- [Creative Portfolio Website Examples](https://creativize.net/creative-portfolio-website-examples/)
- [Design accessible animation and movement](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [C39: Using the CSS prefers-reduced-motion query | W3C](https://www.w3.org/WAI/WCAG21/Techniques/css/C39)
- [Understanding Success Criterion 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
