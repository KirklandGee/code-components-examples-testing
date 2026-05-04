# QA Lessons — Bug Patterns We Found

This is the bug-pattern checklist for QA'ing a freshly-generated Webflow code component. It's distilled from the cycle that produced the first eight components (HeroSection, TestimonialCarousel, WeatherWidget, FaqAccordion, ModalDialog, TooltipHoverCard, DynamicFormGenerator, JobBoard). Most of these have been folded into the generator's prompts and deterministic checks — but the LLM still gets them wrong sometimes, especially in `main.tsx` previews and edge-case components, so it's worth knowing the symptoms.

Use this as a checklist. If you're QA'ing a new component, walk through every section.

---

## 1. The "object as React child" family

**Symptom:** Component renders `[object Object]` somewhere — often where a Webflow-edited prop is supposed to appear. Sometimes it shows in the canvas but not in the Properties panel; sometimes the inverse.

**Cause:** Webflow's runtime hands the React component objects (or React elements) for some prop types, but the static `PropValues[PropType.X]` TypeScript type doesn't always match the runtime reality. Specifically:

| Webflow prop | What the type says | What runtime actually delivers |
|---|---|---|
| `props.Image` | `{ src: string; alt?: string }` | Same. Reliable. |
| `props.Link` | `{ href: string; target?: string }` | Same. Reliable. |
| `props.RichText` | `string` | A **React slot element**, *not* a string. Object with `$$typeof`, `type`, `key`, `ref`, `props`. |
| `props.TextNode` | `string` | Sometimes a slot React element. Render with `{value}` either way. |
| `props.Slot` | `ReactNode` | Always a React slot element, **always truthy** (even when the canvas slot is empty). |

### 1a. Image / Link prop typed as `string`

**What you'll see:** `<img src="[object Object]">` in the DOM, broken-image icon in the canvas. Or a link tag with `href="[object Object]"`.

**Fix:** In the React component, type as `PropValues[PropType.Image]` / `PropValues[PropType.Link]` (importing from `@webflow/data-types`). Read `image?.src` / `image?.alt` and `link?.href` / `link?.target`. Use optional chaining — these are undefined until the user fills them in.

The deterministic check `imageLinkPropsCorrect` catches the `string` typo, but if the LLM emits a literal `{ src: string; alt?: string }` object shape it slips through — `declareComponent`'s generic check then mistakes that prop for a `PropType.Slot` and the build errors with `Type 'PropType.Image' is not assignable to type 'PropType.Slot'`. Use `PropValues[PropType.X]` — they're structurally the same but compile cleanly.

### 1b. RichText prop typed as `string` and fed into `dangerouslySetInnerHTML`

**What you'll see:** Empty body where the RichText should render.

**Fix:** Type the prop as `React.ReactNode`. Render with `{value}` — never `dangerouslySetInnerHTML={{ __html: value }}`. The slot React element renders itself; the Webflow rich text editor projects its content into the slot via Shadow DOM.

The deterministic check `richTextHandledCorrectly` catches both the `string` typo and any `dangerouslySetInnerHTML` use on a Webflow-provided prop.

### 1c. RichText with no `defaultValue` in the .webflow.tsx

**What you'll see:** Component renders blank (or with `[object Object]`, depending on how the React side handles undefined-vs-empty).

**Cause:** React default parameter values only fire when the runtime value is `undefined`. Webflow always passes *something* — for an unset RichText, it passes an empty slot element. So your React-side `bodyContent = "fallback"` default is silently ignored.

**Fix:** Every `props.RichText({ … })` declaration in `.webflow.tsx` must include a `defaultValue: "..."` (one to three sentences of plain-text realistic copy). The deterministic check enforces this.

### 1d. `props.Slot` used for "fallback to RichText if empty"

**What you'll see:** A Slot prop wins a ternary even when the designer hasn't placed anything in it, because it's a truthy React element. The other branch (e.g. RichText body) never renders.

**Fix:** Don't use `props.Slot()` for optional fallback content. Use it only for genuine composition. For editable body copy, use `props.RichText()` with a `defaultValue`.

---

## 2. Overlay / popover / tooltip positioning

**Symptom:** A tooltip / popover / dropdown / hover card is "invisible" in the Webflow canvas — it shows up in the DOM but lands well off-screen or inside a clipped container.

**Cause:** Webflow renders code components in Shadow DOM nested inside the Designer's iframe canvas. `position: fixed` plus `getBoundingClientRect()` is brittle here — any transformed ancestor changes the containing block for fixed children, and the canvas iframe + Shadow DOM stack tends to put one in the way.

**Fix:**
- Wrapper element: `position: relative; display: inline-block;`
- Overlay element: `position: absolute;` with placement classes that use `top: calc(100% + gap)`, `bottom: calc(100% + gap)`, etc.
- Don't compute `top`/`left` from JS. CSS placement classes are enough. If you need auto-flip, measure once on open and swap the placement *class*, never drive coordinates from state.

**Do not** conditionally render the overlay (`{open && <overlay/>}`) if it has CSS animations. Mount it always, toggle visibility via `opacity` + `visibility` transitions on a class on the wrapper. The `{open && …}` pattern combined with mount-time animations got the TooltipHoverCard stuck after the first open/close cycle in our QA.

**Hover handlers go on the wrapper, not the trigger.** When the overlay is a sibling of the trigger inside the wrapper, moving the cursor from trigger to overlay fires the trigger's `mouseleave` and yanks the overlay away. Wrap them and put `onMouseEnter`/`onMouseLeave` on the wrapper. For hover cards specifically, add a 100–150ms hide grace period so the cursor can cross any visible gap.

---

## 3. CSS — the small ones that bite

### 3a. `vite/client` types missing from tsconfig

**Symptom:** `npm run build` errors with `Cannot find module './X.css' or its corresponding type declarations`.

**Cause:** Under `noUncheckedSideEffectImports`, TS requires module declarations for `*.css` side-effect imports. Vite ships them in its `vite/client` types, but those live in the `vite` package itself, not under `@types`, so they have to be named explicitly in `tsconfig.app.json`. The triple-slash reference in `src/vite-env.d.ts` is *not enough* on its own.

**Fix:** Add to `tsconfig.app.json`:
```json
"types": ["vite/client"]
```

The current scaffold ships with this since the workflow improvement landed.

### 3b. Library CSS not imported

**Symptom:** Component using Swiper / react-day-picker / react-select renders the right DOM but looks unstyled — no flex on the wrapper, missing arrows, slides stacked vertically, etc.

**Fix:** Import the library's CSS in `.webflow.tsx` (not the React component). For Swiper:
```tsx
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./MyComponent.css";
```

If TypeScript complains about `Cannot find module 'swiper/css'`, add an ambient declaration to `src/vite-env.d.ts`:
```ts
declare module "swiper/css";
declare module "swiper/css/*";
```

### 3c. Site-variable fallbacks missing

**Symptom:** Component looks ugly on a Webflow site that hasn't defined the same site variables we expect.

**Cause:** The CSS uses `var(--accent-color)` instead of `var(--accent-color, #1a1a1a)`. The deterministic check `siteVariableFallbacks` should catch this — but if it slips through, every `var()` reference to a non-`--wf-*` variable needs a fallback.

---

## 4. External library state mutations

**Symptom:** Library fires an internal event and crashes with a `TypeError: Cannot read properties of undefined (reading 'split')` (or similar).

**Cause:** Replacing a library's params object instead of merging into it. We hit this with Swiper:
```tsx
// WRONG — wipes Swiper's defaults
swiper.params.navigation = { prevEl: ..., nextEl: ... };

// RIGHT — preserves the defaults Swiper injected at mount
swiper.params.navigation = {
  ...swiper.params.navigation,
  prevEl: ...,
  nextEl: ...,
};
```

When Swiper later fires a `toEdge` / `lock` / `enable` event, internal handlers reach for `params.disabledClass.split(' ')` — and crash if the default `'swiper-button-disabled'` got nuked by the wholesale replacement.

**Fix:** Always spread when mutating library params.

---

## 5. React 19 type strictness

### 5a. Ref callbacks returning a value

**Symptom:** Build error: `Type '(el: HTMLDivElement | null) => HTMLDivElement | null' is not assignable to type 'Ref<HTMLDivElement>'`.

**Cause:** React 19 ref callbacks must return `void` (or a cleanup function). `ref={(el) => (refs.current[i] = el)}` returns `el`.

**Fix:** Block body.
```tsx
ref={(el) => {
  refs.current[i] = el;
}}
```

### 5b. `NodeJS.Timeout` types

**Symptom:** Build error: `Namespace 'global.NodeJS' has no exported member 'Timeout'`.

**Cause:** Browser-targeted projects don't pull in `@types/node`. `setTimeout` returns `number` in the browser DOM lib.

**Fix:** Use `ReturnType<typeof setTimeout>` (or `setInterval`):
```tsx
const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

---

## 6. Webflow-specific runtime quirks

### 6a. The "Webflow doesn't fall back to React defaults" rule

This is hidden in the RichText section above but applies generally: **Webflow always passes *something* for every declared prop**. Your React-side `prop = "default"` parameter only fires if Webflow explicitly passes `undefined`, which rarely happens. The `defaultValue` on the **declaration side** (`.webflow.tsx`) is what populates the prop in practice. Set it for every Text / TextNode / RichText / Number / Variant prop.

### 6b. Form props (DaisyUI specifically — for `multi-step-form`)

The DynamicFormGenerator inherits DaisyUI v5's CSS variable system. By default DaisyUI's `--color-error` is a washed-out pink (oklch(71% .194 13.428)) that ignores the site palette. To brand it, override in `globals.css` with a doubled-up selector to beat DaisyUI's specificity:

```css
:root:root,
[data-theme="light"][data-theme="light"] {
  --color-error: var(--error-color, #dc2626);
  --color-error-content: var(--error-text-color, #ffffff);
}
```

Without the doubled-up selector, DaisyUI's `:root, [data-theme=light]` rule wins because it's emitted later.

### 6c. WeatherWidget-style API key handling

Two things kept catching us:
1. **Whitespace in pasted API keys.** Always `apiKey.trim()` before using. A surprising number of "invalid key" reports turn out to be a stray space.
2. **Stale 401 responses caching.** Add `cache: "no-store"` to `fetch()` calls that depend on auth — otherwise the browser caches a 401 from before the key activated and replays it.
3. **OpenWeatherMap activation delay.** New keys take up to 2 hours to activate. Mention this in the error message so users wait instead of regenerating.

---

## 7. The QA cycle itself

How to actually test a generated component, in order:

1. **Local build first.** `cd <component> && npm install && npm run build`. Fix any TS errors before publishing — they're cheaper here than after a Webflow publish.
2. **Local preview.** `npm run dev` opens the theme-preview `main.tsx`. Useful for sanity-checking the visual but doesn't catch Webflow runtime bugs.
3. **Publish to the shared library.** `NODE_OPTIONS="--max-http-header-size=65536" ./node_modules/.bin/webflow library share`.
4. **Drop on the canvas.** Open the demo site in the Webflow Designer, drop the component, set every prop, every variant, every visibility toggle.
5. **Test responsively.** The canvas viewport selector is your friend. A lot of bugs only surface on mobile breakpoints.
6. **Test with empty props.** Set the visibility toggles off, blank out optional text. The component should still render gracefully.
7. **Test in the published site preview.** Webflow's "Publish to Webflow.io" deploys to a non-canvas environment that sometimes catches issues the canvas hides.
8. **Check the browser console.** A lot of these bugs throw silent warnings (or full errors) before they manifest visually. Open DevTools every time.

---

## 8. Things we suspect but haven't fully proven

- **The FAQ Accordion `[object Object]` issue.** We fixed the symptom (always-mounted overlay + grid animation + RichText defaults) but never identified the actual root cause. The simpler `max-height + ref` pattern works in TestimonialCarousel but fails in FaqAccordion. If anyone hits this in another component, the working answer is to copy the FaqAccordion pattern verbatim.

- **`applyTagSelectors: true`.** Recommended by the generator for any component using semantic HTML (button, h1-h6, p, a, nav). We haven't seen it cause issues, but it makes Webflow's tag-style overrides apply to the component, which can produce surprising results when a designer styles the global `h2` selector and it bleeds into our component. Worth investigating if a component looks "off" for unclear reasons.

- **Webflow CDN cache.** Sometimes a `webflow library share` republish doesn't show up immediately in the canvas. Hard refresh (Cmd+Shift+R on the Designer tab) usually fixes it. If not, wait ~2 minutes and try again.

---

## When in doubt, copy

If a new component is structurally similar to one that works, copy the working pattern. The four "known good" reference components for different patterns:

- **`hero-section/`** — straightforward content component with Image/Link props, variants, theming, and inline-style CSS variables. Good template for any "marketing card" component.
- **`testimonial-carousel/`** — component using an external library (Swiper) with imported CSS. Good template for any component wrapping a third-party React lib.
- **`weather-widget/`** — component with API integration, fetch, loading/error/success states, and configurable API key. Good template for any data-driven component.
- **`faq-accordion/`** — component with conditionally-visible sections and CSS animation. Good template for accordions, dropdowns, expandable cards.

Skim the `.tsx`, `.css`, and `.webflow.tsx` of the closest match before fighting through a generated component from scratch.
