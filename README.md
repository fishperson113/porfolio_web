# Elite Portfolio

**AI Engineer & Full-Stack Generalist Portfolio**

High-performance portfolio website featuring interactive 3D visualizations, scroll-triggered animations, and glassmorphism design system.

## Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Lint
npm run lint
```

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4.1.18 |
| Animation | Framer Motion | 12.29.2 |
| 3D Engine | Three.js | 0.182.0 |
| 3D React | React Three Fiber | 9.5.0 |
| 3D Helpers | Drei | 10.7.7 |
| Deployment | Netlify | Static Export |

## Features

- **Interactive 3D Neural Network**: 400 nodes with mouse attraction physics
- **3D Skill Orbit**: Orbital rings displaying 30+ skills across 7 categories
- **Bento Grid Projects**: Mouse-tracking spotlight cards
- **Scroll Animations**: Framer Motion viewport triggers with stagger
- **Glassmorphism Design**: Consistent blur, shadow, border system
- **Static Export**: Zero server runtime, full CDN deployment
- **Mobile Optimized**: Reduced node count, responsive layouts

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main page composition
│   └── globals.css         # Design tokens, animations
│
├── components/
│   ├── 3d/
│   │   ├── NeuralNetwork.tsx   # Interactive neural network
│   │   ├── Scene.tsx           # R3F Canvas wrapper
│   │   └── SkillOrbit.tsx      # 3D skill visualization
│   │
│   ├── sections/
│   │   ├── Hero.tsx            # Landing section
│   │   ├── About.tsx           # Bio section
│   │   ├── Skills.tsx          # Skills section
│   │   ├── Projects.tsx        # Projects grid
│   │   ├── Achievements.tsx    # Timeline
│   │   └── Contact.tsx         # Contact CTA
│   │
│   └── ui/
│       ├── BentoCard.tsx       # Spotlight card
│       ├── GlassCard.tsx       # Glass container
│       └── GlowButton.tsx      # CTA button
│
├── data/
│   ├── skills.ts           # 7 categories, 30+ skills
│   ├── projects.ts         # 4 projects
│   └── achievements.ts     # 4 achievements
│
└── lib/
    └── utils.ts            # cn() utility
```

## Build Configuration

### Static Export (next.config.ts)
```typescript
{
  output: 'export',              // Static HTML/CSS/JS
  images: { unoptimized: true }, // No image optimization
  trailingSlash: true,           // URL normalization
}
```

### Netlify (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "out"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Design System

### Colors
```css
--bg-primary: #0A0A0F;         /* Near-black */
--bg-surface: #12121A;         /* Cards */
--border: #1E1E2E;             /* Subtle separation */
--text-primary: #FAFAFA;       /* Main text */
--text-secondary: #A1A1AA;     /* Secondary text */
--accent: #ADFF2F;             /* Cyber Lime */
--accent-glow: rgba(173, 255, 47, 0.3);
```

### Typography
- **Display**: Geist (variable: `--font-geist`)
- **Mono**: Geist Mono (variable: `--font-geist-mono`)
- **Strategy**: `display: swap` (FOUT)

### Glassmorphism Tokens
```css
background: rgba(18, 18, 26, 0.7);
backdrop-filter: blur(12px);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Animation Tokens
```css
--duration-fast: 150ms;
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

## Development

### Scripts
```bash
npm run dev     # Start dev server
npm run build   # Build static export
npm start       # Serve production build
npm run lint    # Run ESLint
```

### Path Aliases
```typescript
"@/*" → "./src/*"
```

### TypeScript Config
- **Strict mode**: Enabled
- **Target**: ES2017
- **Module**: ESNext (bundler)
- **JSX**: react-jsx (React 19)

## Deployment

### Netlify Setup
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `out`
4. Plugin: `@netlify/plugin-nextjs` (auto-installed)

### Environment
- No environment variables required
- All data embedded at build time
- No server-side features

## Performance

### 3D Optimization
- Device detection: CPU cores + user agent
- Mobile: 160 nodes, 180 connections
- Desktop: 400 nodes, 600 connections
- DPR capped at [1, 2]
- High-performance GPU preference

### Bundle Size
- Static export: Full tree-shaking
- Dynamic imports: 3D components with `ssr: false`
- Code splitting: Automatic per route

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL 2.0 for 3D features.

## Documentation

See [docs/](./docs/) for detailed documentation:

- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)
- [Design Guidelines](./docs/design-guidelines.md)
- [Deployment Guide](./docs/deployment-guide.md)
- [Project Roadmap](./docs/project-roadmap.md)
- [Codebase Summary](./docs/codebase-summary.md)

## License

MIT

## Author

**Duong Pham**
AI Engineer & Full-Stack Generalist

- Portfolio: [Link to deployed site]
- GitHub: [GitHub profile]
- LinkedIn: [LinkedIn profile]
