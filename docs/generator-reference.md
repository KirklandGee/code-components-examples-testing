# Webflow Code Component Generator Reference

> The single source of truth for generating Webflow code components.
> This document is the prompt context for the Output.ai generator workflow.

---

## Design Philosophy

Components must be **unopinionated on styling**. They should automatically adapt to whatever Webflow site they're dropped into. The target audience is **frontend developers being brought into Webflow**, not designers learning code.

### Core Principles

1. **No design system** — Don't copy shadcn, Material UI, or any opinionated design system. Components are structural, not stylistic.
2. **Site variables with fallbacks** — Use `var(--site-variable, #fallback)` for all colors, radii, spacing tokens. Always provide sensible fallbacks so the component looks good even without site variables defined.
3. **Inherit typography** — Use `font-family: inherit; color: inherit; line-height: inherit;` so the component picks up the site's typeface automatically.
4. **Tag selectors opt-in** — Set `applyTagSelectors: true` when the component renders semantic HTML (buttons, headings, paragraphs) so site-level tag styles apply.
5. **Plain CSS** — No Tailwind, no CSS-in-JS. Just plain CSS with custom properties. This keeps components simple and avoids build tool dependencies.
6. **Minimal, focused props** — Expose styling variants, behavioral toggles, Slots for composability, and IDs for targeting. Don't expose every possible option.

---

## Project Scaffold

Every component is a self-contained Vite project. These files are identical across all components — only the component name and dependencies change.

### package.json

```json
{
  "name": "COMPONENT_KEBAB_NAME",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/react": "^19.1.13",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.3",
    "@webflow/data-types": "^1.0.1",
    "@webflow/react": "^1.0.1",
    "@webflow/webflow-cli": "^1.8.44",
    "typescript": "~5.8.3",
    "vite": "^7.1.7"
  }
}
```

Add component-specific dependencies (e.g., `react-day-picker`) to `dependencies`.

### webflow.json

```json
{
  "library": {
    "name": "COMPONENT_DISPLAY_NAME",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "description": "COMPONENT_DESCRIPTION",
    "id": "COMPONENT_KEBAB_NAME"
  }
}
```

### vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

### tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsBuildInfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsBuildInfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>COMPONENT_DISPLAY_NAME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Component File Structure

```
COMPONENT_KEBAB_NAME/
├── package.json
├── webflow.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── index.html
├── README.md
└── src/
    ├── main.tsx                              # Local dev entry
    └── components/
        └── ComponentName/
            ├── ComponentName.tsx             # Pure React component
            ├── ComponentName.css            # Structural CSS with site variables
            └── ComponentName.webflow.tsx     # Webflow declaration
```

---

## Component Files

### ComponentName.tsx — Pure React Component

Rules:
- Define a TypeScript `interface` for all props
- Use default parameter values
- Has **no awareness of Webflow** — pure React
- Prefix all CSS class names with `wf-componentname-` to avoid collisions
- Use `useState`, `useEffect`, refs as needed
- Set `ssr: false` in the declaration if using browser APIs

```tsx
import { useState } from "react";

export interface ComponentNameProps {
  id?: string;
  variant?: "default" | "secondary";
  size?: "compact" | "default" | "large";
  children?: React.ReactNode;
  header?: React.ReactNode;   // Slot
  footer?: React.ReactNode;   // Slot
}

export default function ComponentName({
  id,
  variant = "default",
  size = "default",
  children,
  header,
  footer,
}: ComponentNameProps) {
  return (
    <div id={id} className={`wf-componentname wf-componentname--${variant}`}>
      {header && <div className="wf-componentname-header">{header}</div>}
      <div className="wf-componentname-content">{children}</div>
      {footer && <div className="wf-componentname-footer">{footer}</div>}
    </div>
  );
}
```

### ComponentName.css — Structural CSS

Rules:
- Comment block at top listing all site variables used
- Root element uses `font-family: inherit; color: inherit; line-height: inherit;`
- All colors via `var(--site-variable, #fallback)`
- All radii via `var(--border-radius, 8px)`
- Use internal CSS custom properties (e.g., `--wf-componentname-cell-size`) for dynamic values set from JS
- No Tailwind, no CSS-in-JS
- Class names prefixed with `wf-componentname-`

```css
/*
 * ComponentName Styles
 *
 * Site variables used:
 *   --background-primary   → component background
 *   --background-secondary → hover states
 *   --text-primary         → main text
 *   --text-secondary       → muted text
 *   --border-color         → borders
 *   --accent-color         → active/selected state
 *   --accent-text-color    → text on accent background
 *   --border-radius        → corner rounding
 *
 * If your site uses different variable names, rename them below.
 */

.wf-componentname {
  font-family: inherit;
  color: inherit;
  line-height: inherit;
}

.wf-componentname-root {
  background: var(--background-primary, #ffffff);
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: var(--border-radius, 8px);
}
```

### Standard Site Variables

These are the common Webflow site variable names. Always provide fallbacks:

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--background-primary` | Main background | `#ffffff` |
| `--background-secondary` | Hover, subtle backgrounds | `#f5f5f5` |
| `--text-primary` | Main text color | `#1a1a1a` |
| `--text-secondary` | Muted text, labels | `#737373` |
| `--border-color` | Borders, dividers | `#e5e5e5` |
| `--accent-color` | Selected/active state background | `#1a1a1a` |
| `--accent-text-color` | Text on accent background | `#ffffff` |
| `--border-radius` | Corner rounding | `8px` |

Not every component needs all of these. Only reference the ones the component actually uses.

### ComponentName.webflow.tsx — Webflow Declaration

Rules:
- Import the React component
- Import `props` from `@webflow/data-types`
- Import `declareComponent` from `@webflow/react`
- **Import CSS here**, not in the React component
- Set `ssr: false` if component uses browser APIs (useState, window, document)
- Set `applyTagSelectors: true` for components with semantic HTML
- Group props: Settings, Style, Display, Content, Behavior

```tsx
import ComponentName from "./ComponentName";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./ComponentName.css";

export default declareComponent(ComponentName, {
  name: "Component Name",
  description: "A brief description of what this component does.",
  group: "Category",
  options: {
    ssr: false,
    applyTagSelectors: true,
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID for targeting with CSS or JavaScript",
    }),
    variant: props.Variant({
      name: "Variant",
      options: ["default", "secondary"],
      defaultValue: "default",
      group: "Style",
      tooltip: "Visual style variant",
    }),
    children: props.Slot({
      name: "Content",
      group: "Content",
      tooltip: "Main content area",
    }),
  },
});
```

### main.tsx — Local Dev Entry

For testing the component locally with `npm run dev`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ComponentName from "./components/ComponentName/ComponentName.tsx";
import "./components/ComponentName/ComponentName.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>ComponentName</h1>
      <ComponentName />
      {/* Add more demos showing different prop combinations */}
    </div>
  </StrictMode>
);
```

---

## Prop Types Reference

Use the right prop type for each use case:

| Prop Type | Use When | Returns | Example |
|-----------|----------|---------|---------|
| `props.Id()` | Need HTML id for CSS/JS targeting | `string` | Element ID |
| `props.Variant()` | Fixed set of style options | `string` | Size, variant, layout mode |
| `props.Boolean()` | Simple on/off toggle | `boolean` | Show/hide feature, enable behavior |
| `props.Visibility()` | Show/hide entire sections | `boolean` | Show header, show footer |
| `props.Number()` | Numeric configuration | `number` | Speed, count, columns |
| `props.Text()` | String input | `string` | Labels, placeholder text |
| `props.RichText()` | Formatted content | HTML `string` | Descriptions, body content |
| `props.Slot()` | Composable content area | `ReactNode` | Header, footer, children |
| `props.Image()` | Image assets | `{ src, alt }` | Avatars, thumbnails |
| `props.Link()` | Navigation links | `{ href, target? }` | CTA links |

### Prop Groups

Organize props into these groups:

| Group | Contains |
|-------|----------|
| **Settings** | Element ID, configuration that affects both behavior and appearance |
| **Style** | Variant, size, color scheme, layout mode |
| **Display** | Boolean toggles for showing/hiding parts (outside days, week numbers) |
| **Content** | Slots, text content, images |
| **Behavior** | Autoplay, speed, interaction modes |

---

## README Template

Every component ships with a README following this exact structure:

```markdown
# Component Name

One sentence describing what this component does and that it adapts to your Webflow site's design system.

## Getting Started

\`\`\`bash
npm install
npx webflow library share
\`\`\`

For local development: `npm run dev` → `http://localhost:5173`

## Designer Properties

These are configurable in the Webflow Designer properties panel:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Element ID | ID | — | HTML ID for targeting with CSS or JavaScript |
| Size | Variant | `default` | ... |

## Styling

This component automatically adapts to your Webflow site's design system. It inherits `font-family`, `color`, and `line-height` from its parent element, and references site variables for everything else.

### Site Variables

Make sure your site defines these variables, or rename them in `ComponentName.css` to match your site's variable names:

| Site Variable | What It Controls | Fallback |
|---------------|-----------------|----------|
| `--background-primary` | Component background | `#ffffff` |
| ... | ... | ... |

**To find your site's variable names:** In the Webflow Designer, open the Variables panel, click the three-dot menu on any variable, and select "Copy CSS". Then update `ComponentName.css` to match.

### Inherited Properties

These CSS properties pass through Shadow DOM automatically — the component picks them up from its parent:

- `font-family` — uses your site's typeface
- `color` — uses your site's text color
- `line-height` — uses your site's line height

### Tag Selectors

This component has `applyTagSelectors: true`, so any tag-level styles you've defined in your site (like `button` styling) will apply inside the component.

## Extending in Code

Brief examples of common customizations (mode changes, disabling options, locale, cross-component communication patterns).

## Dependencies

- [library-name](url) — what it does
```

---

## Shadow DOM Rules

### What Works
- CSS imported in `.webflow.tsx` — bundled into Shadow DOM
- CSS custom properties (`var(--name, fallback)`) — pass through Shadow DOM boundary
- CSS inheritance (`inherit`) — `font-family`, `color`, `line-height`, etc.
- Tag selectors with `applyTagSelectors: true` — site-level h1/p/button styles apply

### What Does NOT Work
- Site classes (`.w-button`, custom classes) — invisible inside Shadow DOM
- `document.head` style injection — doesn't reach Shadow DOM
- React Context between components — each is an isolated React root
- Global CSS without explicit import — won't be bundled

### Cross-Component Communication
Since each component is an isolated React root, use:
- `window.dispatchEvent(new CustomEvent(...))` + `window.addEventListener(...)` — real-time events
- `URLSearchParams` — page-level state
- `localStorage` / `sessionStorage` — persistent state

---

## Proven Reference: Calendar Component

The Calendar component is the validated proof-of-concept. It successfully imported into Webflow. Study its patterns:

- **React component**: `calendar/src/components/Calendar/Calendar.tsx`
- **CSS**: `calendar/src/components/Calendar/Calendar.css`
- **Webflow declaration**: `calendar/src/components/Calendar/Calendar.webflow.tsx`
- **README**: `calendar/README.md`

Key patterns demonstrated:
- `wf-calendar-` class prefix for all CSS classes
- `--wf-calendar-cell-size` internal CSS variable set from JS via inline style
- Size mapping object (`compact: "28px"`, `default: "36px"`, `large: "44px"`)
- `getDefaultClassNames()` from react-day-picker merged with custom classes
- Slot props for header/footer
- Site variable references with fallbacks in every color/border/radius rule

---

## Generation Checklist

Before a generated component is complete:

- [ ] All scaffold files present (package.json, webflow.json, vite.config.ts, tsconfigs, index.html)
- [ ] Pure React `.tsx` component with TypeScript interface
- [ ] CSS file with site variable comment block, `inherit` for typography, `var()` for all tokens
- [ ] `.webflow.tsx` declaration with CSS import, props with groups/tooltips, `ssr: false` if needed
- [ ] `main.tsx` dev entry with demo variations
- [ ] `README.md` following the template (Designer Properties, Site Variables table, Inherited Properties, Extending in Code)
- [ ] Class names prefixed with `wf-componentname-`
- [ ] No Tailwind, no CSS-in-JS, no design system imports
- [ ] All colors/borders/radii use `var(--site-variable, fallback)`
- [ ] Props grouped into Settings/Style/Display/Content/Behavior
- [ ] `applyTagSelectors: true` set if component has semantic HTML elements
- [ ] Component-specific npm dependencies added to `dependencies` in package.json
