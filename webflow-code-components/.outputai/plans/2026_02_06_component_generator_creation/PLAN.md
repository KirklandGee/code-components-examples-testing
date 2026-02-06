# Workflow Requirements Document

> **Workflow:** `component_generator`
> **Created:** 2026-02-06
> **Updated:** 2026-02-06 (v2 — theme preview + evaluation loop)
> **Status:** Ready for implementation

---

## Overview

A workflow that generates complete, production-ready Webflow code component directories from a specification. Takes a component name, description, and props list as input and returns a map of file paths to file contents representing the full self-contained Vite project.

The generated output matches the exact patterns from the proven calendar component and the `generator-reference.md` spec: unopinionated CSS with site variable fallbacks, Shadow DOM-compatible class prefixes, typography inheritance, and proper Webflow declaration files.

**Key features:**
- **Theme preview**: Generated `main.tsx` includes a live theme switcher (light/dark/brand) so developers can see how the component adapts to different sites before importing to Webflow
- **Verification loop**: Two-tier evaluation (deterministic checks + LLM judge) with regeneration loop — component must score >= 90 before being returned

---

## Spec Scope

### In Scope
- Generate all 12 files for a complete Webflow code component directory
- Scaffold files via pure string templates (no LLM)
- React component, CSS, Webflow declaration, main.tsx, and README via LLM generation
- Theme preview in main.tsx (light/dark/brand themes + live CSS variable editor)
- Two-tier verification loop: deterministic checks + LLM judge scoring >= 90
- Regeneration with specific feedback when checks fail (max 3 iterations)
- Test scenarios for validation

### Out of Scope
- Writing files to disk (the workflow returns a files map; the caller writes them)
- Multi-component generation in a single run
- Component dependency resolution (e.g., shared sub-components)
- npm install or build steps

---

## Workflow Design

### Name: `component_generator`
### Description: Generate a complete Webflow code component directory from a specification

### Input Schema

```typescript
z.object({
  componentName: z.string()       // PascalCase, e.g. "PricingTable"
  description: z.string()         // Detailed component description
  props: z.array(PropSchema)      // Props to expose in Webflow Designer
  npmDependencies: z.record(z.string()).optional()  // Extra npm packages
  group: z.string().optional().default('Components') // Webflow component category
})

// Where PropSchema is:
z.object({
  name: z.string()           // camelCase prop name
  type: z.enum(['Id', 'Variant', 'Boolean', 'Visibility', 'Number', 'Text', 'RichText', 'Slot', 'Image', 'Link'])
  description: z.string()
  options: z.array(z.string()).optional()  // For Variant type
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional()
  group: z.enum(['Settings', 'Style', 'Display', 'Content', 'Behavior']).optional()
})
```

### Output Schema

```typescript
z.object({
  componentName: z.string(),
  kebabName: z.string(),
  files: z.record(z.string()),           // Map of relative file paths to file contents
  evaluation: z.object({
    score: z.number(),                    // Final LLM judge score (>= 90)
    iterations: z.number(),              // How many generate-evaluate cycles it took
    deterministicChecks: z.object({      // All must be true
      classPrefixCorrect: z.boolean(),
      typographyInherited: z.boolean(),
      siteVariableFallbacks: z.boolean(),
      noDesignSystemImports: z.boolean(),
      cssImportInWebflow: z.boolean(),
      interfaceExported: z.boolean(),
      defaultExportPresent: z.boolean(),
      declareComponentPresent: z.boolean(),
      propsGrouped: z.boolean(),
      ssrFlagCorrect: z.boolean(),
    }),
  }),
})
```

### Orchestration Flow

```
1. generateScaffold (pure templates)
2. LOOP (max 3 iterations):
   a. generateReactComponent (LLM)
   b. generateComponentCSS (LLM, depends on a)
   c. generateWebflowDeclaration (LLM, depends on a)
   d. runDeterministicChecks (no LLM, instant)
      → If any check fails: collect failures, continue to next iteration with feedback
   e. evaluateComponent (LLM judge)
      → If score < 90: collect feedback, continue to next iteration
      → If score >= 90 AND all deterministic checks pass: BREAK
3. generateMainTsx (LLM — theme preview, only needs to run once)
4. generateReadme (LLM, depends on CSS)
5. ASSEMBLE → RETURN
```

**Why main.tsx and README are outside the loop:** They don't affect the core component quality. The loop focuses on the three critical files (.tsx, .css, .webflow.tsx) that must meet strict quality requirements. Main.tsx and README are generated once after the loop completes with validated code.

### Workflow Code

```typescript
fn: async (input) => {
  const kebabName = toKebabCase(input.componentName);
  const group = input.group ?? 'Components';

  // Step 1: Scaffold (pure templates, outside loop)
  const scaffoldFiles = await generateScaffold({ ...input, kebabName });

  // Step 2: Generate + Verify Loop (max 3 iterations)
  let reactCode = '';
  let cssCode = '';
  let webflowCode = '';
  let deterministicResults = null;
  let llmScore = 0;
  let iterations = 0;
  let feedback = '';

  for (let i = 0; i < 3; i++) {
    iterations = i + 1;

    // Generate the three core files
    const reactResult = await generateReactComponent({
      ...input, kebabName, feedback
    });
    reactCode = reactResult.code;

    const cssResult = await generateComponentCSS({
      ...input, kebabName,
      reactComponentCode: reactCode, feedback
    });
    cssCode = cssResult.code;

    const webflowResult = await generateWebflowDeclaration({
      ...input, kebabName, group,
      reactComponentCode: reactCode, feedback
    });
    webflowCode = webflowResult.code;

    // Tier 1: Deterministic checks (instant, free)
    deterministicResults = await runDeterministicChecks({
      componentName: input.componentName,
      kebabName,
      reactComponentCode: reactCode,
      cssCode,
      webflowDeclarationCode: webflowCode,
    });

    // If deterministic checks fail, build feedback and continue loop
    if (!deterministicResults.allPassed) {
      feedback = buildDeterministicFeedback(deterministicResults);
      continue;
    }

    // Tier 2: LLM judge (only if deterministic checks pass)
    const evalResult = await evaluateComponent({
      componentName: input.componentName,
      kebabName,
      reactComponentCode: reactCode,
      cssCode,
      webflowDeclarationCode: webflowCode,
    });
    llmScore = evalResult.value;

    if (llmScore >= 90) {
      break; // Quality gate passed
    }

    // Build feedback from LLM evaluation for next iteration
    feedback = evalResult.reasoning;
  }

  // Step 3: Generate main.tsx with theme preview (outside loop)
  const mainResult = await generateMainTsx({ ...input, kebabName });

  // Step 4: Generate README (outside loop, depends on CSS)
  const readmeResult = await generateReadme({
    ...input, kebabName, cssCode
  });

  // Assemble files
  const componentDir = `src/components/${input.componentName}`;
  return {
    componentName: input.componentName,
    kebabName,
    files: {
      ...scaffoldFiles,
      'src/main.tsx': mainResult.code,
      [`${componentDir}/${input.componentName}.tsx`]: reactCode,
      [`${componentDir}/${input.componentName}.css`]: cssCode,
      [`${componentDir}/${input.componentName}.webflow.tsx`]: webflowCode,
      'README.md': readmeResult.code,
    },
    evaluation: {
      score: llmScore,
      iterations,
      deterministicChecks: deterministicResults.checks,
    },
  };
}
```

---

## Step Design

### Step 1: `generateScaffold` (No LLM)

**Purpose:** Generate boilerplate scaffold files from templates.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, description, npmDependencies? }` |
| Output | `Record<string, string>` — 7 files: package.json, webflow.json, vite.config.ts, 3x tsconfig, index.html |
| LLM | None — pure string template substitution |
| Retry | Not needed |

The scaffold templates are defined in `utils.ts` as the `buildScaffoldFiles()` function. These files are identical across all components except for the component name and dependencies.

### Step 2: `generateReactComponent` (LLM)

**Purpose:** Generate the pure React `.tsx` component — the creative core.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, description, props, npmDependencies?, feedback? }` |
| Output | `{ code: string }` — complete .tsx file contents |
| LLM | `generateText` with `generate_react_component@v1.prompt` |
| Retry | `maximumAttempts: 3` |

The `feedback` field is empty on the first iteration and contains specific fix instructions from the evaluation on subsequent iterations.

### Step 3: `generateComponentCSS` (LLM)

**Purpose:** Generate CSS with site variable references matching the React component's class names.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, description, props, reactComponentCode, feedback? }` |
| Output | `{ code: string }` — complete .css file contents |
| LLM | `generateText` with `generate_component_css@v1.prompt` |
| Retry | `maximumAttempts: 3` |
| Depends On | Step 2 (needs React component code to match classNames) |

### Step 4: `generateWebflowDeclaration` (LLM)

**Purpose:** Generate the `.webflow.tsx` declaration file.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, description, props, group, reactComponentCode, feedback? }` |
| Output | `{ code: string }` — complete .webflow.tsx file contents |
| LLM | `generateText` with `generate_webflow_declaration@v1.prompt` |
| Retry | `maximumAttempts: 3` |
| Depends On | Step 2 (needs React component to determine ssr/applyTagSelectors) |

### Step 5: `runDeterministicChecks` (No LLM)

**Purpose:** Binary pass/fail validation of generated code against hard requirements.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, reactComponentCode, cssCode, webflowDeclarationCode }` |
| Output | `{ allPassed: boolean, checks: Record<string, boolean>, failures: string[] }` |
| LLM | None — regex/string pattern matching |
| Retry | Not needed |

**Checks performed:**

| # | Check | Method | Pass Criteria |
|---|-------|--------|---------------|
| 1 | CSS class prefix | Regex scan for `className=` in .tsx | Every class starts with `wf-{prefix}-` or is exactly `wf-{prefix}` |
| 2 | Typography inherit | String search in .css | Root class contains `font-family: inherit` AND `color: inherit` AND `line-height: inherit` |
| 3 | Site variable fallbacks | Regex for `var(--` in .css | Every `var()` call has a fallback (second argument) |
| 4 | No design system imports | String search in all files | No `tailwind`, `@tailwind`, `shadcn`, `@mui`, `@chakra`, `@mantine` |
| 5 | CSS import location | String search | `.css` import exists in `.webflow.tsx` AND `.css` import does NOT exist in `.tsx` |
| 6 | Interface exported | Regex in .tsx | `export interface {Name}Props` present |
| 7 | Default export | Regex in .tsx | `export default function` present |
| 8 | declareComponent | String search in .webflow.tsx | `declareComponent` call present |
| 9 | Props grouped | Regex in .webflow.tsx | Every prop definition includes `group:` |
| 10 | SSR flag | Conditional check | If .tsx contains `useState` or `useEffect` or `window` or `document` → verify `ssr: false` in .webflow.tsx |

### Step 6: `evaluateComponent` (LLM Judge)

**Purpose:** Semantic quality evaluation. Only runs if all deterministic checks pass.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, reactComponentCode, cssCode, webflowDeclarationCode }` |
| Output | `EvaluationNumberResult` — score 0-100 with confidence + reasoning |
| LLM | `generateObject` with `evaluate_component@v1.prompt` |

Score must be >= 90 to pass the quality gate.

### Step 7: `generateMainTsx` (LLM — Theme Preview)

**Purpose:** Generate the local dev entry point with theme preview system.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, description, props }` |
| Output | `{ code: string }` — complete main.tsx file contents |
| LLM | `generateText` with `generate_main_tsx@v1.prompt` |
| Retry | `maximumAttempts: 3` |

**Theme preview design:**

The generated `main.tsx` renders the component in three theme contexts side by side, plus a live CSS variable editor. This is purely for local development — `npx webflow library share` only processes `.webflow.tsx` files and ignores `main.tsx` entirely.

```
┌──────────────────────────────────────────────────────────────┐
│  ComponentName Preview                                       │
│                                                              │
│  Theme: [Light] [Dark] [Brand] [Custom]                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  [Component rendered with selected theme variables]     │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─── Prop Variations ───────────────────────────────────┐   │
│  │ Variant A    │ Variant B    │ Variant C               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─── Site Variables ────────────────────────────────────┐   │
│  │ --background-primary  [#ffffff] [color picker]        │   │
│  │ --text-primary        [#1a1a1a] [color picker]        │   │
│  │ --accent-color        [#2563eb] [color picker]        │   │
│  │ --border-radius       [8px]     [slider]              │   │
│  │ ...                                                    │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Theme presets:**

```typescript
const themes = {
  light: {
    '--background-primary': '#ffffff',
    '--background-secondary': '#f5f5f5',
    '--text-primary': '#1a1a1a',
    '--text-secondary': '#737373',
    '--border-color': '#e5e5e5',
    '--accent-color': '#2563eb',
    '--accent-text-color': '#ffffff',
    '--border-radius': '8px',
  },
  dark: {
    '--background-primary': '#0a0a0a',
    '--background-secondary': '#1a1a1a',
    '--text-primary': '#fafafa',
    '--text-secondary': '#a3a3a3',
    '--border-color': '#2a2a2a',
    '--accent-color': '#3b82f6',
    '--accent-text-color': '#ffffff',
    '--border-radius': '8px',
  },
  brand: {
    '--background-primary': '#fef7f0',
    '--background-secondary': '#fde8d0',
    '--text-primary': '#1c1917',
    '--text-secondary': '#78716c',
    '--border-color': '#e7e5e4',
    '--accent-color': '#ea580c',
    '--accent-text-color': '#ffffff',
    '--border-radius': '12px',
  },
};
```

The "Custom" theme starts with the light preset and lets the developer edit each variable via color pickers and inputs. This gives them a real feel for how the component will behave on their specific site.

### Step 8: `generateReadme` (LLM)

**Purpose:** Generate README following the exact template structure.

| Field | Value |
|-------|-------|
| Input | `{ componentName, kebabName, description, props, cssCode, npmDependencies? }` |
| Output | `{ code: string }` — complete README.md markdown |
| LLM | `generateText` with `generate_readme@v1.prompt` |
| Retry | `maximumAttempts: 3` |
| Depends On | CSS code from the loop (needs CSS to extract site variable documentation) |

---

## Evaluator Design

### Two-Tier Verification System

#### Tier 1: Deterministic Checks (step: `runDeterministicChecks`)

These are implemented as a regular step (not an evaluator) since they're pure logic, not LLM-powered. They run inside the loop before the LLM judge.

See Step 5 above for the full check list. These are binary pass/fail — no ambiguity.

**When checks fail**, the step returns a `failures` array with human-readable messages like:
- `"CSS class 'pricing-card' in .tsx does not use the wf-pricingtable- prefix"`
- `"var(--accent-color) in .css line 42 is missing a fallback value"`
- `"CSS is imported in ComponentName.tsx — it should only be imported in .webflow.tsx"`

These messages are fed directly into the `feedback` variable for the next generation iteration.

#### Tier 2: LLM Judge (evaluator: `evaluateComponent`)

Only runs after all deterministic checks pass. Uses `generateObject` to return structured results.

**Evaluation rubric (embedded in the prompt):**

| Criterion | Weight | What the LLM checks |
|-----------|--------|---------------------|
| **Functionality completeness** | 25 | Does the component implement ALL behaviors from the description? List each and verify. |
| **Prop wiring** | 20 | Does every input prop actually affect the rendered output? Is each prop type-correct? |
| **CSS completeness** | 20 | Does every className in .tsx have CSS rules? Are hover/focus/active states present? |
| **Semantic HTML** | 15 | Are `<button>` (not `<div onClick>`), `<nav>`, `<h2>` etc. used correctly? |
| **Accessibility** | 10 | Keyboard navigable? ARIA labels on interactive elements? Focus styles? |
| **Code quality** | 10 | Clean structure? Reasonable naming? No unnecessary complexity? |

**Output schema:**

```typescript
z.object({
  score: z.number().min(0).max(100),
  reasoning: z.string(),  // Detailed explanation — used as feedback for regeneration
  criteria: z.object({
    functionalityCompleteness: z.object({ score: z.number(), notes: z.string() }),
    propWiring: z.object({ score: z.number(), notes: z.string() }),
    cssCompleteness: z.object({ score: z.number(), notes: z.string() }),
    semanticHtml: z.object({ score: z.number(), notes: z.string() }),
    accessibility: z.object({ score: z.number(), notes: z.string() }),
    codeQuality: z.object({ score: z.number(), notes: z.string() }),
  }),
})
```

**Quality gate:** Overall score must be >= 90. If < 90, the `reasoning` field is passed as `feedback` to the next generation iteration.

**Max 3 iterations.** If after 3 iterations the score is still < 90, the workflow returns the best result with the evaluation attached so the developer can see what needs manual attention.

---

## Prompt Design

7 prompt files (added `evaluate_component` with detailed rubric), all using `anthropic` provider with `claude-sonnet-4-20250514`:

| Prompt | Temperature | maxTokens | Purpose |
|--------|-------------|-----------|---------|
| `generate_react_component@v1.prompt` | 0.4 | 8000 | React component — includes feedback variable for loop |
| `generate_component_css@v1.prompt` | 0.3 | 6000 | CSS — includes feedback variable for loop |
| `generate_webflow_declaration@v1.prompt` | 0.2 | 4000 | Declaration — includes feedback variable for loop |
| `generate_main_tsx@v1.prompt` | 0.4 | 6000 | Theme preview with live editor (increased tokens) |
| `generate_readme@v1.prompt` | 0.3 | 4000 | Documentation |
| `evaluate_component@v1.prompt` | 0.1 | 3000 | LLM judge with weighted rubric (increased tokens for detailed reasoning) |

**Key design decisions:**
- Generator reference patterns embedded in each prompt's `<system>` section
- Calendar component included as concrete reference example
- All generation prompts include an optional `{% if feedback %}` block that injects specific fix instructions on re-generation iterations
- All prompts instruct LLM to output ONLY raw file contents — no markdown fences
- Evaluator prompt includes the full weighted rubric so scoring is consistent

**Feedback injection pattern (in generation prompts):**

```liquid
{% if feedback %}
IMPORTANT — Previous generation had issues. Fix these specifically:
{{ feedback }}

Do NOT repeat these mistakes. Address each issue listed above.
{% endif %}
```

---

## Testing Strategy

### Scenario 1: `pricing_table.json`

A responsive pricing table with layout variants, a highlight toggle, and slot props. Tests:
- Variant prop generation (horizontal/vertical layout)
- Boolean prop generation (highlightRecommended)
- Slot prop generation (header/footer)
- No npm dependencies beyond React
- Evaluation loop convergence

### Scenario 2: `testimonial_carousel.json` (recommended to add)

A testimonial carousel with external dependency. Tests:
- npm dependency handling (swiper or similar)
- Behavior props (autoplay, speed)
- Content-heavy component generation

### Validation Checklist

After running a scenario, verify:
- [ ] All 12 output files present in the `files` map
- [ ] `package.json` is valid JSON with correct dependencies
- [ ] `webflow.json` has correct library name and id
- [ ] React component exports default function and Props interface
- [ ] CSS has site variable comment block and typography inheritance
- [ ] `.webflow.tsx` imports CSS and has `declareComponent`
- [ ] `main.tsx` renders with theme switcher (light/dark/brand) and live variable editor
- [ ] README has all required sections
- [ ] All CSS classes use `wf-{prefix}-` naming
- [ ] All deterministic checks pass
- [ ] Evaluator score is >= 90
- [ ] `evaluation.iterations` shows how many cycles it took

### Running Tests

```bash
# After implementation, restart worker
docker restart webflow-code-components-worker-1 && sleep 5

# Run with scenario file
npx output workflow run component_generator --input src/workflows/component_generator/scenarios/pricing_table.json

# Run with inline input for a simple component
npx output workflow run component_generator --input '{"componentName":"ToggleSwitch","description":"A simple on/off toggle switch with smooth animation","props":[{"name":"id","type":"Id","description":"HTML ID","group":"Settings"},{"name":"size","type":"Variant","description":"Toggle size","options":["small","default","large"],"defaultValue":"default","group":"Style"}]}'
```

---

## Implementation Phases

### Phase 1: Skeleton + Types + Utils

```bash
npx output workflow generate --skeleton component_generator
```

Then create:
1. `types.ts` — All Zod schemas and TypeScript types (including evaluation result types)
2. `utils.ts` — `toKebabCase`, `toClassPrefix`, `buildScaffoldFiles`, `serializePropsForPrompt`, `buildDeterministicFeedback`

### Phase 2: Prompt Files

Create all 6 prompt files in `prompts/`:
1. `generate_react_component@v1.prompt` (with feedback variable)
2. `generate_component_css@v1.prompt` (with feedback variable)
3. `generate_webflow_declaration@v1.prompt` (with feedback variable)
4. `generate_main_tsx@v1.prompt` (theme preview)
5. `generate_readme@v1.prompt`
6. `evaluate_component@v1.prompt` (weighted rubric)

### Phase 3: Steps + Evaluators

1. `steps.ts` — 8 step functions:
   - `generateScaffold` (templates)
   - `generateReactComponent` (LLM + feedback)
   - `generateComponentCSS` (LLM + feedback)
   - `generateWebflowDeclaration` (LLM + feedback)
   - `runDeterministicChecks` (regex/string)
   - `generateMainTsx` (LLM)
   - `generateReadme` (LLM)
2. `evaluators.ts` — `evaluateComponent` evaluator with weighted rubric

### Phase 4: Workflow

1. `workflow.ts` — Orchestration with generate-evaluate loop

### Phase 5: Scenarios + Test

1. `scenarios/pricing_table.json`
2. Restart worker, run scenario, validate output
3. Verify loop converges within 1-2 iterations for the test scenario

---

## File Inventory

| # | File | Purpose |
|---|------|---------|
| 1 | `types.ts` | All Zod schemas, TypeScript types, evaluation result types |
| 2 | `utils.ts` | Pure helpers: toKebabCase, buildScaffoldFiles, serializePropsForPrompt, buildDeterministicFeedback |
| 3 | `steps.ts` | 7 step functions (scaffold + 5 LLM generation + deterministic checks) |
| 4 | `evaluators.ts` | evaluateComponent evaluator with weighted rubric |
| 5 | `workflow.ts` | Workflow orchestration with generate-evaluate loop |
| 6 | `prompts/generate_react_component@v1.prompt` | React component LLM prompt (with feedback) |
| 7 | `prompts/generate_component_css@v1.prompt` | CSS LLM prompt (with feedback) |
| 8 | `prompts/generate_webflow_declaration@v1.prompt` | .webflow.tsx LLM prompt (with feedback) |
| 9 | `prompts/generate_main_tsx@v1.prompt` | Theme preview main.tsx LLM prompt |
| 10 | `prompts/generate_readme@v1.prompt` | README LLM prompt |
| 11 | `prompts/evaluate_component@v1.prompt` | LLM judge with weighted rubric |
| 12 | `scenarios/pricing_table.json` | Test scenario |

**Total:** 12 files (5 TypeScript, 6 prompts, 1 JSON scenario)

---

## Error Handling

| Component | Retry Strategy | Rationale |
|-----------|---------------|-----------|
| `generateScaffold` | None | Pure templates, no I/O |
| LLM generation steps (2-4, 7-8) | `maximumAttempts: 3` | LLM can produce invalid output |
| `runDeterministicChecks` | None | Pure logic, no I/O |
| `evaluateComponent` | `maximumAttempts: 3` | LLM evaluation can fail transiently |
| Generate-evaluate loop | Max 3 iterations | Bound the regeneration attempts |
| Workflow (top-level) | `maximumAttempts: 2` | Retry entire workflow once on catastrophic failure |

If after 3 loop iterations the quality gate still isn't met, the workflow returns the best result with the full evaluation attached. The developer can see exactly what the LLM judge flagged and fix it manually.
