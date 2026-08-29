# Krishna Naik — Portfolio & Personal Web Platform
## Comprehensive Technical & Architecture Documentation

---

## 1. Executive Summary

This project is the official personal portfolio and developer intelligence platform of **Krishna Naik** (Krishna Umesh Naik) — Creative Full-Stack Developer & AI/ML Engineer based in Bengaluru, India.

- **Live Production URL**: [https://krishna-naik.vercel.app](https://krishna-naik.vercel.app)
- **Primary Domain Focus**: Full-Stack Web Development, Artificial Intelligence & Machine Learning, Distributed Systems, 3D Web Graphics, and Cloud Architecture.
- **Repository Hosting**: GitHub ([KrishnaNaik6/Portfolio](https://github.com/KrishnaNaik6/Portfolio))
- **Deployment Platform**: Vercel Serverless Edge Platform

---

## 2. Technology Stack & Key Libraries

| Category | Technology / Library | Version / Details | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | `15.1.7` (App Router) | React framework with Server Components, API routes, and SSR/dynamic rendering |
| **Core UI** | **React** / **React DOM** | `19.0.0` | Declarative component UI library |
| **Language** | **TypeScript** | `5.7.3` | Type-safe JavaScript across client and server |
| **Styling** | **Tailwind CSS** | `3.4.17` | Utility-first CSS engine with custom neon color design system |
| **3D Graphics** | **Three.js** | `0.185.1` | WebGL 3D rendering engine |
| **3D React Wrapper** | **@react-three/fiber** | `9.7.0` | Declarative Three.js scene graphs for React |
| **3D Helper Utilities** | **@react-three/drei** | `10.7.8` | Cameras, controls, geometries, and shader helpers |
| **Animations** | **Framer Motion** | `12.4.7` | Physics-based animations, layout transitions, and scroll reveals |
| **Data Visualization** | **Chart.js** & **react-chartjs-2** | `4.4.8` / `5.3.0` | Canvas charts for GitHub language distributions & stats |
| **Icons** | **Lucide React** | `0.475.0` | Modern, lightweight SVG iconography |
| **Theming** | **next-themes** | `0.4.6` | Seamless Dark/Light theme switching with system detection |
| **CSS Utilities** | **clsx** & **tailwind-merge** | `2.1.1` / `3.0.1` | Conditional and conflict-free CSS class composition |

---

## 3. Project Directory Structure

```text
Portfolio/
├── .env.example                     # Template for environment variables
├── .env.local                       # Local environment secrets (ignored by Git)
├── .gitignore                       # Git ignore configuration
├── next.config.mjs                  # Next.js compiler & image configuration
├── package.json                     # Project dependencies, scripts, metadata
├── postcss.config.mjs               # PostCSS plugin configurations
├── tailwind.config.ts               # Custom color tokens, fonts, animations
├── tsconfig.json                    # TypeScript compiler options & path aliases
├── vercel.json                      # Vercel deployment overrides
│
├── app/                             # Next.js App Router root
│   ├── layout.tsx                   # Root HTML layout, font setup, SEO meta & JSON-LD
│   ├── page.tsx                     # Main server entry page with SSR prefetching
│   ├── globals.css                  # Global design tokens, neon gradients, scrollbars
│   ├── manifest.ts                  # PWA Web App Manifest generator
│   ├── robots.ts                    # Multi-engine search crawler directives generator
│   ├── sitemap.ts                   # Dynamic XML sitemap generator
│   ├── not-found.tsx                # Custom 404 page with 3D theme
│   ├── error.tsx                    # Error boundary with recovery action
│   └── api/                         # Next.js Serverless API Route Handlers
│       └── github/
│           ├── details/route.ts     # Fetches & decodes education.json from private repo
│           ├── projects/route.ts    # Fetches & filters public repos + collaborators
│           ├── profile/route.ts     # Fetches GitHub user profile data
│           ├── repos/route.ts       # Fetches all public repository records
│           └── stats/[username]/    # Aggregates commits, PRs, issues & contribution history
│
├── components/                      # Modular UI Components
│   ├── 3d/                          # WebGL Three.js 3D Scenes
│   │   ├── Background3DParticles.tsx# Ambient floating glass spheres background
│   │   ├── Contact3DGlobe.tsx       # Wireframe 3D globe for contact section
│   │   ├── Experience3DNode.tsx     # 3D timeline milestone nodes
│   │   └── Skills3DConstellation.tsx# Interactive 3D skill constellation canvas
│   ├── cards/                       # Reusable Glassmorphism Cards
│   │   ├── GlassCard.tsx            # Base glass card with neon hover glow
│   │   └── ProjectCard.tsx          # Responsive 3D-tilt project card
│   ├── footer/                      # Footer Component
│   │   └── Footer.tsx               # Responsive multi-column footer with status pill
│   ├── header/                      # Navigation Bar
│   │   ├── Header.tsx               # Sticky desktop & mobile header
│   │   └── MobileNav.tsx            # Animated mobile drawer navigation
│   ├── hero/                        # Core Page Sections
│   │   ├── Welcome.tsx              # Terminal hero introduction with typing banner
│   │   ├── HeroClient.tsx           # Client wrapper with IntersectionObserver
│   │   ├── Hero3DCanvas.tsx         # 3D interactive hero cube / visual element
│   │   ├── AboutSection.tsx         # Bio, philosophy & dynamic achievements
│   │   ├── EducationSection.tsx     # Academic credentials & degrees
│   │   ├── ExperienceSection.tsx    # Work history & internship milestones
│   │   ├── ProjectsSection.tsx      # Filterable featured repositories grid
│   │   ├── SkillsSection.tsx        # Technical categories & soft skills
│   │   ├── TechnologicalDNA.tsx     # Architectural breakdown & language meters
│   │   ├── GitHubContributionGraph.tsx# Interactive GitHub contribution heatmap
│   │   ├── GitHubStatsSection.tsx   # GitHub Intelligence hub & profile explorer
│   │   ├── InterestSection.tsx      # Engineering passions & interests
│   │   └── ContactSection.tsx       # Contact coordinates & resume download
│   ├── theme/                       # Theme Management
│   │   ├── ThemeProvider.tsx        # Next-themes provider wrapper
│   │   └── ThemeToggle.tsx          # Dark/Light theme switch button
│   └── ui/                          # Reusable UI Primitives
│       ├── AnchorLink.tsx           # Smooth scrolling navigation links
│       ├── CustomCursor.tsx         # Smooth pointer-following neon cursor
│       ├── GradientButton.tsx       # Glowing gradient call-to-action button
│       ├── SectionWrapper.tsx       # Uniform section container with staggered reveals
│       └── TerminalWindow.tsx       # Mock terminal frame with command prompt
│
├── docs/                            # Documentation
│   └── project_details.md           # This comprehensive documentation file
│
├── lib/                             # Utility Modules & Types
│   ├── github.ts                    # GitHub REST API data fetchers & decoders
│   ├── seo.ts                       # JSON-LD Schema generators & default SEO metadata
│   ├── types.ts                     # TypeScript interfaces for all data structures
│   └── utils.ts                     # CSS class merger helpers (cn)
│
└── public/                          # Static Assets
    ├── google0ecd0af95524d939.html  # Google Search Console verification file
    ├── k.svg                        # Modern high-resolution vector brand icon / favicon
    └── KrishnaNaik.pdf              # Official downloadable resume
```

---

## 4. Architectural Overview & Data Flow

```mermaid
flowchart TD
    subgraph Client ["Client Browser (Mobile & Desktop)"]
        UI[Next.js React 19 UI]
        GL[Three.js 3D Background & Canvas]
        Framer[Framer Motion Animations]
    end

    subgraph NextServer ["Next.js 15 Server (Vercel Serverless)"]
        Page[app/page.tsx SSR Prefetcher]
        APIDetails[/api/github/details]
        APIProjects[/api/github/projects]
        APIStats[/api/github/stats/:username]
    end

    subgraph GitHubAPI ["GitHub REST API / Sources"]
        PrivateRepo[(KrishnaNaik6/Education/education.json)]
        PublicRepos[(GitHub User Repositories)]
        SearchAPI[(GitHub Search API: Commits & PRs)]
        HeatmapAPI[(GitHub Contribution Heatmap Service)]
    end

    Page -->|SSR Fetch| PrivateRepo
    Page -->|SSR Fetch| PublicRepos
    Page -->|SSR Fetch| SearchAPI
    Page -->|Inject initialData| UI

    UI -->|Client Fallback / Live Explorer| APIDetails
    UI -->|Client Fallback / Live Explorer| APIProjects
    UI -->|Client Fallback / Live Explorer| APIStats

    APIDetails -->|Authenticated Fetch| PrivateRepo
    APIProjects -->|Fetch & Filter| PublicRepos
    APIStats -->|Aggregate| SearchAPI
    APIStats -->|Fetch| HeatmapAPI
```

### Key Data Fetching Principles:
1. **Zero Hardcoded Data**: All personal information (Education, Work Experience, Technical Skills, Soft Skills, Interests, Key Achievements, and Contact Information) is dynamically retrieved from `KrishnaNaik6/Education/contents/education.json` on GitHub.
2. **Server-Side Rendering (SSR) & Dynamic Execution**:
   - `app/page.tsx` and all API routes have `export const dynamic = 'force-dynamic'` to prevent stale static snapshots on Vercel and serve live data instantly on request.
3. **Graceful Fallbacks**:
   - If server prefetch encounters network throttling, client-side fallback hooks in `HeroClient.tsx` seamlessly fetch fresh data from local `/api/github/*` routes.

---

## 5. Detailed Component & Feature Specifications

### 5.1. Hero & Welcome Section (`components/hero/Welcome.tsx`)
- **Terminal Display**: Simulates a live CLI session executing `init --developer="Krishna Naik"` with animated typewriter status indicators.
- **Hero Title**: Semantic `<h1>` containing full names and specialized engineering titles.
- **Quick Action Bar**: Fast jumps to Projects, GitHub Intelligence, and Resume.

### 5.2. Ambient 3D Background (`components/3d/Background3DParticles.tsx`)
- **Visual Design**: 4 large, very subtle, low-opacity (0.10) floating glass spheres with orbiting wireframe accent rings.
- **Adaptive Performance**:
  - Automatically detects mobile screens (`< 768px`) and scales down geometry segment density from 48x48 to 32x32.
  - Automatically disables mouse pointer parallax on touch screens to eliminate touch latency.
  - Utilizes `gl={{ powerPreference: 'high-performance' }}` to preserve device battery life while locking smooth 60fps frame rates.

### 5.3. About Section (`components/hero/AboutSection.tsx`)
- Displays bio, philosophy, location pill (Bengaluru, IN), and core pillars (AI/ML & Full-Stack Architecture).
- **Dynamic Achievements**: Automatically parses and renders key achievements from `education.json`.

### 5.4. Academic Background (`components/hero/EducationSection.tsx`)
- Glass cards dynamically populated from `education.json` (`education` array).
- Renders Institution name, Degree title, Status (*Pursuing* / *Completed*), and graduation year.

### 5.5. Work Experience Section (`components/hero/ExperienceSection.tsx`)
- Vertical neon timeline with **interactive 3D timeline nodes** (`components/3d/Experience3DNode.tsx`).
- Renders company name, role, tenure period, official company link, and project impact points.

### 5.6. Featured Projects Section (`components/hero/ProjectsSection.tsx` & `components/cards/ProjectCard.tsx`)
- Dynamically loads public repositories from GitHub with `has_projects = true` plus collaborative repositories (`Canara-Tech-Labs/sprentzo-webapp`).
- **Responsive Layout**: Designed to fit narrow mobile viewports (such as 344px Samsung Galaxy Fold) with `p-5 sm:p-7 md:p-9` padding and word wrapping.
- **Interactive 3D Tilt**: Subtle cursor-following rotation active on desktop pointers, safe on touch devices.
- Direct links to **Live Applications** and **GitHub Repositories**.

### 5.7. Skills Constellation (`components/hero/SkillsSection.tsx` & `components/3d/Skills3DConstellation.tsx`)
- **Interactive 3D Canvas**: 3D planetary skill constellation rotating in space.
- **Technical Clusters**: Categorized into *Programming & Development*, *Databases & Tools*, and *DevOps*.
- **Soft Skills**: Pill badges for leadership, communication, teamwork, and problem-solving.

### 5.8. GitHub Intelligence & Activity (`components/hero/GitHubStatsSection.tsx`)
- **Real-Time Counters**: Displays live commits (440+), pull requests (50+), issues, and public repositories.
- **Contribution Graph Heatmap (`components/hero/GitHubContributionGraph.tsx`)**: Year-selectable contribution calendar synced directly from GitHub.
- **Technological DNA (`components/hero/TechnologicalDNA.tsx`)**: Language meters and architecture breakdown.
- **Node Switcher Explorer**: Allows visitors to input any public GitHub username to analyze their profile in real time.

### 5.9. Contact Section & Resume (`components/hero/ContactSection.tsx` & `components/3d/Contact3DGlobe.tsx`)
- Floating 3D wireframe globe background.
- Direct links for Email, Phone, LinkedIn, Instagram, and GitHub Profile.
- Direct button to view/download official `KrishnaNaik.pdf` resume.

### 5.10. Responsive Footer (`components/footer/Footer.tsx`)
- Multi-column layout adapting from 2-column mobile to multi-column desktop.
- Live `SYSTEM_ONLINE` status indicator showing current system date and pulse animation.
- Bottom clearance (`pb-28 md:pb-32`) preventing overlap with mobile navigation controls.

---

## 6. Search Engine Optimization (SEO) & Cross-Browser Strategy

### 6.1. Search Query Optimization
The site is specifically optimized to rank for all of the following keyword variations:
- Name variations: `Krishna`, `krishna`, `KRISHNA`, `Krishna Naik`, `krishna naik`, `KRISHNA NAIK`, `Krishna Umesh Naik`, `krishna umesh naik`, `KRISHNA UMESH NAIK`.
- Professional queries: `Krishna Naik portfolio`, `Krishna Umesh Naik portfolio`, `Krishna Naik developer`, `Krishna Naik software developer`, `Krishna Naik full stack developer`, `Krishna Naik AI engineer`, `Krishna Naik AI ML developer`, `Krishna Naik web developer`, `Krishna Naik React developer`, `Krishna Naik Next.js developer`, `Krishna Naik TypeScript developer`, `Krishna Naik Python developer`, `Krishna Naik AI projects`, `Krishna Naik developer portfolio`.

### 6.2. JSON-LD Structured Data Schema (`lib/seo.ts`)
- **`Person` Schema**: Explicitly maps aliases (`alternateName`), educational institutions (`alumniOf`), professions (`jobTitle`), knowledges (`knowsAbout`), and authoritative profile links (`sameAs`).
- **`WebSite` Schema**: Designates the portfolio as an official web entity with `SearchAction` indexing.

### 6.3. Multi-Engine Search Crawler Support (`app/robots.ts`)
Explicit rules and sitemap declarations for:
- **Googlebot** (Google Search)
- **Bingbot** (Microsoft Edge & Bing)
- **Slurp** (Yahoo Search)
- **DuckDuckBot** (DuckDuckGo)
- **Applebot** (Apple Safari & Siri Suggestions)
- **YandexBot** & **Baiduspider**

### 6.4. Cross-Browser Icons & Web App Manifest (`app/manifest.ts` & `public/k.svg`)
- **Favicon SVG**: High-resolution vector squircle badge with neon border glow (`public/k.svg`).
- **Apple Touch Icon**: 180x180 high-DPI iOS home screen bookmark support.
- **Web App Manifest**: Standalone PWA metadata with theme color `#0B0C10`.

---

## 7. Environment Variables Configuration

| Variable | Required In | Purpose | Example / Value |
| :--- | :--- | :--- | :--- |
| `GITHUB_TOKEN` | `.env.local` & Vercel | GitHub Personal Access Token (Classic) with `repo` scope to read private `education.json` and avoid API rate limits (5,000 req/hr) | `ghp_...` |
| `NEXT_PUBLIC_SITE_URL` | `.env.local` & Vercel | Canonical production URL for sitemaps, robots, and OpenGraph cards | `https://krishna-naik.vercel.app` |

### Setting Up in Vercel:
1. Navigate to **Vercel Dashboard** ➔ Select Project ➔ **Settings** ➔ **Environment Variables**.
2. Add `GITHUB_TOKEN` with the valid token (assigned to **Production**, **Preview**, and **Development**).
3. Add `NEXT_PUBLIC_SITE_URL` = `https://krishna-naik.vercel.app`.
4. Trigger a **Redeploy** to apply changes to all serverless lambdas.

---

## 8. Development & Deployment Commands

### Local Development:
```bash
# Install dependencies
npm install

# Start local Next.js development server
npm run dev

# Open in browser at http://localhost:3000
```

### Production Build & Verification:
```bash
# Run production build and type checking
npm run build

# Run local production server test
npm run start
```

### Deploying to Production via Git:
```bash
git add .
git commit -m "Update portfolio features"
git push origin main
```
*Vercel automatically listens to the `main` branch and triggers a production deployment within ~30–60 seconds.*

---

## 9. Performance, Accessibility & Best Practices

- **Dynamic Chunk Splitting**: Heavy 3D components are loaded dynamically via `next/dynamic` with `ssr: false` to ensure fast initial page hydration.
- **Font Optimization**: Google Fonts (`Inter`, `Sora`, `Fira Code`) are loaded via `next/font/google` with `display: 'swap'` for zero Layout Shift (CLS).
- **Reduced Motion Support**: Animations respect system preferences via `prefers-reduced-motion: reduce`.
- **Semantic HTML**: Fully accessible semantic structure (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, and heading hierarchies `<h1>`-`<h4>`).

---

*Document generated for the Krishna Naik Portfolio Web Platform.*
