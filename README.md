# Senova — immersive studio website

A production-ready, 3D-driven marketing site for **Senova**, a digital studio. Built with Next.js (App Router), React Three Fiber, GSAP and Lenis, with light/dark themes, a WebGL fallback for every 3D area and all content kept in plain data files.

## Tech stack

| Area | Library |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4 (CSS-first tokens in `styles/globals.css`) |
| 3D | Three.js 0.182, React Three Fiber 9, @react-three/drei 10 |
| Motion | GSAP 3 + ScrollTrigger (`@gsap/react`), Framer Motion |
| Smooth scroll | Lenis (driven by GSAP's ticker) |
| Icons | Lucide React (+ small custom social glyphs) |

> Three.js is pinned to `0.182.x`: newer versions log a `THREE.Clock` deprecation warning from inside React Three Fiber on every page load. Bump it once R3F moves to `THREE.Timer`.

## Getting started

```bash
npm install          # install dependencies
npm run dev          # start the dev server on http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint (flat config, next/core-web-vitals + typescript)
npm run typecheck    # TypeScript, no emit
```

Requires Node.js 20.9 or newer. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your domain (used for canonical URLs, the sitemap and Open Graph).

## Project structure

```
app/                      Routes (App Router)
  layout.tsx              Fonts, metadata, providers, navbar, footer, shared WebGL canvas
  page.tsx                Home page — composes the sections
  template.tsx            Page transition (fade + lift on client navigation)
  work/[slug]/page.tsx    Project detail pages (statically generated)
  privacy/, terms/        Legal pages
  api/contact, api/newsletter   Form endpoints with server-side validation
  sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, twitter-image.tsx, icon.svg
  not-found.tsx, error.tsx
components/
  navbar/                 Sticky glass navbar, active-section indicator, mobile menu, theme toggle
  hero/                   Hero, character-split headline, scroll indicator
  about/                  About + animated stats
  services/               Services list with the morphing 3D visual
  projects/               Pinned horizontal work gallery + tilting project cards
  technology/             Technologies orbiting a 3D planet (CSS 3D chips)
  showcase/               Immersive 3D chapter section (drag, hover, click, labels)
  process/                Sticky "current stage" process timeline
  testimonials/           Carousel + client marquee
  pricing/                Animated plan cards with pointer spotlight
  faq/                    Accessible accordion
  contact/                Contact section, validated form, form fields
  footer/                 Footer, newsletter, animated statement
  cursor/                 Custom desktop cursor
  loader/                 Loading screen
  legal/                  Legal page layout
  seo/                    JSON-LD structured data
  providers/              Theme, Lenis/GSAP bridge, pointer tracker, ScrollTrigger refresh, hash scroll
  ui/                     Button (magnetic), SplitText, Reveal, Counter, SmartImage, SectionHeading, Logo, SocialIcon
  three/                  3D system (see below)
data/                     All editable content (site, navigation, services, projects, …)
hooks/                    Media queries, reduced motion, touch detection, WebGL support, smooth scroll
lib/                      GSAP setup, tiny external stores, WebGL detection, validation, utilities
public/
  images/projects/        Project cover images (WebP)
  images/testimonials/    Testimonial avatars (abstract, WebP)
  models/                 Put GLB/GLTF files here
styles/globals.css        Design tokens (light + dark), utilities, keyframes
```

### 3D architecture

There is **one** WebGL canvas for the whole site (`components/three/webgl-canvas.tsx`). It is fixed behind the page, and every 3D area is a drei `<View>` that renders into it with scissoring — one GL context, one render loop, no per-section canvases. Views outside the viewport are skipped automatically.

| File | Purpose |
| --- | --- |
| `three/webgl-canvas.tsx` | The shared canvas: adaptive DPR, performance monitor, context-loss handling, error boundary |
| `three/canvas-root.tsx` | Lazy-loads the canvas (Three.js lives in its own chunk) only when WebGL is available |
| `three/scene-view.tsx` | DOM slot for a scene: renders the `<View>` plus a designed static fallback |
| `three/scene-fallback.tsx` | CSS fallback shown before WebGL is ready and when it is unavailable |
| `three/scene-environment.tsx` | Procedural studio lighting (no HDR downloads) |
| `three/particle-field.tsx` | GPU-animated particles |
| `three/interactive-grid.tsx` | Shader grid that glows and ripples under the pointer |
| `three/floating-sphere.tsx` | Floating, hoverable, clickable spheres |
| `three/rotating-object.tsx` | Spins children and leans them toward the pointer |
| `three/model.tsx` | GLB/GLTF loader with Suspense + error fallback |
| `three/scenes/*` | `hero`, `about`, `services`, `technology`, `showcase`, `contact` scenes (each dynamically imported) |

Scenes adapt to the theme (`three/scene-theme.ts`), to the device (`lib/webgl.ts` → particle counts, geometry detail, DPR) and to scroll (`three/use-section-progress.ts`).

## Changing content

Every piece of copy lives in `data/` — components never need to change:

| File | What it controls |
| --- | --- |
| `data/site.ts` | Brand name, SEO description, hero headline/text/buttons, contact details, social links, footer statement |
| `data/navigation.ts` | Navbar items and CTA (ids must match section ids) |
| `data/about.ts` | About statement, intro paragraphs and the statistics (numbers animate to whatever you set) |
| `data/services.ts` | Services: number, title, description, deliverables, icon, 3D form and colour |
| `data/projects.ts` | Portfolio projects and their detail pages |
| `data/technologies.ts` | Technology chips and hover details |
| `data/showcase.ts` | 3D showcase chapters and the clickable objects |
| `data/process.ts` | Process stages |
| `data/testimonials.ts` | Testimonials (**currently demo content** — see below) |
| `data/pricing.ts` | Pricing plans |
| `data/faq.ts` | FAQ (also emitted as FAQPage structured data) |
| `data/contact.ts` | Contact heading, project types and budget options |
| `data/legal.ts` | Privacy policy and terms (have them reviewed before launch) |

Colours, fonts and spacing are design tokens at the top of `styles/globals.css` (`:root` for light, `[data-theme="dark"]` for dark). The 3D palette is in `components/three/scene-theme.ts`.

**Testimonials:** the included quotes, people and companies are fictional and labelled "Demo content" on the page. Replace them with real, approved quotes and set `testimonialsAreDemo = false` in `data/testimonials.ts`.

## Replacing images

1. Put your file in `public/images/...` (WebP or AVIF preferred; JPG/PNG also work — `next/image` serves AVIF/WebP automatically).
2. Update the path in the data file, e.g. `image: "/images/projects/my-project.webp"` in `data/projects.ts`, and write a meaningful `imageAlt`.
3. Recommended sizes: project covers 1600×1000 (16:10), testimonial avatars at least 160×160 (square).

If a file is missing or fails to load, `SmartImage` shows a designed placeholder instead of a broken image. The included covers are original procedural renders made for this project.

## Adding 3D models

1. Export a `.glb` (ideally compressed: `npx gltfjsx model.glb --transform`) and place it in `public/models/`.
2. Use the `Model` component inside any scene:

```tsx
import { Model, preloadModel } from "@/components/three/model";

preloadModel("/models/product.glb"); // optional: start downloading early

<Model url="/models/product.glb" scale={1.2} position={[0, -0.5, 0]} fallback={<mesh><sphereGeometry /><meshStandardMaterial /></mesh>} />
```

The fallback is shown while loading and stays if the file is missing or invalid, so a bad asset never breaks a section. For example, to swap the hero centrepiece, replace the `<mesh>` inside the `core` group in `components/three/scenes/hero-scene.tsx` with a `<Model />`.

To add a brand-new 3D area, create a scene in `components/three/scenes/`, import it with `next/dynamic` (`ssr: false`) and wrap it in `<SceneView>` — it will render into the shared canvas automatically.

## Contact form and newsletter

- `POST /api/contact` validates with the same rules as the client (`lib/contact-schema.ts`) and has a honeypot field. Set `CONTACT_WEBHOOK_URL` to forward submissions as JSON (Formspree, Zapier, Make, a Slack/CRM proxy…). Without it, submissions are logged on the server.
- `POST /api/newsletter` validates the email; connect it to your provider (Resend, Mailchimp, ConvertKit) in `app/api/newsletter/route.ts`.

## Accessibility and performance notes

- Semantic landmarks, skip link, visible focus states, ARIA on the menu, accordion, carousel, radio groups and form errors.
- `prefers-reduced-motion`: smooth scrolling, pinned/horizontal sections, split-text and autoplay are disabled or simplified; the custom cursor is off.
- Touch devices get the native cursor, simplified 3D (fewer particles, lower DPR) and a vertical project list.
- WebGL is detected up front; if it is unavailable, the context is lost or a scene crashes, every 3D area falls back to a static design.
- Three.js and each scene are code-split and loaded after first paint; geometries and materials are disposed by React Three Fiber when scenes unmount.

## Deployment

The site runs on any Node.js host (Railway, Render, Fly.io, a VPS or your own machine):

```bash
npm ci
npm run build
npm run start   # listens on $PORT or 3000
```

Set `NEXT_PUBLIC_SITE_URL` to your domain (used for canonical URLs, the sitemap and Open Graph) and optionally `CONTACT_WEBHOOK_URL`. The API routes need a Node.js runtime, so a fully static export is not used. Everything else is prerendered at build time.
