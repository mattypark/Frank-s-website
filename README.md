# Frank Niu — personal site

A personal site built with [Astro](https://astro.build). Static output, deploys
to Vercel with zero config.

## Run it

```bash
npm install
npm run dev      # local dev at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

## Deploy

Push to GitHub and import the repo in Vercel — it auto-detects Astro. No adapter
or settings needed. (Currently targeting the existing `frank-s-website-psi`
project; swap in a custom domain later via Vercel.)

## Where things live

```
src/
  layouts/Layout.astro      # shared shell: fonts, header nav, live clock, page transitions
  components/
    Atmosphere.astro        # global film grain + artboard frame + live readout
    Hero.astro              # the opening thesis + portrait (ambient canvas shards)
    Carousel.astro          # the 3D cylindrical page-carousel + glass shards (Three.js)
    Timeline.astro          # the horizontal "life ledger" (edit events here)
    Work.astro              # Axiom Pathways spotlight + role index (edit roles here)
    Terminal.astro          # the interactive terminal (commands + message flow)
    Footer.astro            # LinkedIn + email (edit handles here)
  pages/
    index.astro             # home: hero + carousel + terminal
    story.astro             # /story  — the timeline
    work.astro              # /work   — what I'm building
    values.astro            # /values — edit the `values` array at the top
    hobbies.astro           # /hobbies — edit the `hobbies` array at the top
    writing/index.astro     # essay portfolio (School / Outside filter)
    writing/[slug].astro    # essay reading view
  content/writing/*.md      # one file per essay — see _HOW-TO-ADD-AN-ESSAY.md
  styles/tokens.css         # all colors, type, spacing, motion variables
public/frank.jpg            # the portrait
```

## The 3D page-carousel (home = the navigation hub)

The home page **opens directly on the carousel** — it's the primary way to get
around (there is no top nav bar). `Carousel.astro` renders a rotating cylinder of
curved panels, one per page, and each panel runs its **own animated GLSL shader**
(mesh-gradient, dot-orbit, waves, noise field, particles) in its own palette.

To change which pages appear, their order/labels, the shader **variant**, or the
3 palette colours per panel, edit:

- the `pages` array (frontmatter) and the matching `TINTS` map (for the fallback cards)
- the `SHADERS` map inside the `<script>` — `variant` 0–4 picks the pattern,
  `a`/`b`/`c` are the three hex colours that shader blends.

Drag / arrows / keyboard rotate it; clicking the front panel (or the `enter`
button) navigates. Where WebGL is unavailable or the visitor prefers reduced
motion, it falls back to an accessible grid of link cards — navigation always works.

## Things to make yours

- **Portrait** — replace `public/frank.jpg`.
- **Hero / lead copy** — `src/components/Hero.astro`.
- **Timeline** — edit the `events` array in `src/components/Timeline.astro`
  (currently placeholder milestones; `kind` is `"life"` or `"work"`).
- **Values** — edit the `values` array in `src/pages/values.astro` (placeholder).
- **Hobbies** — edit the `hobbies` array in `src/pages/hobbies.astro` (placeholder).
- **Roles & stats** — `src/components/Work.astro`.
- **Terminal answers** — the `COMMANDS` object in `src/components/Terminal.astro`.
- **LinkedIn URL & email** — `src/components/Footer.astro` (and the `contact`
  command + mobile mailto in `src/components/Terminal.astro`).
- **Essays** — drop Markdown files into `src/content/writing/`. See
  `src/content/writing/_HOW-TO-ADD-AN-ESSAY.md`.

## The contact form

The terminal's `message` command POSTs to the existing Google Apps Script
endpoint (`MESSAGE_ENDPOINT` in `Terminal.astro`) — the same one from the
original site, so messages still land in the same Google Sheet. On phones the
terminal is tap-only, so `message` opens the visitor's mail client instead.

## Design notes

- **Type:** Bricolage Grotesque (display), Geist Sans (body), Geist Mono (data /
  terminal) — self-hosted via Fontsource.
- **Palette:** warm "paper & ink" with one restrained ink-blue accent. All
  tokens in `src/styles/tokens.css`.
- **Motion:** CSS + a little vanilla JS — scroll reveals, hover micro-interactions,
  page transitions. No animation library. Everything respects
  `prefers-reduced-motion`.
