# Deployment Guide

## Overview

Elite Portfolio deploys to **Netlify** as a static export. Zero server runtime, full CDN distribution, automatic HTTPS.

## Prerequisites

### Required Accounts
- **GitHub Account**: Repository hosting
- **Netlify Account**: Deployment platform (free tier sufficient)

### Required Tools
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: Version control

## Local Development

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd porfolio_web

# Install dependencies
npm install

# Start development server
npm run dev
```

**Dev Server:** http://localhost:3000

### Available Scripts

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Development server with hot reload | localhost:3000 |
| `npm run build` | Production build (static export) | /out directory |
| `npm start` | Serve production build locally | localhost:3000 |
| `npm run lint` | Run ESLint | Console errors/warnings |

### Build Verification

```bash
# Build static export
npm run build

# Check output
ls -la out/

# Serve locally to test
npm start
```

**Expected Output Structure:**
```
out/
├── index.html              # Main page
├── _next/
│   ├── static/
│   │   ├── chunks/         # JavaScript bundles
│   │   │   ├── main-[hash].js
│   │   │   ├── pages/
│   │   │   └── webpack-[hash].js
│   │   └── css/            # Compiled stylesheets
│   │       └── app/layout.css
│   └── data/               # Build metadata
├── images/                 # Project screenshots
│   └── *.jpg
└── icon.svg                # Favicon
```

## Netlify Deployment

### Method 1: GitHub Integration (Recommended)

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin master
```

**Step 2: Connect Netlify**
1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as provider
4. Authorize Netlify to access repositories
5. Select `porfolio_web` repository

**Step 3: Configure Build Settings**
```
Build command:    npm run build
Publish directory: out
Production branch: master
```

**Step 4: Deploy**
- Click "Deploy site"
- Netlify assigns temporary URL: `https://random-name-12345.netlify.app`

**Step 5: Custom Domain (Optional)**
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `duongpham.dev`)
4. Follow DNS configuration instructions

### Method 2: Netlify CLI

**Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

**Login:**
```bash
netlify login
```

**Initialize:**
```bash
netlify init
```

**Deploy:**
```bash
# Build first
npm run build

# Deploy to production
netlify deploy --prod --dir=out
```

### Method 3: Drag & Drop

**Manual Deploy:**
1. Run `npm run build` locally
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag `/out` folder to upload
4. Netlify hosts immediately

**Note:** No continuous deployment with this method.

## Configuration Files

### netlify.toml

**Current Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "out"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Advanced Options (if needed):**
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18.x"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### next.config.ts

**Static Export Configuration:**
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',              // Generate static HTML
  images: {
    unoptimized: true,           // No image optimization (static export)
  },
  trailingSlash: true,           // Add trailing slash to URLs
}

export default nextConfig
```

**Why These Settings:**
- `output: 'export'`: Generates static HTML/CSS/JS files
- `images.unoptimized: true`: Required for static export (no Image Optimization API)
- `trailingSlash: true`: Ensures consistent URLs across environments

## Build Process

### Build Pipeline

```mermaid
graph LR
    Source[Source Code] --> Install[npm install]
    Install --> Build[npm run build]
    Build --> TypeScript[TypeScript Compilation]
    TypeScript --> Next[Next.js Build]
    Next --> Static[Static Export]
    Static --> Out[/out Directory]
    Out --> Deploy[Netlify CDN]
```

### Build Steps (Detailed)

**1. Dependency Installation**
```bash
npm install
```
- Installs packages from package.json
- Creates node_modules/
- Duration: ~30-60s

**2. Next.js Build**
```bash
next build
```
- TypeScript type checking
- ESLint validation
- React component compilation
- Tailwind CSS processing
- JavaScript bundling
- Static page generation
- Duration: ~60-120s

**3. Static Export**
- Generates HTML files for all routes
- Copies public assets
- Creates optimized bundles
- Outputs to `/out` directory

**4. Netlify Processing**
- Uploads files to CDN
- Distributes to edge nodes
- Invalidates old cache
- Updates DNS (if custom domain)
- Duration: ~10-30s

### Build Logs

**Successful Build Example:**
```
10:30:45 AM: Build ready to start
10:30:47 AM: Installing dependencies
10:31:15 AM: Dependencies installed
10:31:15 AM: Started running npm run build
10:31:17 AM: > elite-portfolio@1.0.0 build
10:31:17 AM: > next build
10:31:20 AM: ▲ Next.js 16.1.6
10:31:25 AM: Creating an optimized production build
10:32:10 AM: Compiled successfully
10:32:12 AM: Collecting page data
10:32:15 AM: Generating static pages (1/1)
10:32:16 AM: Finalizing page optimization
10:32:16 AM: Route (app)                  Size
10:32:16 AM: ┌ ○ /                        142 kB
10:32:16 AM: Build completed in 59s
10:32:20 AM: Site is live
```

## Environment Variables

**Current Project:** None required

**If Needed (Future):**

**Netlify Dashboard:**
1. Go to "Site settings" → "Environment variables"
2. Add variables:
   ```
   NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX
   ```

**Access in Code:**
```typescript
const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID
```

**Important:** Only `NEXT_PUBLIC_*` variables are available in browser.

## Custom Domain Setup

### DNS Configuration

**Option 1: Netlify DNS (Recommended)**
1. Go to "Domain settings" → "Add custom domain"
2. Enter domain name
3. Update nameservers at registrar to Netlify's:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

**Option 2: External DNS**
1. Keep existing nameservers
2. Add A record:
   ```
   @ → 75.2.60.5 (Netlify load balancer)
   ```
3. Add CNAME record:
   ```
   www → your-site.netlify.app
   ```

### SSL Certificate

**Automatic (Let's Encrypt):**
- Netlify provisions SSL automatically
- Renews every 60 days
- No configuration needed

**Custom Certificate:**
1. Go to "Domain settings" → "HTTPS"
2. Click "Provide your own certificate"
3. Upload certificate + private key

## Deployment Strategies

### Automatic Deployment (CI/CD)

**Trigger:** Every push to `master` branch
```bash
git add .
git commit -m "Update hero section"
git push origin master
```

**Netlify automatically:**
1. Detects push via GitHub webhook
2. Runs build command
3. Deploys to production
4. Updates live site

**Duration:** 2-4 minutes from push to live

### Deploy Previews

**Feature Branches:**
```bash
git checkout -b feature/new-section
git push origin feature/new-section
```

**Netlify creates:**
- Unique preview URL: `https://deploy-preview-5--your-site.netlify.app`
- Visible in GitHub PR checks
- Auto-deletes after merge

### Manual Deployment

**Via Netlify UI:**
1. Go to "Deploys" tab
2. Drag `/out` folder to "Deploy manually" zone

**Via CLI:**
```bash
netlify deploy --prod --dir=out
```

### Rollback

**Revert to Previous Deploy:**
1. Go to "Deploys" tab
2. Find previous successful deploy
3. Click "Publish deploy"
4. Site reverts immediately

## Performance Optimization

### Build Optimization

**Bundle Analysis:**
```bash
npm run build -- --analyze
```

**Check Bundle Size:**
```bash
du -sh out/_next/static/chunks/*
```

**Lighthouse CI (Future):**
```bash
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

### CDN Configuration

**Cache Headers (Automatic):**
```
HTML:      Cache-Control: public, max-age=0, must-revalidate
CSS/JS:    Cache-Control: public, max-age=31536000, immutable
Images:    Cache-Control: public, max-age=31536000, immutable
```

**Why:**
- HTML: Always fresh (revalidate on each request)
- Assets: Fingerprinted (safe to cache forever)

### Asset Optimization

**Image Compression:**
```bash
# Use tools like TinyPNG, ImageOptim
# Target: 80% quality, WebP format
```

**Font Subsetting (if needed):**
```bash
# Geist fonts are already optimized by next/font
# No manual subsetting required
```

## Monitoring & Analytics

### Netlify Analytics (Paid)

**Enable:**
1. Go to "Analytics" tab
2. Click "Enable Netlify Analytics"
3. $9/month per site

**Metrics:**
- Page views
- Unique visitors
- Bandwidth usage
- Top pages

### External Analytics (Free)

**Google Analytics 4:**
```tsx
// app/layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXX`}
  strategy="afterInteractive"
/>
```

**Plausible (Privacy-Focused):**
```tsx
<Script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"
/>
```

### Build Notifications

**Email Notifications:**
1. Go to "Site settings" → "Build & deploy"
2. Enable "Email notifications"
3. Choose: Deploy started, succeeded, failed

**Slack Notifications:**
1. Go to "Notifications"
2. Click "Add notification"
3. Choose "Slack" integration

## Troubleshooting

### Common Build Errors

**Error: Build command failed**
```
Solution: Run npm run build locally to debug
Check: package.json scripts, TypeScript errors
```

**Error: Module not found**
```
Solution: Verify imports use @ alias, not relative paths
Check: Path exists, case-sensitive filenames
```

**Error: Out of memory**
```
Solution: Increase Node.js memory
Add to netlify.toml:
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Deployment Issues

**Issue: Site shows 404**
```
Solution: Check publish directory is "out"
Verify: next.config.ts has output: 'export'
```

**Issue: Images not loading**
```
Solution: Check public/ folder structure
Verify: Image paths are correct (case-sensitive)
```

**Issue: 3D components not rendering**
```
Solution: Check browser console for WebGL errors
Verify: Dynamic imports have ssr: false
```

### Performance Issues

**Issue: Slow initial load**
```
Solution: Analyze bundle size
Check: npm run build output for large chunks
Consider: Code splitting, lazy loading
```

**Issue: Low Lighthouse score**
```
Solution: Run Lighthouse locally
Address: Flagged issues (unused CSS, large images)
```

## Deployment Checklist

**Pre-Deploy:**
- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Test locally with `npm start`
- [ ] Verify all images load
- [ ] Test 3D components render
- [ ] Check mobile responsiveness
- [ ] Review commit message

**Post-Deploy:**
- [ ] Visit live URL
- [ ] Test all sections scroll smoothly
- [ ] Verify external links work
- [ ] Check 3D performance (60fps desktop)
- [ ] Test on mobile device
- [ ] Run Lighthouse audit
- [ ] Monitor build logs for warnings

## Security Best Practices

### Repository Security
```bash
# Never commit:
.env
.env.local
*.key
*.pem
credentials.json
```

### Netlify Security
- Enable "HTTPS only" (automatic)
- Set security headers in netlify.toml
- Use environment variables for secrets (if any)
- Enable deploy previews for PRs only

### Dependency Security
```bash
# Regular security audits
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Cost Estimation

### Netlify Free Tier (Sufficient)
- 100GB bandwidth/month
- 300 build minutes/month
- 1 concurrent build
- Automatic HTTPS
- Deploy previews

**Current Usage:**
- ~500KB per page load
- ~200 page loads = 100MB/day
- Well within free tier

### Paid Tiers (If Needed)

**Pro ($19/month):**
- 400GB bandwidth
- Better performance
- Priority support

**Business ($99/month):**
- 1TB bandwidth
- Advanced security
- SSO support

## Continuous Integration

### GitHub Actions (Optional)

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
```

**Benefits:**
- Pre-deployment validation
- Automated testing
- Build caching

## Backup & Recovery

### Repository Backup
- Primary: GitHub (version controlled)
- Backup: Clone to local machine regularly

### Deployment Backup
- Netlify keeps 30 days of deploy history
- Can rollback to any previous deploy

### Data Backup
- Static data files in repository (Git)
- No database (nothing to backup)

## Summary

**Deployment Workflow:**
1. Develop locally (`npm run dev`)
2. Build & test (`npm run build`, `npm start`)
3. Commit & push to GitHub
4. Netlify auto-builds & deploys
5. Live site updates in 2-4 minutes

**Key Points:**
- Static export (no server)
- Netlify free tier sufficient
- Automatic CI/CD via GitHub
- Zero-config HTTPS
- Global CDN distribution
- Instant rollback capability

**Best Practice:**
```bash
# Feature development
git checkout -b feature/new-section
# ... make changes ...
npm run build        # Verify build works
git commit -m "feat: add new section"
git push origin feature/new-section
# Review deploy preview
# Merge PR → Auto-deploys to production
```
