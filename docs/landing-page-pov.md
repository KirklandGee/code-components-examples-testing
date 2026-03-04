# Landing Page POV: Webflow Code Components

> Strategy, template spec, and auto-generation contract for component landing pages.

---

## Overview

Every component in this repo should have a dedicated landing page on the Webflow site. These pages serve the bottom-of-funnel developer — someone who already knows Webflow, already knows React, and wants a production-ready starting point they can drop in today.

The landing page for each component is **auto-generated from the component folder itself**. The README.md is the canonical source of truth. The page build step reads the README, extracts metadata from `package.json` and `webflow.json`, and renders the page. No manual copy-writing per component.

---

## Core POV

**The audience is developers, not marketers.** Landing pages should look like polished documentation, not a SaaS marketing site. Lead with the demo. Lead with the install command. Show the props table early. Developers skip hero text — they scroll to the code.

**Three things every developer needs to decide "I want this":**

1. A live demo (does it look right on a real site?)
2. The props table (is it flexible enough?)
3. The install command (how fast can I try it?)

Everything else is secondary.

---

## Auto-Generation Contract

Each component folder becomes a landing page. The generator reads these files and extracts structured data:

```
calendar/
├── README.md           ← Primary source for all page content
├── package.json        ← name, version, dependencies
├── webflow.json        ← component display name, description
└── src/components/
    └── Calendar/
        └── Calendar.webflow.tsx  ← (optional) prop count, group names
```

### Frontmatter Convention

Add a `<!-- PAGE -->` HTML comment block at the top of each README to pass page-level metadata that can't be derived automatically:

```markdown
<!-- PAGE
demoUrl: https://cms-slider-4d63c4.webflow.io/
category: Content Display
tags: [carousel, cms, collections, slider]
featured: false
-->
```

If `demoUrl` is absent, the demo section is hidden. If `category` is absent, the generator infers it from the tag list.

### Field Extraction Map

| Landing Page Field | Source |
|---|---|
| Title | README `# H1` |
| One-liner | README first paragraph (up to first period) |
| Full description | README intro section (before first `##`) |
| Install commands | Standard — identical for all components |
| Props table | README `## Designer Properties` section |
| Site variables table | README `### Site Variables` section |
| Code examples | README `## Extending in Code` section |
| Dependencies | `package.json` → `dependencies`, filtered to exclude `react`, `react-dom` |
| Version | `package.json` → `version` |
| Display name | `webflow.json` → `library.name` |
| Component ID | `webflow.json` → `library.id` |
| GitHub URL | `{REPO_BASE_URL}/{component-folder}/` |
| Demo URL | README `<!-- PAGE -->` frontmatter |
| Category | README `<!-- PAGE -->` frontmatter |
| Tags | README `<!-- PAGE -->` frontmatter |

---

## Page Template

This is the structure every component landing page follows. Sections marked `[AUTO]` are fully derived from the component folder. Sections marked `[STATIC]` are the same across all pages.

---

### 1. SEO Head `[AUTO]`

```
title:        "{Display Name} — Webflow Code Component"
description:  "{One-liner from README}"
og:image:     "/og/{component-id}.png"  (screenshot of demo, or fallback)
canonical:    "/components/{component-id}/"
```

---

### 2. Page Header `[AUTO]`

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Components                               │
│                                                     │
│  [Category chip]   [Tag chips...]                   │
│                                                     │
│  # Calendar                                         │
│  A date picker that adapts to your Webflow site's   │
│  design system.                                     │
│                                                     │
│  v0.0.0  ·  react-day-picker  ·  View on GitHub →   │
│                                                     │
│  [Live Demo ↗]   [Install Guide ↓]                  │
└─────────────────────────────────────────────────────┘
```

- Title: README `# H1`
- Description: first sentence of README
- Version badge: from `package.json`
- Dependency chips: non-React entries in `package.json dependencies`
- GitHub link: `{REPO_URL}/{folder}/`
- Live Demo button: only shown if `demoUrl` set in frontmatter

---

### 3. Live Demo `[AUTO — conditional]`

```
┌─────────────────────────────────────────────────────┐
│  Live Demo                                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  │  [iframe: demoUrl]                          │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                              Open in new tab ↗      │
└─────────────────────────────────────────────────────┘
```

Only rendered when `demoUrl` is present. Use a sandboxed iframe. Show a static screenshot fallback if the URL is unavailable.

---

### 4. Install `[STATIC commands + AUTO component ID]`

This is the most important section. Show it high on the page, before the props table.

```
┌─────────────────────────────────────────────────────┐
│  Install                                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Clone the component                             │
│                                                     │
│  git clone https://github.com/{org}/{repo}.git      │
│  cd {component-folder}                              │
│                                                     │
│  2. Install dependencies                            │
│                                                     │
│  npm install                                        │
│                                                     │
│  3. Share to your Webflow workspace                 │
│                                                     │
│  npx webflow library share                          │
│                                                     │
│  ⓘ Run this from inside the component folder,      │
│    not the repo root.                               │
│                                                     │
│  4. Add to your site in the Designer                │
│                                                     │
│  In Webflow Designer:                               │
│  Apps panel → Libraries → Install → drag to canvas  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Local development                                  │
│                                                     │
│  npm run dev                                        │
│  → http://localhost:5173                            │
│                                                     │
│  Reload after prop changes to see updates.          │
└─────────────────────────────────────────────────────┘
```

**The `npx webflow library share` command requires a workspace API token.** Show a collapsible block with auth setup instructions:

```
▸ First-time setup: Workspace API token

  export WEBFLOW_WORKSPACE_API_TOKEN=your_token_here

  Get your token: Webflow Dashboard → Workspace Settings →
  Integrations → API Access → Generate Token

  Requires "Apps & Extensions" permission.
```

---

### 5. Designer Properties `[AUTO]`

Pulled verbatim from the README `## Designer Properties` section. Render as a styled table with:

- `Type` column uses chips (Variant = dropdown, Boolean = toggle, Slot = slot, etc.)
- `Default` column uses code formatting
- Sortable by group if prop groups are present

```
┌─────────────────────────────────────────────────────┐
│  Designer Properties                                │
│                                                     │
│  Configure these in the Webflow properties panel.   │
│                                                     │
│  Property          Type        Default   Description│
│  ──────────────────────────────────────────────────│
│  Element ID        [id]        —         HTML ID... │
│  Size              [variant]   default   compact /  │
│  Caption Layout    [variant]   label     label /    │
│  Show Outside Days [toggle]    true      Show dates │
│  ...                                                │
└─────────────────────────────────────────────────────┘
```

---

### 6. Styling & Site Variables `[AUTO]`

Pulled from README `## Styling` and `### Site Variables`. Render the variables table with:

- A visual swatch for color variables (using the fallback value)
- A note explaining that variable names may differ per site
- A collapsible "How to find your variable names" tip (pulled from README text)

```
┌─────────────────────────────────────────────────────┐
│  Styling                                            │
│                                                     │
│  This component inherits font-family, color, and    │
│  line-height from its parent automatically.         │
│                                                     │
│  Site Variable           Controls          Fallback │
│  ────────────────────────────────────────────────── │
│  --background-primary  ● Background        #ffffff  │
│  --background-secondary● Hover states      #f5f5f5  │
│  --text-primary        ● Day numbers       #1a1a1a  │
│  --accent-color        ● Selected date     #1a1a1a  │
│  --border-radius         Corner rounding   8px      │
│  ...                                                │
│                                                     │
│  ▸ How to find your site's variable names           │
└─────────────────────────────────────────────────────┘
```

---

### 7. Extend in Code `[AUTO]`

Pulled from README `## Extending in Code`. Render code blocks with syntax highlighting.

```
┌─────────────────────────────────────────────────────┐
│  Extending in Code                                  │
│                                                     │
│  All source code is readable and forkable. Common   │
│  customizations:                                    │
│                                                     │
│  Change selection mode                              │
│  ┌───────────────────────────────┐                  │
│  │  // Range selection           │  [Copy]          │
│  │  <DayPicker mode="range" ...  │                  │
│  └───────────────────────────────┘                  │
│                                                     │
│  Disable specific dates                             │
│  ┌───────────────────────────────┐                  │
│  │  <DayPicker                   │  [Copy]          │
│  │    disabled={[...]}           │                  │
│  └───────────────────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

---

### 8. Dependencies `[AUTO]`

Pulled from `package.json dependencies`, excluding `react` and `react-dom`. Render as a list with links to npm/docs.

```
┌─────────────────────────────────────────────────────┐
│  Dependencies                                       │
│                                                     │
│  react-day-picker  ↗ daypicker.dev                  │
│  (Included in component — no separate install)      │
└─────────────────────────────────────────────────────┘
```

---

### 9. Footer Nav `[STATIC]`

```
┌─────────────────────────────────────────────────────┐
│  ← Prev Component        Next Component →           │
│                                                     │
│  Browse all components ↗                            │
└─────────────────────────────────────────────────────┘
```

---

## README Authoring Guidelines

For auto-generation to work cleanly, README files must follow this structure exactly. The generator-reference.md README template already conforms to this — every generated component gets it for free.

```markdown
<!-- PAGE
demoUrl: https://your-demo.webflow.io/
category: Content Display
tags: [carousel, cms, slider]
featured: false
-->

# Component Name

One-liner description — one sentence, ends with a period.
May have a second sentence if needed for context.

## Getting Started

(Standard block — identical across all components)

```bash
npm install
npx webflow library share
```

For local development: `npm run dev` → `http://localhost:5173`

## Designer Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| ...

## Styling

Intro paragraph about site variable inheritance.

### Site Variables

| Site Variable | What It Controls | Fallback |
|---|---|---|
| ...

## Extending in Code

### Section heading

```tsx
// code example
```

## Dependencies

- [lib-name](url) — one-line description
```

### Rules

- `## Getting Started` must come before `## Designer Properties`
- `### Site Variables` must be nested under `## Styling`
- All prop table rows must have 4 columns (Property, Type, Default, Description)
- All site variable table rows must have 3 columns (Variable, What It Controls, Fallback)
- The `<!-- PAGE -->` frontmatter block must be the very first line of the file

---

## Sync Strategy

The landing pages stay in sync with the repo through a CI step that runs on every merge to `main`:

```
on: push (main)
  1. For each folder with a README.md and webflow.json:
     a. Parse README frontmatter + sections
     b. Parse package.json + webflow.json
     c. Emit a structured JSON payload: { title, description, props[], vars[], examples[], meta }
     d. Call Webflow CMS API to upsert the component page
  2. Trigger a site publish
```

### JSON Payload Schema (per component)

```json
{
  "id": "calendar",
  "displayName": "Calendar",
  "version": "0.0.0",
  "description": "A date picker calendar...",
  "oneLiner": "A date picker calendar built on react-day-picker that adapts to your Webflow site's design system.",
  "category": "Date & Time",
  "tags": ["datepicker", "calendar", "date", "input"],
  "demoUrl": null,
  "githubUrl": "https://github.com/{org}/{repo}/tree/main/calendar/",
  "dependencies": [
    { "name": "react-day-picker", "url": "https://daypicker.dev/", "description": "date picker engine" }
  ],
  "props": [
    { "name": "Size", "type": "Variant", "default": "default", "description": "Cell sizing", "group": "Settings" }
  ],
  "siteVariables": [
    { "variable": "--background-primary", "controls": "Calendar background", "fallback": "#ffffff" }
  ],
  "codeExamples": [
    { "heading": "Change selection mode", "code": "// Range selection\n<DayPicker mode=\"range\" ...>" }
  ],
  "installSteps": [
    { "step": 1, "label": "Clone", "command": "git clone ... && cd calendar" },
    { "step": 2, "label": "Install", "command": "npm install" },
    { "step": 3, "label": "Share", "command": "npx webflow library share" }
  ]
}
```

This JSON is the contract between the repo and the CMS. Build it once, render it anywhere — landing page, component library index, search index, OG image generator.

---

## Component Index Page

The `/components` index page aggregates all component payloads and renders:

- Filter bar (by category, by tags, by dependency)
- Grid of component cards
  - Component name + one-liner
  - Category chip + tag chips
  - Demo screenshot or placeholder
  - "Install" CTA
- Search (client-side, over `displayName + description + tags`)

Card layout:
```
┌──────────────────────────┐
│  [screenshot / preview]  │
│                          │
│  Calendar                │
│  [Date & Time]           │
│                          │
│  A date picker that      │
│  adapts to your site...  │
│                          │
│  react-day-picker        │
│  [Install →]             │
└──────────────────────────┘
```

---

## Component Categories (Proposed)

| Category | Components |
|---|---|
| Content Display | CMS Slider, Testimonial Carousel, FAQ Accordion |
| Hero & Layout | Hero Section |
| Date & Time | Calendar |
| Data & Integration | Job Board, Weather Widget, Store Locator |
| Forms & Input | Multi-Step Form, Pricing Calculator |

---

## Design Notes

**Typography:** Match the Webflow developer docs aesthetic — monospace for code, clean sans-serif for body. Not a marketing site.

**Color:** Neutral background. Accent only on CTAs and active states. Let the component demo be the visual focal point.

**Code blocks:** Syntax-highlighted, one-click copy. Line numbers only if block is >10 lines.

**Mobile:** Install commands, props table, and site variables table must all work on mobile. No horizontal scroll traps.

**Performance:** Pages are static HTML at build time. Zero JS required to read install instructions or the props table. Interactive features (demo iframe, copy button, search) are progressive enhancements.
