# Webflow Code Components: Styling Guide for AI Agents

> Opinionated reference for generating properly-styled Webflow code components.
> Source: https://developers.webflow.com/code-components/styling-components

---

## Core Architecture: Shadow DOM Isolation

Every Webflow code component renders inside its own **Shadow DOM**. This is the single most important fact for styling:

- Component styles **do not leak out** to the page.
- Page styles **do not leak in** to the component.
- Each component runs as an **isolated React root** with its own dependencies, state, and context.
- React Context **cannot be shared** between components (each has a separate React root).

This means you must be intentional about every style that enters or exits a component.

---

## File Structure Convention

A Webflow code component library follows this structure:

```
my-component/
  webflow.json              # Library manifest (required)
  src/
    globals.ts              # Global styles + decorators (optional but recommended)
    globals.css             # Global CSS variables, resets (optional)
    components/
      Button/
        Button.tsx          # The actual React component
        Button.webflow.tsx  # The Webflow declaration wrapper
        Button.module.css   # Component-scoped CSS (optional)
```

### webflow.json (Minimal)

```json
{
  "library": {
    "name": "My Component Library",
    "id": "my-component-library",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "globals": "./src/globals.ts"
  }
}
```

Key fields:
- `components` - glob pattern to find `.webflow.tsx` files
- `globals` - path to global styles/decorators file (registers once, applies to all components)
- `bundleConfig` - path to custom webpack config (only needed for Sass, Less, Shadcn aliases, etc.)

### The .webflow.tsx Declaration File

This file is the bridge between your React component and Webflow. It always follows this pattern:

```tsx
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import { MyComponent } from "./MyComponent";
import "./styles.css"; // CSS imports go HERE, in the declaration file

export default declareComponent(MyComponent, {
  name: "My Component",
  description: "What this component does",
  group: "Category Name",
  options: {
    ssr: true,         // Default true. Set false for browser-API-dependent components
    applyTagSelectors: true,  // Opt-in to site tag selectors (h1, p, etc.)
  },
  props: {
    // ... prop definitions
  },
});
```

---

## The Four Ways Styles Enter Shadow DOM

### 1. Direct CSS Imports (Most Common)

Import CSS files directly in the `.webflow.tsx` declaration file. These styles are bundled into the component and injected into the Shadow DOM.

```tsx
// Button.webflow.tsx
import "./Button.module.css";      // Component-scoped
import "../../globals.css";        // Global design tokens
import "some-library/dist/style.css"; // Third-party CSS
```

This is the simplest and most reliable approach.

### 2. CSS Custom Properties (Site Variables)

Webflow site variables defined in the Designer pass through the Shadow DOM boundary as CSS custom properties. Reference them with `var()` and always provide a fallback:

```css
.button {
  background-color: var(--background-primary, #007bff);
  color: var(--text-primary, #ffffff);
  font-size: var(--font-size-base, 16px);
}
```

To get the exact variable name: in Webflow Designer, go to Variables panel, click the three-dot menu on a variable, and select "Copy CSS".

### 3. CSS Inheritance

Certain CSS properties naturally inherit through the Shadow DOM boundary. Use `inherit` for typography and color properties:

```css
.component-root {
  font-family: inherit;  /* Gets parent's font */
  color: inherit;        /* Gets parent's text color */
  direction: inherit;    /* Gets parent's text direction */
  line-height: inherit;
}
```

Properties that inherit through Shadow DOM: `font-family`, `font-size`, `font-weight`, `color`, `line-height`, `letter-spacing`, `text-align`, `direction`, `visibility`, `cursor`, and other [inherited CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Inheritance).

### 4. Tag Selectors (Opt-In)

When `applyTagSelectors: true` is set in the component options, CSS rules targeting HTML tags (h1, p, a, button, etc.) defined at the site level will apply inside the component:

```tsx
export default declareComponent(MyComponent, {
  name: "My Component",
  options: {
    applyTagSelectors: true,
  },
  // ...
});
```

Use this when your component renders semantic HTML and should respect the site's typography/element styles.

---

## What Does NOT Work in Shadow DOM

| Approach | Works? | Why |
|----------|--------|-----|
| Site classes (`.w-button`, custom classes) | **No** | Classes defined outside Shadow DOM are invisible inside it |
| `document.head` style injection | **No** | Styles in `<head>` don't reach Shadow DOM |
| Unmodified CSS-in-JS (Emotion, styled-components) | **No** | They inject into `<head>` by default; need decorators |
| Global CSS `@import` without explicit import | **No** | Must import CSS in the `.webflow.tsx` file or globals |

---

## Global Styles and Decorators

### The globals.ts Pattern

Create a single entry point for styles and decorators that apply to every component in the library:

```ts
// src/globals.ts
import "./globals.css";

// If using CSS-in-JS, export decorators:
// import { emotionShadowDomDecorator } from "@webflow/emotion-utils";
// export const decorators = [emotionShadowDomDecorator];
```

```css
/* src/globals.css */
:root {
  --primary-color: #007bff;
  --font-family: system-ui, sans-serif;
  --border-radius: 8px;
}

*, *::before, *::after {
  box-sizing: border-box;
}
```

Register in webflow.json:

```json
{
  "library": {
    "globals": "./src/globals.ts"
  }
}
```

### Component-Level Decorators

Apply decorators to a single component instead of globally:

```tsx
export default declareComponent(MyComponent, {
  name: "My Component",
  decorators: [myCustomDecorator],
  // ...
});
```

---

## CSS Framework Integration

### Tailwind CSS

1. Install: `npm install tailwindcss @tailwindcss/postcss postcss`
2. Configure PostCSS:
   ```js
   // postcss.config.mjs
   export default { plugins: { "@tailwindcss/postcss": {} } };
   ```
3. Create globals:
   ```css
   /* globals.css */
   @import "tailwindcss";
   ```
4. Register globals in `webflow.json`
5. Use utility classes directly in React components

### Emotion

1. Install: `npm install @webflow/emotion-utils @emotion/cache @emotion/react`
2. Export decorator:
   ```ts
   // globals.ts
   import { emotionShadowDomDecorator } from "@webflow/emotion-utils";
   export const decorators = [emotionShadowDomDecorator];
   ```

### styled-components

1. Install: `npm install @webflow/styled-components-utils styled-components`
2. Export decorator:
   ```ts
   // globals.ts
   import { styledComponentsShadowDomDecorator } from "@webflow/styled-components-utils";
   export const decorators = [styledComponentsShadowDomDecorator];
   ```

### Shadcn/UI (Tailwind-based)

Requires a webpack alias for the `@` path convention:

```js
// webpack.webflow.js
const path = require("path");
module.exports = {
  resolve: { alias: { "@": path.resolve(__dirname) } },
};
```

Register in webflow.json:
```json
{ "library": { "bundleConfig": "./webpack.webflow.js" } }
```

### Sass / Less

Install the respective loader and create a webpack config:

```js
// webpack.webflow.js (Sass example)
module.exports = {
  module: {
    rules: [{ test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] }],
  },
};
```

---

## Props: Styling-Related Patterns

### Available Prop Types

| Type | Import | Returns | Best For |
|------|--------|---------|----------|
| `props.Text()` | `@webflow/data-types` | `string` | Labels, titles, custom class names |
| `props.RichText()` | `@webflow/data-types` | HTML `string` | Formatted content |
| `props.TextNode()` | `@webflow/data-types` | `string` | Canvas-editable text |
| `props.Number()` | `@webflow/data-types` | `number` | Sizes, counts, speeds |
| `props.Boolean()` | `@webflow/data-types` | `boolean` | Toggles, visibility |
| `props.Variant()` | `@webflow/data-types` | `string` | Style variants, enums |
| `props.Visibility()` | `@webflow/data-types` | `boolean` | Show/hide controls |
| `props.Slot()` | `@webflow/data-types` | React children | Nested content areas |
| `props.Link()` | `@webflow/data-types` | `{ href, target?, preload? }` | Navigation links |
| `props.Image()` | `@webflow/data-types` | Image object | Images/assets |
| `props.ID()` | `@webflow/data-types` | `string` | HTML element IDs |

### Prop Configuration Options

Every prop accepts:
- `name` (required) - Display name in the Designer panel
- `defaultValue` - Initial value
- `group` - Organizes props into collapsible sections in the panel
- `tooltip` - Hover description in the Designer

`props.Number()` also accepts `min` and `max`.
`props.Variant()` also accepts `options` (string array of choices).

### Naming Convention for Props

Use descriptive, Title Case names for the `name` field (this is what designers see):

```tsx
props: {
  variant: props.Variant({
    name: "Variant",              // Title Case display name
    options: ["default", "outline", "ghost"],
    defaultValue: "default",
  }),
  showTitle: props.Boolean({
    name: "Show Title",           // Title Case, readable
    group: "Visibility",
    defaultValue: true,
  }),
  slidesToShow: props.Number({
    name: "Slides to Show",       // Descriptive
    group: "Behavior",
    min: 1,
    max: 10,
    defaultValue: 3,
  }),
}
```

### Organizing Props with Groups

Use the `group` field to organize props into logical sections in the Designer panel:

```tsx
props: {
  title: props.Text({ name: "Title", group: "Content" }),
  description: props.RichText({ name: "Description", group: "Content" }),
  variant: props.Variant({ name: "Variant", group: "Style" }),
  size: props.Variant({ name: "Size", group: "Style" }),
  showArrows: props.Boolean({ name: "Show Arrows", group: "Behavior" }),
  autoplay: props.Boolean({ name: "Autoplay", group: "Behavior" }),
}
```

Common group names: `Content`, `Style`, `Behavior`, `Visibility`, `Layout`, `Advanced`.

---

## useWebflowContext Hook

Access the rendering environment to adapt styling/behavior:

```tsx
import { useWebflowContext } from "@webflow/react";

function MyComponent() {
  const { mode, interactive, locale } = useWebflowContext();

  // mode: "design" | "build" | "edit" | "preview" |
  //        "component-preview" | "comment" | "analyze" | "publish"
  // interactive: boolean - whether user interaction is possible
  // locale: string | null - ISO locale string

  return (
    <div>
      {!interactive && <div className="placeholder">Click preview to interact</div>}
      {interactive && <InteractiveContent />}
    </div>
  );
}
```

Use this to show placeholder states in the Designer, disable animations during design mode, or localize content.

---

## SSR Considerations

SSR is **enabled by default**. Disable it when the component uses:
- Browser APIs (`window`, `document`, `localStorage`)
- User-specific or authenticated content
- Heavy interactive elements (charts, 3D, maps)
- Non-deterministic output

```tsx
export default declareComponent(MyComponent, {
  name: "My Component",
  options: { ssr: false },
  // ...
});
```

---

## Best Practices (Opinionated)

### DO

1. **Always provide CSS variable fallbacks**: `var(--brand-color, #007bff)` -- never assume a variable exists.
2. **Use `inherit` for typography**: `font-family: inherit; color: inherit;` lets components adapt to their context.
3. **Import CSS in the .webflow.tsx file**, not in the React component itself. This ensures styles are properly bundled into Shadow DOM.
4. **Use CSS Modules for component-scoped styles** to avoid class name collisions between components in the same library.
5. **Group props logically** using the `group` field so designers can find settings quickly.
6. **Set sensible defaultValues** for every prop so the component looks good on first drop into the canvas.
7. **Use `props.Variant()`** for any prop with a fixed set of options (sizes, colors, modes) -- gives designers a dropdown instead of free text.
8. **Use `applyTagSelectors: true`** when your component renders semantic HTML elements.
9. **Expose a `className` prop** (as `props.Text()`) if designers need to add custom classes for minor overrides.
10. **Use the globals.ts pattern** for shared design tokens and decorators rather than importing globals in every component file.

### DO NOT

1. **Do not rely on site classes** -- they are invisible inside Shadow DOM. Use component-scoped classes.
2. **Do not use `document.head`** for style injection -- it won't reach Shadow DOM. Use decorators for CSS-in-JS.
3. **Do not share state via React Context** between components -- each is an isolated React root. Use URL params, localStorage, custom events, or Nano Stores.
4. **Do not embed API keys or secrets** -- all code runs in the browser.
5. **Do not use React Server Components** -- they are not supported.
6. **Do not use `.env` files** -- environment variables are not supported.
7. **Do not use React fragments as root** -- components must return a single root element.
8. **Do not exceed 50MB bundle size** -- tree-shake aggressively and remove unused dependencies.
9. **Do not use libraries that modify `window` or `document` directly** -- they may conflict with Webflow's runtime.
10. **Do not forget to set `ssr: false`** for components using browser APIs -- the SSR pass will fail silently or error.

---

## Quick Reference: Minimal Component Template

```tsx
// MyComponent.webflow.tsx
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import { MyComponent } from "./MyComponent";
import "./MyComponent.module.css";

export default declareComponent(MyComponent, {
  name: "My Component",
  description: "Brief description of what this does",
  group: "Category",
  options: {
    applyTagSelectors: true,
  },
  props: {
    variant: props.Variant({
      name: "Variant",
      options: ["default", "secondary"],
      defaultValue: "default",
    }),
    children: props.Slot({
      name: "Content",
    }),
  },
});
```

```css
/* MyComponent.module.css */
.root {
  font-family: inherit;
  color: inherit;
  background-color: var(--background-primary, #ffffff);
  border-radius: var(--border-radius, 8px);
  padding: 1rem;
}
```

---

## Package Versions (as of December 2025)

- `@webflow/webflow-cli` >= 1.9.0
- `@webflow/react` >= 1.1.0
- `@webflow/data-types` >= 1.1.0
- `@webflow/emotion-utils` >= 1.1.0 (if using Emotion)
- `@webflow/styled-components-utils` >= 1.1.0 (if using styled-components)

---

## Cross-Component Communication (When Needed)

Since components are isolated React roots, use one of these patterns when components need to coordinate:

1. **URL parameters** - `URLSearchParams` for page-level state
2. **Browser storage** - `localStorage` / `sessionStorage` for persistent state
3. **Custom events** - `window.dispatchEvent()` / `window.addEventListener()` for real-time communication
4. **Nano Stores** - Lightweight external state library for reactive state sharing
