# Project Overview & Product Development Requirements

## Project Identity

**Name:** Elite Portfolio
**Version:** 1.0.0
**Status:** Production (Deployed)
**Author:** Duong Pham
**Type:** Personal Portfolio Website
**Deployment:** Netlify (Static Export)

## Vision

Create a high-performance, visually stunning portfolio that showcases technical depth through interactive 3D visualizations, demonstrating expertise in AI engineering, full-stack development, and cutting-edge web technologies.

## Target Audience

### Primary
- **Recruiters & Hiring Managers**: Evaluating technical skills for AI/ML or full-stack positions
- **Technical Leads**: Assessing architectural knowledge and code quality
- **Startup Founders**: Looking for versatile engineers with product development experience

### Secondary
- **Fellow Developers**: Seeking inspiration or collaboration
- **Hackathon Organizers**: Reviewing past achievements
- **Academic Institutions**: Evaluating scholarship/program applications

## Core Objectives

### Business Goals
1. **Showcase Technical Versatility**: Demonstrate proficiency across AI/ML, web, mobile, game dev
2. **Establish Credibility**: Highlight hackathon wins, real-world projects, technical depth
3. **Generate Opportunities**: Drive inbound interest from recruiters, collaborators, clients
4. **Personal Branding**: Position as elite end-to-end engineer with AI specialization

### User Experience Goals
1. **Immediate Impact**: Capture attention within 3 seconds via 3D neural network
2. **Progressive Engagement**: Reveal depth through scroll-triggered animations
3. **Performance Excellence**: Maintain 60fps on all interactions, sub-2s initial load
4. **Mobile Accessibility**: Ensure full functionality on mobile devices (80%+ traffic)

### Technical Goals
1. **Zero Runtime Cost**: Static export, no server infrastructure
2. **SEO Optimization**: Server-side metadata, semantic HTML
3. **Future-Proof Stack**: Latest React/Next.js features, TypeScript strict mode
4. **Maintainability**: Clear component separation, documented design system

## Success Metrics

### Quantitative
| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | 95+ | TBD |
| Time to Interactive (TTI) | <2s | TBD |
| First Contentful Paint (FCP) | <1s | TBD |
| 3D Frame Rate (Desktop) | 60fps | ✓ |
| 3D Frame Rate (Mobile) | 30fps+ | ✓ |
| Bundle Size (JS) | <500KB | TBD |
| Accessibility Score | 90+ | TBD |

### Qualitative
- Visual cohesion across sections (Glassmorphism theme)
- Smooth animation transitions (no jank)
- Intuitive navigation (single-page scroll)
- Professional presentation (no "portfolio clichés")

## Functional Requirements

### FR-1: Interactive Hero Section
**Priority:** P0 (Critical)
- Display full-screen 3D neural network background
- Respond to mouse movement with physics-based attraction
- Show name, title, dual CTAs (View Work, Contact)
- Fade on scroll (opacity transition over 150px)

**Acceptance Criteria:**
- Neural network renders within 1s
- Mouse attraction feels natural (1.5 radius, 0.4 strength)
- Mobile: Reduced to 160 nodes for performance
- Scroll fade starts at y=0, completes at y=150px

### FR-2: About Section
**Priority:** P0 (Critical)
- Concise bio (2-3 paragraphs)
- Highlight key strengths in glass cards
- Display expertise tags

**Acceptance Criteria:**
- Bio under 200 words
- 5 highlight cards in responsive grid
- Tags visually distinct with accent color

### FR-3: Skills Visualization
**Priority:** P0 (Critical)
- 3D orbital skill rings (7 categories)
- Interactive orbit with rotation and float
- Skill taxonomy list with categories

**Acceptance Criteria:**
- 7 orbital rings render correctly
- Each skill has SDF text label
- Categories: Languages, AI/ML, Web, App, Game, Backend, Tools
- 30+ skills total

### FR-4: Projects Showcase
**Priority:** P0 (Critical)
- Bento grid layout (varied card sizes)
- Mouse-tracking spotlight effect on hover
- Hackathon badge display
- External links to live demos/GitHub

**Acceptance Criteria:**
- Minimum 4 projects displayed
- Featured projects use larger cards
- Spotlight follows mouse at 60fps
- Tags clearly visible

### FR-5: Achievements Timeline
**Priority:** P1 (High)
- Alternating timeline layout
- Type-coded cards (hackathon, certification, recognition)
- Chronological order (newest first)

**Acceptance Criteria:**
- 4+ achievements
- Color coding by type
- Date + organization visible

### FR-6: Contact Section
**Priority:** P0 (Critical)
- Social links (GitHub, LinkedIn, email)
- Call-to-action button
- Glass card presentation

**Acceptance Criteria:**
- All links functional
- Icons clearly visible
- Mobile-responsive layout

## Non-Functional Requirements

### NFR-1: Performance
- **Target:** Lighthouse 95+ across all categories
- **3D Rendering:** 60fps desktop, 30fps+ mobile
- **Bundle Size:** <500KB gzipped JavaScript
- **Load Time:** <2s TTI on 3G connection
- **Strategy:** Dynamic imports, code splitting, device detection

### NFR-2: Accessibility
- **WCAG Level:** AA compliance
- **Keyboard Navigation:** Full functionality without mouse
- **Screen Readers:** Semantic HTML, ARIA labels
- **Color Contrast:** 4.5:1 minimum for text
- **Focus Indicators:** Visible keyboard focus

### NFR-3: Browser Compatibility
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **WebGL Support:** Required for 3D features
- **Fallback:** Static content if WebGL unavailable
- **Mobile:** iOS 14+, Android Chrome 90+

### NFR-4: SEO
- **Meta Tags:** Open Graph, Twitter Cards
- **Semantic HTML:** Proper heading hierarchy
- **Structured Data:** JSON-LD for person schema
- **Sitemap:** Generated at build time
- **Robots.txt:** Allow all crawlers

### NFR-5: Maintainability
- **TypeScript:** Strict mode, zero `any` types
- **Linting:** ESLint with Next.js config
- **Component Size:** <200 LOC per component (prefer composition)
- **Documentation:** Inline comments for complex logic
- **Design System:** Centralized tokens in globals.css

### NFR-6: Security
- **No Secrets:** All data public, no API keys
- **CSP Headers:** Configured in Netlify
- **HTTPS Only:** Enforced via Netlify
- **Dependency Scanning:** Regular npm audit

## Technical Constraints

### Platform Constraints
- **Static Export Only:** No server-side rendering at runtime
- **No Backend:** All data embedded at build time
- **No Database:** Static data files (TypeScript)
- **CDN Distribution:** Netlify Edge network

### Framework Constraints
- **Next.js App Router:** Server components where possible
- **Client Components:** Required for 3D, animations, interactivity
- **Dynamic Imports:** 3D components with `ssr: false`
- **Image Optimization:** Disabled for static export

### Design Constraints
- **Dark Mode Only:** No light mode toggle (theme locked)
- **Glassmorphism Mandatory:** All cards use glass effect
- **Cyber Lime Accent:** #ADFF2F for all accent colors
- **Geist Fonts:** No font substitution

## Dependencies & Integrations

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | React framework, static export |
| react | 19.2.4 | UI library |
| typescript | 5.9.3 | Type safety |
| tailwindcss | 4.1.18 | Styling system |
| framer-motion | 12.29.2 | Animations |
| three | 0.182.0 | 3D engine |
| @react-three/fiber | 9.5.0 | React renderer for Three.js |
| @react-three/drei | 10.7.7 | 3D helpers |

### External Services
- **Netlify**: Hosting, CDN, deployment
- **None**: No analytics, tracking, or third-party scripts (intentional)

## Risk Assessment

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebGL not supported | Low | High | Fallback to static images |
| Mobile performance | Medium | High | Device detection, reduced nodes |
| Large bundle size | Medium | Medium | Dynamic imports, code splitting |
| Browser compatibility | Low | Medium | Polyfills, modern target only |

### Business Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Portfolio not unique | Medium | Medium | 3D differentiation, interaction |
| Skills outdated | Low | High | Regular updates, versioned data |
| Load time too slow | Low | High | Performance budget, monitoring |

## Future Enhancements

### Planned: Synaptic Ripple
**Priority:** P2 (Medium)
**Status:** Designed, not implemented

Transform neural network into reactive, gamified visualization:
- Click-triggered shockwave pulses
- Hover charging effect on nodes
- Custom GLSL shaders for performance
- Target: 60fps maintained

**Files Affected:**
- `src/components/3d/NeuralNetwork.tsx` (modify)
- `src/components/3d/shaders/neural-network-shader.ts` (new)

**Acceptance Criteria:**
- Click creates visible ripple traveling along connections
- Hover causes node size/glow increase
- No frame rate degradation
- Aligns with glassmorphism aesthetic

### Potential: Analytics
**Priority:** P3 (Low)
- Privacy-focused analytics (Plausible/Fathom)
- No cookies, GDPR compliant
- Track: page views, scroll depth, CTA clicks

### Potential: Blog Section
**Priority:** P3 (Low)
- MDX-based blog posts
- Technical deep dives
- Tutorial content
- Still static export

## Compliance & Standards

### Web Standards
- HTML5 semantic elements
- CSS Grid/Flexbox layouts
- ES2017+ JavaScript features
- WebGL 2.0 for 3D

### Design Standards
- Mobile-first responsive design
- Touch-friendly tap targets (44x44px minimum)
- System font fallbacks
- Reduced motion support

### Code Standards
- ESLint Next.js configuration
- TypeScript strict mode
- Functional components only
- Custom hooks for complex state

## Maintenance Plan

### Regular Updates
- **Dependencies:** Monthly security updates
- **Content:** Projects/achievements as completed
- **Skills:** Add new technologies quarterly
- **Design:** Annual refresh cycle

### Monitoring
- **Performance:** Lighthouse CI on each deployment
- **Errors:** Netlify build logs
- **Uptime:** Netlify status (99.99% SLA)

### Version Control
- **Git Strategy:** Main branch for production
- **Commits:** Conventional commits format
- **Releases:** Semantic versioning (1.0.0 → 1.1.0)

## Conclusion

Elite Portfolio meets all core PDR requirements with a focus on performance, visual impact, and technical demonstration. The static export architecture ensures zero operational cost while maintaining professional quality. Planned enhancements (Synaptic Ripple) will further differentiate from standard portfolios.
