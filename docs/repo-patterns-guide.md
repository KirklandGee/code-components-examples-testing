# Webflow Code Components - Repository Patterns Guide

This document is a comprehensive reference for how components in this repository are structured, built, and integrated with Webflow. Use it as a guide when creating new components.

---

## 1. Project Structure

The repository is a **monorepo of self-contained example projects**. Each top-level folder is an independent project with its own `package.json`, build tooling, and `webflow.json`.

```
code-components-examples-testing/
├── README.md                      # Root overview of all examples
├── .gitignore
├── LICENSE
├── .cursor/rules/                 # Cursor AI rules for the project
├── cms-slider/                    # Vite + React project
├── pricing-quote-calculator/      # Vite + React project
├── multi-step-form/               # Astro + React + Cloudflare project
├── store-locator/                 # Astro + React + Cloudflare project
├── shadcn-components/             # Next.js + React project
└── docs/                          # Documentation
```

### Per-project structure patterns

**Vite-based projects** (cms-slider, pricing-quote-calculator):
```
project/
├── package.json
├── webflow.json                   # Webflow library config
├── vite.config.ts                 # Build config
├── index.html                     # Dev entry point
├── src/
│   ├── main.tsx                   # Local dev entry
│   ├── App.tsx                    # Local dev wrapper
│   ├── components/
│   │   └── ComponentName/
│   │       ├── Component.tsx          # The React component
│   │       └── Component.webflow.tsx  # Webflow declaration file
│   └── hooks/                     # Shared hooks (optional)
└── README.md
```

**Astro-based projects** (multi-step-form, store-locator):
```
project/
├── package.json
├── webflow.json
├── astro.config.mjs
├── webpack.webflow.cjs            # Custom webpack config for Webflow bundler
├── wrangler.json(c)               # Cloudflare Workers config
├── src/
│   ├── components/
│   │   └── ComponentName/
│   │       ├── Component.tsx
│   │       ├── Component.webflow.tsx
│   │       └── styles.css         # Component-specific styles
│   ├── pages/                     # Astro pages
│   ├── layouts/
│   └── lib/                       # Shared utilities
└── README.md
```

**Next.js-based projects** (shadcn-components):
```
project/
├── package.json
├── webflow.json
├── webpack.webflow.js             # Custom webpack config
├── components.json                # shadcn/ui config
├── components/
│   └── ui/
│       └── ComponentName/
│           ├── component.tsx          # Base React component
│           ├── component.webflow.tsx  # Webflow declaration
│           └── component.stories.tsx  # Storybook stories (optional)
├── app/
│   └── globals.css                # Global styles with CSS variables
├── lib/
│   └── utils.ts                   # Utility functions (cn helper)
└── README.md
```

---

## 2. Component Anatomy

Every Webflow-compatible component consists of **two files**:

### File 1: The React Component (`Component.tsx`)

A standard React component. It:
- Defines a TypeScript interface for its props
- Uses default parameter values for optional props
- Has no awareness of Webflow (pure React)
- Can use any React patterns (hooks, state, effects, refs)

### File 2: The Webflow Declaration (`Component.webflow.tsx`)

This is the **manifest file** that bridges React and Webflow. It:
- Imports the React component
- Imports `declareComponent` from `@webflow/react`
- Imports `props` from `@webflow/data-types`
- Imports CSS/styles needed for the component
- Calls `declareComponent()` with the component and its configuration
- Is the **default export** of the file

---

## 3. The `declareComponent` Pattern

This is the core pattern used by every component in the repo. Here is the full structure:

```tsx
import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import MyComponent from "./MyComponent";
import "./styles.css"; // Import styles here, not in the component

export default declareComponent(MyComponent, {
  // REQUIRED: Component name shown in Webflow designer
  name: "My Component",

  // OPTIONAL: Description shown in Webflow designer
  description: "A description of what this component does",

  // OPTIONAL: Group for organizing in the Webflow component picker
  group: "Interactive",

  // OPTIONAL: Component-level options
  options: {
    ssr: false,                // Disable server-side rendering (for client-only features)
    applyTagSelectors: false,  // Disable Webflow tag selectors
  },

  // REQUIRED: Prop definitions mapped to the React component's props
  props: {
    // Each key matches a prop name on the React component
    propName: props.PropType({
      name: "Display Name",        // Label in Webflow designer
      defaultValue: "default",     // Default value
      group: "Group Name",         // Optional group for organizing props
      tooltip: "Help text",        // Optional tooltip
    }),
  },
});
```

---

## 4. Webflow Prop Types Reference

Based on the patterns observed across all components:

### `props.Text()`
For string values. Maps to a text input in Webflow.
```tsx
title: props.Text({
  name: "Title",
  defaultValue: "Default Title",
})
```

### `props.Number()`
For numeric values. Supports `min` and `max`.
```tsx
slidesToShow: props.Number({
  name: "Slides to Show",
  defaultValue: 1,
  min: 1,
  max: 10,
})
```

### `props.Boolean()`
For true/false toggles.
```tsx
autoplay: props.Boolean({
  name: "Autoplay",
  defaultValue: true,
})
```

### `props.Variant()`
For enum/select values. Provides a dropdown in Webflow designer.
```tsx
variant: props.Variant({
  name: "Variant",
  options: ["default", "destructive", "outline"],
  defaultValue: "default",
})
```

### `props.Visibility()`
For boolean show/hide controls. Displayed as a visibility toggle.
```tsx
showHeader: props.Visibility({
  name: "Show Header",
  defaultValue: true,
})
```

### `props.Slot()`
For accepting child elements from the Webflow canvas. Maps to React's `children` or named ReactNode props.
```tsx
children: props.Slot({
  name: "Content",
  tooltip: "Drag elements here",
})
```

### `props.RichText()`
For rich text content editable in Webflow.
```tsx
content: props.RichText({
  name: "Content",
  defaultValue: "Card content goes here.",
})
```

### `props.Image()`
For image assets. Returns a `{ src: string, alt?: string }` object.
```tsx
image: props.Image({
  name: "Image",
  tooltip: "The image to display",
})
```
**Important**: When using `props.Image()`, you need a wrapper component that maps Webflow's `PropValues[PropType.Image]` object to your React component's `src`/`alt` string props.

---

## 5. Prop Grouping

Props can be organized into groups using the `group` field. This creates collapsible sections in the Webflow designer:

```tsx
props: {
  title: props.Text({ name: "Title", group: "Header" }),
  description: props.Text({ name: "Description", group: "Header" }),
  showFooter: props.Visibility({ name: "Show Footer", group: "Visibility" }),
  slidesToShow: props.Number({ name: "Slides", group: "Behavior" }),
}
```

Common group names used in the repo: `"Content"`, `"Header"`, `"Footer"`, `"Visibility"`, `"Behavior"`, `"Form"`, `"Display"`, `"Layout"`, `"Interaction"`, `"Feedback"`.

---

## 6. Styling Approaches

The repo demonstrates three distinct styling strategies:

### A. Tailwind CSS with DaisyUI (pricing-quote-calculator, multi-step-form)

- Uses `@tailwindcss/vite` plugin or `@tailwindcss/postcss`
- DaisyUI as a Tailwind plugin for pre-built component classes
- CSS file: `@import "tailwindcss"; @plugin "daisyui";`
- Styles are imported in the `.webflow.tsx` file
- Inline styles used sparingly for dynamic values (e.g., `style={{ color: primaryColor }}`)

### B. Tailwind CSS with CSS Variables (shadcn-components)

- Uses shadcn/ui's CSS variable system in `globals.css`
- `:root` and `.dark` define design tokens as CSS custom properties
- `@theme inline` maps CSS variables to Tailwind utilities
- The `cn()` utility (`clsx` + `tailwind-merge`) combines classes
- Component uses `class-variance-authority` (cva) for variant-based styling
- Every `.webflow.tsx` file imports `"../../../app/globals.css"` for consistent theming

### C. Plain CSS with Custom Properties (store-locator)

- Dedicated `styles.css` file per component directory
- CSS custom properties in `:root` for theming
- Standard class-based CSS selectors
- Imported in the `.webflow.tsx` file: `import "../StoreLocator/styles.css"`

### Key Rule: Import styles in `.webflow.tsx`, not in the component

All examples consistently import CSS in the Webflow declaration file, ensuring styles are bundled with the component when shared via Webflow libraries.

---

## 7. Shadow DOM Considerations

Webflow Code Components render inside a **Shadow DOM**. This means:

1. **Global styles don't automatically reach the component** - You must explicitly import styles in the `.webflow.tsx` file
2. **Style injection may be needed** - The cms-slider project includes a `useShadowGlobalStyles` hook that copies global `<style>` and `<link>` elements into the shadow root
3. **Slot-based content** - Use `<slot>` elements to project Webflow canvas content into the component
4. **CSS library imports** - Third-party CSS (e.g., `slick-carousel/slick/slick.css`) must be imported in the `.webflow.tsx` file

### The `useShadowGlobalStyles` hook pattern:
```tsx
// Detects if element is in shadow DOM, copies global styles into it
export function useShadowGlobalStyles(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const rootNode = ref.current?.getRootNode?.();
    if (rootNode instanceof ShadowRoot) {
      // Clone all <style> and <link rel="stylesheet"> from document into shadow root
      copyGlobalStylesToShadow(rootNode);
    }
  }, [ref]);
}
```

---

## 8. Webflow CMS Integration Pattern

The cms-slider demonstrates how to extract CMS collection items from Webflow slots:

1. Accept a `Slot` prop for the CMS collection list
2. Use a hidden container to render the slot content
3. Query the slot's assigned elements for `.w-dyn-item[role='listitem']` elements
4. Clone the DOM elements and render them in your component

```tsx
// In the React component
const { cmsCollectionComponentSlotRef, items } = useCMSCollectionItems("slotName");

// Hidden container for CMS slot
<div ref={cmsCollectionComponentSlotRef} style={{ display: "none" }}>
  {cmsCollectionComponentSlot}
</div>

// Render extracted items
{items.map((item, index) => (
  <SlideItem key={index} item={item} index={index} />
))}
```

---

## 9. Wrapper Component Pattern

When Webflow's prop types don't directly match React component props, create a **wrapper component** in the `.webflow.tsx` file:

```tsx
// Example: Alert wraps multiple sub-components
interface WebflowAlertProps {
  variant?: "default" | "destructive";
  title?: string;
  description?: string;
}

const WebflowAlert: React.FC<WebflowAlertProps> = ({ variant, title, description }) => {
  return (
    <Alert variant={variant}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};

export default declareComponent(WebflowAlert, { ... });
```

This is used when:
- The Webflow prop type returns a different shape than the React prop expects (e.g., `Image` type)
- You need to compose multiple sub-components into a single Webflow component
- You want to flatten nested props for a simpler Webflow editing experience

---

## 10. `webflow.json` Configuration

Every project has a `webflow.json` at its root. This tells the Webflow CLI where to find components:

### Minimal (Vite projects):
```json
{
  "library": {
    "name": "Library Display Name",
    "components": ["**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "description": "Description of the library",
    "id": "kebab-case-id"
  }
}
```

### With bundleConfig (Next.js/webpack customization):
```json
{
  "library": {
    "name": "ShadCN UI Components Examples",
    "components": ["./components/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "id": "shadcn-ui-components---examples",
    "bundleConfig": "./webpack.webflow.js"
  }
}
```

### With Cloud framework (Astro + Cloudflare):
```json
{
  "cloud": {
    "framework": "astro"
  },
  "library": {
    "name": "Multi-Step Form",
    "id": "multi-step-form"
  }
}
```

**Note**: The `components` glob pattern defines which files are picked up as Webflow components. Only `.webflow.tsx` files matching the pattern are included.

---

## 11. Webpack Custom Config (`webpack.webflow.js` / `webpack.webflow.cjs`)

Some projects need custom webpack configuration for the Webflow bundler. Common uses:

### Path aliases (shadcn-components):
```js
const path = require("path");
module.exports = {
  mode: "development",
  resolve: {
    alias: {
      "@": path.resolve(process.cwd()),
    },
  },
};
```

### CSS module configuration (multi-step-form):
```js
module.exports = {
  mode: "development",
  module: {
    rules: (currentRules) => {
      // Modify CSS loader options
      return currentRules.map((rule) => {
        // Find and modify css-loader config
      });
    },
  },
};
```

### Minimal (store-locator):
```js
module.exports = {
  mode: "development",
};
```

---

## 12. Required Dependencies

Every project must have these as **devDependencies**:

```json
{
  "devDependencies": {
    "@webflow/data-types": "^1.0.1",
    "@webflow/react": "^1.0.1",
    "@webflow/webflow-cli": "^1.8.44"
  }
}
```

`@webflow/webflow-cli` **must** be a devDependency (not a regular dependency) before running `npx webflow library share`.

React and React DOM are always needed as dependencies or peerDependencies.

---

## 13. File Naming Conventions

- **Webflow component files**: Use camelCase or PascalCase without dashes. Example: `CMSSlider.webflow.tsx`, not `cms-slider.webflow.tsx`
- **Avoid reserved JS keywords** in Webflow component file names (e.g., don't create `switch.webflow.tsx`)
- **Component directories**: Use PascalCase (e.g., `CMSSlider/`, `StoreLocator/`, `Button/`)
- **Style files**: `styles.css` or `globals.css` or framework-specific (e.g., `style.css`)

---

## 14. Component Options

The `options` object in `declareComponent` supports:

```tsx
options: {
  ssr: false,                // Disable SSR - use for components with browser-only APIs
  applyTagSelectors: false,  // Disable Webflow's tag-level CSS selectors
}
```

Use `ssr: false` when:
- The component uses `window`, `document`, or browser-only APIs
- The component dynamically imports browser modules (e.g., Leaflet)
- The component uses refs that need the DOM to be present

---

## 15. Webflow Context API

Components can access Webflow context via the `useWebflowContext` hook:

```tsx
import { useWebflowContext } from "@webflow/react";

const { mode, locale, interactive } = useWebflowContext();
// mode: "design" | "preview" | "live"
// locale: current locale info
// interactive: boolean indicating if component is interactive
```

This is useful for:
- Showing different UI in design mode vs. live mode
- Preventing side effects during design mode

---

## 16. Publishing Workflow

1. Ensure `@webflow/webflow-cli` is installed as a devDependency
2. Run `npx webflow library share` to bundle and share the component library
3. Manually pull the updated library into Webflow (this is a human step)

---

## 17. Complete Template for a New Vite-based Component

### `new-component/package.json`
```json
{
  "name": "new-component",
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

### `new-component/webflow.json`
```json
{
  "library": {
    "name": "My New Component",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "description": "Description of the component",
    "id": "my-new-component"
  }
}
```

### `new-component/vite.config.ts`
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

### `new-component/src/components/MyComponent/MyComponent.tsx`
```tsx
import React from "react";

export interface MyComponentProps {
  title?: string;
  variant?: "default" | "secondary";
  showHeader?: boolean;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = "Default Title",
  variant = "default",
  showHeader = true,
  children,
}) => {
  return (
    <div className={`my-component my-component--${variant}`}>
      {showHeader && <h2>{title}</h2>}
      <div className="my-component__content">{children}</div>
    </div>
  );
};

export default MyComponent;
```

### `new-component/src/components/MyComponent/MyComponent.webflow.tsx`
```tsx
import MyComponent from "./MyComponent";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./styles.css"; // Import component styles here

export default declareComponent(MyComponent, {
  name: "My Component",
  description: "A description for the Webflow designer",
  group: "Interactive",
  props: {
    title: props.Text({
      name: "Title",
      defaultValue: "Default Title",
      group: "Content",
    }),
    variant: props.Variant({
      name: "Variant",
      options: ["default", "secondary"],
      defaultValue: "default",
      group: "Style",
    }),
    showHeader: props.Visibility({
      name: "Show Header",
      defaultValue: true,
      group: "Visibility",
    }),
    children: props.Slot({
      name: "Content",
      tooltip: "Drag content elements here",
      group: "Content",
    }),
  },
});
```

### `new-component/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Component</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `new-component/src/main.tsx`
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MyComponent from "./components/MyComponent/MyComponent";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MyComponent title="Demo Component" />
  </StrictMode>
);
```

---

## 18. Checklist: What Makes a Component "Complete"

- [ ] React component with TypeScript interface for all props
- [ ] `.webflow.tsx` declaration file using `declareComponent`
- [ ] All props mapped with appropriate Webflow prop types
- [ ] Props have `name`, sensible `defaultValue`, and optional `group`/`tooltip`
- [ ] Styles imported in the `.webflow.tsx` file (not the component)
- [ ] `webflow.json` with correct `library.name`, `library.id`, and `components` glob
- [ ] `@webflow/webflow-cli`, `@webflow/react`, and `@webflow/data-types` in devDependencies
- [ ] Local dev entry point (`main.tsx` + `index.html` or Astro pages) for testing
- [ ] `README.md` with features, getting started, and prop documentation
- [ ] No dashes in `.webflow.tsx` filenames
- [ ] No reserved JS keywords in `.webflow.tsx` filenames
- [ ] `ssr: false` option set if component uses browser-only APIs
