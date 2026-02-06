# Webflow Code Components -- QBR Strategy Summary

**Date:** Q1 2026 QBR
**Participants:** Liz Kushnereit (GrowthX SEO), Colin Lateano (Webflow), Jason Gong (GrowthX), Kirkland Gee (GrowthX -- code components dev), Zach Plata (Webflow), Luke Stahl, Vic Plummer, Vivian (Webflow)

---

## 1. Strategic Direction

Code components are one of three lanes in the GrowthX-Webflow content strategy:

| Lane | Purpose | Funnel Stage |
|------|---------|--------------|
| **Programmatic SEO Content** | Capture search intent at scale | Top-of-funnel -- discovery |
| **Integration Pages** | Convert interest into engagement | Mid-funnel -- evaluation |
| **Code Components** | Activate users by giving them building blocks | Bottom-of-funnel -- activation/building |

The three lanes form a connected funnel: programmatic SEO captures developer and designer intent through search, drives traffic to integration pages for deeper engagement, and then code components provide the hands-on activation moment where users start building with Webflow.

Code components are the "do" step -- they turn passive readers into active builders. This makes them critical for demonstrating Webflow's extensibility and for converting interest into real product usage.

---

## 2. Priority Components

### Phase 1: Simple Primitives (Start Here)

The initial batch targets ~100 code components. Development starts with simple UI primitives that have high reuse value and low complexity:

- **Buttons** -- variants, sizes, states (already started in shadcn-components)
- **Sliders / Carousels** -- CMS-integrated and standalone (CMS Slider exists as reference)
- **Input fields** -- text, number, select, textarea (Input started)
- **Badges** -- status indicators and labels (started)
- **Alerts** -- notification and messaging patterns (started)
- **Cards** -- content containers (started)
- **Avatars** -- profile images with fallbacks (started)

### Phase 2: Composite Components

Once primitives are stable and well-tested:

- **Forms** -- multi-step, validated (multi-step-form exists as reference)
- **Navigation** -- menus, tabs, breadcrumbs
- **Data display** -- tables, lists, accordions
- **Modals / Dialogs** -- overlay patterns
- **Tooltips / Popovers** -- contextual information

### Phase 3: Complex / Data-Driven Components

Advanced components requiring backend integration or complex state:

- **Store locators** -- map integrations (store-locator exists as reference)
- **Pricing calculators** -- form logic with computation (pricing-quote-calculator exists)
- **Search** -- filtered, faceted
- **CMS-driven components** -- dynamic content from Webflow CMS

**Key guidance from Colin Lateano (Webflow):** Webflow will provide a clear list of priority missing components. Development should align with this list once received.

---

## 3. Client Requirements

### Quality Expectations

- Components must work reliably across multiple Webflow sites and templates
- Clean, production-ready code -- not experimental or unstable
- Components should follow established patterns from the Webflow code components documentation
- Props must be properly typed and exposed for visual configuration in the Webflow Designer

### Documentation Needs

- **README per component** -- every component must have its own README documenting:
  - What the component does
  - Available props and their types/defaults
  - Styling customization options (CSS variables, Tailwind classes, etc.)
  - Usage instructions for Webflow import
  - Any dependencies or prerequisites
- Documentation should cover both developer setup and designer usage in Webflow

### Testing Approach

- Deploy components across **multiple Webflow test sites** with varied templates
- Test styling flexibility -- ensure components adapt to different site themes
- Use **free Webflow templates** as test beds to validate visual compatibility
- Validate that props work correctly when configured through the Webflow Designer settings panel

---

## 4. Development Process

### Repository Workflow

1. **Work in a forked repo** for initial development to avoid public instability
2. Iterate and test in the fork until components are stable
3. Prepare stable versions for merging into the main repo
4. Only merge to main when components meet quality bar

### Component Architecture Pattern

Based on existing repo patterns, each component follows a three-file structure:

```
components/ui/ComponentName/
  component.tsx          # Core React component (shadcn/ui base)
  component.webflow.tsx  # Webflow wrapper with declareComponent + props
  component.stories.tsx  # Storybook stories for development/testing
```

The `.webflow.tsx` file uses `@webflow/react` `declareComponent` and `@webflow/data-types` `props` to expose the component to the Webflow Designer.

### Styling Strategy

- Use **Tailwind CSS** as the primary styling mechanism
- Expose **CSS variables** and **props** for designer-configurable styling
- Test flexible styling by deploying on varied templates
- Zach Plata (Webflow) will advise on best practices for flexible use of props and variable styles

### Collaboration

| Person | Role |
|--------|------|
| **Kirkland Gee** | Lead development of code components, starting with simple primitives |
| **Colin Lateano** | Provide priority list of missing components |
| **Zach Plata** | Guidance on code component repos, development best practices, props/variable styles |

---

## 5. Success Metrics

Code component success is measured on three dimensions:

1. **Engagement** -- Are developers and designers actively using the components? Track installs, imports, and active usage across Webflow sites.
2. **Reuse and Reference** -- Are components being referenced and reused across different workflows and projects? High reuse indicates the components solve real needs.
3. **Qualitative Feedback** -- Positive feedback from developers and the Webflow team on component quality, ease of use, and flexibility.

The initial goal is a test batch of ~100 components. The results of this batch will determine whether to scale up, adjust the approach, or shift priorities.

---

## 6. Key Constraints

- **Stability first:** Do not push unstable or experimental components to the public main repo. Use a fork for development.
- **Template compatibility:** Components must work across varied Webflow templates, not just one specific site design. Test broadly.
- **Webflow platform constraints:** Follow Webflow's code component architecture, prop types, and styling conventions exactly. Deviations will cause integration failures.
- **Documentation is mandatory:** Every component must ship with a README. Undocumented components are incomplete.
- **Coordinate with Webflow:** Wait for Colin's priority list before building large batches. Build what Webflow needs, not what seems interesting.
- **Scope creep:** Start with simple primitives. Resist the urge to build complex components before the fundamentals are solid and tested.

---

## 7. Recommendations for the Code Component Generator

> **UPDATED**: Original recommendations referenced shadcn/Tailwind. After building the Calendar proof-of-concept, the approach has pivoted to **unopinionated, design-system-free components** using plain CSS with site variables. See `docs/generator-reference.md` for the authoritative generator spec.

### Approach (Revised)

1. **Unopinionated styling** -- Components should NOT copy any design system (shadcn, Material, etc.). They use plain CSS with `var(--site-variable, fallback)` to adapt to any Webflow site's existing design tokens.

2. **Self-contained Vite projects** -- Each component is its own folder with package.json, webflow.json, and a standard scaffold. See `docs/generator-reference.md` for the exact template.

3. **Three-file component pattern** -- Every generated component produces:
   - `ComponentName.tsx` -- pure React component with TypeScript interface
   - `ComponentName.css` -- structural CSS with site variable references and fallbacks
   - `ComponentName.webflow.tsx` -- Webflow declaration with CSS import, grouped props, tooltips
   - Plus: `main.tsx` for local dev, `README.md` with site variables table

4. **Prioritize prop flexibility** -- Components should expose meaningful props (variants, sizes, visibility toggles, Slots for composability) so users can configure them visually in the Webflow Designer.

### Quality Gates for Generated Components

- Props must have sensible default values
- Component names and descriptions must be clear and descriptive
- CSS must use `var(--site-variable, fallback)` for all colors/borders/radii
- CSS must use `inherit` for typography (font-family, color, line-height)
- README must include a Site Variables table telling users to rename if their site uses different names
- Every component must be testable locally via `npm run dev`

### Scaling Strategy

- Start with simple UI primitives (buttons, inputs, badges, cards, accordions, tabs)
- Once primitives are proven, generate composite components
- Use the programmatic SEO content strategy to identify which component types developers search for most

### What NOT to Generate (Yet)

- Components requiring backend integration (store locators, auth flows)
- Components requiring CMS data binding (these need manual integration work)
- Components with complex animation or Canvas API usage
- Components that depend on third-party API keys or services
