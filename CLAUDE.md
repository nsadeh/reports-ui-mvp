# Inflection Labs — MVP Report UI

## Project Overview

AI-powered market access intelligence platform for biotech companies. Delivers professional-grade, analyst-signed reports on the competitive and regulatory landscape for a drug's target area, disease area, or indication.

**Demo target:** Curie Partners (preclinical biotech investment fund), Friday March 14, 2026.

The prototype is seeded with hand-curated data for the **TNF-alpha** target area. No backend, no auth, no pipeline — static JSON + MDX content served by Next.js.

## Technical Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS with custom design tokens
- **Report rendering:** MDX via `next-mdx-remote` or `@next/mdx`
- **Chat:** Custom React components + Anthropic Claude API (server-side route handler)
- **Data:** Static JSON + MDX files in `/data` directory
- **Deployment:** Local dev server only

## Design System

### Color Palette

| Token        | Hex       | Usage                                                   |
| ------------ | --------- | ------------------------------------------------------- |
| Dark         | `#083D44` | Primary headers, sidebar bg, report title bar            |
| Accent       | `#026370` | Section headers, table headers, interactive elements     |
| Lime         | `#D4E157` | Status badges ("New"), highlights, callout left-borders  |
| Sage         | `#A7C7AE` | Secondary highlights, muted labels, tag backgrounds      |
| Background   | `#FAFAF6` | Page background                                         |
| Background 2 | `#F3F4EE` | Card backgrounds, alternating table rows                 |
| Text         | `#1A2B2E` | Primary body text                                       |
| Body         | `#3D4F52` | Secondary body text, descriptions                        |
| Muted        | `#6B7F82` | Tertiary text, timestamps, metadata                      |
| Border       | `#E2E5DE` | Card borders, dividers, table rules                      |

### Typography

- **Headings:** Inter or system sans-serif, semibold. Titles in Dark (#083D44).
- **Body:** Inter, regular, 15–16px, line-height 1.6–1.7.
- **Monospace:** For data values, thresholds.

### Component Patterns

- **Cards:** `#F3F4EE` bg with `#E2E5DE` border.
- **Tables:** Accent teal `#026370` header with white text. Alternating row bgs. Subtle horizontal rules.
- **Badges:** Lime `#D4E157` + Dark text for "New". Sage for neutral. Muted for inactive.
- **Sidebar:** Dark teal `#083D44` bg, white/sage text, lime left-border on active nav.
- **Chat panel:** White bg, user msgs right-aligned with sage bg, AI msgs left-aligned with accent-teal left-border.

## Routes

| Route              | Page              |
| ------------------ | ----------------- |
| `/`                | Dashboard (home)  |
| `/reports`         | Reports list      |
| `/reports/[id]`    | Report view + Q&A |
| `/commission`      | Commission report |
| `/api/chat`        | Claude API proxy  |

## Key Architecture Decisions

- All data is static JSON/MDX in `/data` — no database
- Q&A chat falls back to pre-seeded pairs if `ANTHROPIC_API_KEY` is not set
- Desktop-only, single user, no auth
- Reports are pre-authored, not generated at runtime

## PRD Reference

The full PRD is available as a local skill: use `/prd` to load it for detailed specs.
