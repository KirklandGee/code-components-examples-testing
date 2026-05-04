# Handoff — Webflow Code Components

> **Last updated:** 2026-04-22 by Kirkland (before OOO Friday → following week).
> **Audience:** Whoever picks this up while Kirkland is out, or anyone returning fresh.
> **Tone:** Read this end-to-end before you touch anything.

This is a **fork** of [Webflow-Examples/code-components-examples](https://github.com/Webflow-Examples/code-components-examples) (added as `upstream`). Everything in this repo is forked-and-then-extended for two purposes:

1. **An LLM-driven workflow** under `webflow-code-components/` that generates new Webflow code components from a JSON spec.
2. **A growing library of generated components** at the repo root (`hero-section/`, `testimonial-carousel/`, `stats-counter/`, etc.) that get published to a Webflow shared library for in-canvas QA.

We're using the upstream Webflow examples as our base and submitting the better ones back as PRs.

---

## TL;DR for the next person

If you only read one section, read this.

- **The repo's "live" branches** are `main`, `add/showcase-components` (six new components, never QA'd), and `improve/generator-lessons-from-qa` (workflow improvements that should land in main once reviewed).
- **There are 17 open PRs against the upstream `Webflow-Examples` repo** (#10 through #30) — most are pre-QA component drafts. See the [Branch & PR triage](#branch--pr-triage) section for what to keep / close / merge.
- **The component generator workflow lives in `webflow-code-components/`** and runs locally via Docker (Output.ai stack). Running it requires stopping any other Output.ai project on this machine first — `temporal`, `postgres`, `redis`, and the API/UI ports collide.
- **All generated and human-fixed components are published to the Webflow Developer Platform Growth Plan workspace** as a shared library. To publish, run `npx webflow library share` from each component directory; this needs auth (`NODE_OPTIONS="--max-http-header-size=65536"` is sometimes required — see [Local dev gotchas](#local-dev-gotchas)).
- **The next priorities** in order are: (1) QA the six new showcase components, (2) tighten the generator (`toKebabCase` for acronyms, switch generated React types to `PropValues[PropType.X]`), (3) reconcile the open PRs with what's actually been QA'd. See [Next steps](#next-steps).

---

## What lives where

### Top-level component directories

Each is a self-contained Vite project that builds a single Webflow code component. Pattern is `{ComponentName}/src/components/{ComponentName}/{ComponentName}.{tsx,css,webflow.tsx}` plus a Vite scaffold and a `webflow.json` for the library config.

| Directory | Status | Branch |
|---|---|---|
| `calendar/` | Original Webflow example, untouched | `main` |
| `cms-slider/` | Original Webflow example, untouched | `main` |
| `pricing-quote-calculator/` | Original Webflow example, untouched | `main` |
| `multi-step-form/` | DaisyUI-based form, color-fixed during QA | `claude/agitated-beaver-3733ae` |
| `shadcn-components/` | Original shadcn examples, untouched | `main` |
| `store-locator/` | Original Webflow example, untouched | `main` |
| `hero-section/` | Generated then QA'd; deployed to Webflow | `claude/agitated-beaver-3733ae` |
| `testimonial-carousel/` | Generated then QA'd; deployed to Webflow | `claude/agitated-beaver-3733ae` |
| `weather-widget/` | Generated then QA'd; deployed to Webflow | `claude/agitated-beaver-3733ae` |
| `faq-accordion/` | Generated then QA'd; deployed (RichText still has a known issue, see [Open issues](#open-issues)) | `claude/agitated-beaver-3733ae` |
| `job-board/` | Generated; deployed to Webflow | `main` |
| `stats-counter/` | Generated 2026-04-22; **never QA'd** | `add/showcase-components` |
| `logo-marquee/` | Generated 2026-04-22; **never QA'd** | `add/showcase-components` |
| `youtube-channel/` | Generated 2026-04-22; **never QA'd** | `add/showcase-components` |
| `instagram-feed/` | Generated 2026-04-22; **never QA'd** | `add/showcase-components` |
| `github-repo-card/` | Generated 2026-04-22; **never QA'd** | `add/showcase-components` |
| `crypto-ticker/` | Generated 2026-04-22; **never QA'd** | `add/showcase-components` |

There are ~20 stale `add/<component>` branches from earlier per-component PR pushes that never made it through QA. See [Branch & PR triage](#branch--pr-triage).

### `webflow-code-components/` — the generator workflow

This is an [Output.ai](https://output.ai) project (built on Temporal). It contains five workflows; the only one we use day-to-day is `component_generator`. The others are scaffolding from earlier experiments.

```
webflow-code-components/
├── src/
│   └── workflows/
│       ├── component_generator/      ← the one that matters
│       │   ├── workflow.ts             - 3-iteration generate→check→evaluate loop
│       │   ├── steps.ts                - eight step functions (LLM + deterministic)
│       │   ├── evaluators.ts           - LLM-as-judge component scoring
│       │   ├── utils.ts                - kebab-case, scaffold templates
│       │   ├── types.ts                - Zod schemas
│       │   ├── prompts/                - .prompt files (LLM prompts in Liquid templating)
│       │   └── scenarios/              - JSON specs that get fed to the workflow
│       ├── spec_generator/           ← English → JSON spec, used less
│       ├── component_pipeline/       ← orchestrates spec_generator + component_generator
│       ├── build_validator/          ← TS / build static checks
│       └── blog_evaluator/           ← unrelated, ignore
├── output/                              - the workflow writes here
├── package.json
└── .env                                 - has ANTHROPIC_API_KEY (do not commit)
```

Read `webflow-code-components/CLAUDE.md` (which symlinks to `.outputai/AGENTS.md`) for Output.ai-specific patterns.

### `docs/`

| File | What it is |
|---|---|
| `generator-reference.md` | THE authoritative spec for what a generated component should look like. Component output is held to this doc. Update this if conventions change. |
| `repo-patterns-guide.md` | Notes on patterns extracted from the original Webflow examples |
| `webflow-styling-guide.md` | Shadow DOM behavior, what works / doesn't in Webflow's runtime |
| `strategy-summary.md` | The QBR pivot to plain-CSS / no design systems |
| `landing-page-pov.md` | Strategy POV |
| `output-ai-docs-index.md` | Pointer to Output.ai docs |
| `qa-lessons.md` | **NEW** — consolidated lessons from the QA cycle on the first 7 components. Read this before generating new ones or QA'ing the showcase six. |

### `scripts/`

Throwaway helpers for the publish flow. Nothing critical.

---

## Branches that matter (and the rest)

| Branch | What's on it | What to do with it |
|---|---|---|
| `main` | Forked baseline + a few merged additions (job board, automated QA pipeline). | Keep. |
| `add/showcase-components` | Six new generated components, **never QA'd**. | QA → fix → merge to `main`. |
| `improve/generator-lessons-from-qa` | Workflow improvements (prompts, deterministic checks, scaffold) and the six showcase scenarios. | Review and merge to `main`. |
| `claude/agitated-beaver-3733ae` | Lots of QA fixes across hero-section, testimonial-carousel, weather-widget, faq-accordion, multi-step-form. | Cherry-pick the worthwhile commits into PRs against `main`, or rebase the whole thing onto `main` and merge. The branch name is a Claude-Code session worktree alias; rename if you keep it. |
| `add/modal-dialog` | Modal QA fix from this session. | Already pushed; PR #19 is open against upstream. |
| `add/tooltip-hover-card` | Tooltip QA rewrite from this session. | Already pushed; PR #24 is open against upstream. |
| `add/<component>` (17 others) | Pre-QA drafts. | See [Branch & PR triage](#branch--pr-triage). |

`+` markers in `git branch` output are worktrees — don't delete those branches without removing the worktree first (`git worktree remove ...`).

---

## Branch & PR triage

There are 17 open PRs against `Webflow-Examples/code-components-examples` (the upstream). Three were closed in this session as not-pursuing (Accordion #25, Badge #13, SkeletonLoader #22). Here's how to think about the rest:

### Already QA'd this session (good to merge upstream)

- **#19 ModalDialog** — bodyContent rendering fixed, contentSlot dropped. Tested in Webflow. Ready.
- **#24 TooltipHoverCard** — full rewrite during QA (CSS positioning, always-mounted overlay). Tested in Webflow. Ready.

### Generated but never QA'd (6 still need testing in Webflow before they're trustworthy upstream)

The six on `add/showcase-components`:
- StatsCounter, LogoMarquee, YouTubeChannel, InstagramFeed, GithubRepoCard, CryptoTicker

These aren't on upstream yet. After QA, open PRs for them.

### Pre-QA drafts that exist as upstream PRs (decide per-PR)

These were pushed earlier in the project lifecycle and have not been touched since they were generated:

| PR | Component | Recommended action |
|---|---|---|
| #14 | AvatarGroup | QA in Webflow → fix → keep open |
| #15 | Breadcrumbs | Same |
| #16 | CmsFilterSearch | Same |
| #17 | ComboboxInput | Same |
| #18 | DataTable | Same |
| #20 | PaginationControls | Same |
| #21 | ProgressStepper | Same |
| #23 | ToggleSwitch | Same |
| #26 | CarouselSlider | Same |
| #27 | DatePicker | Same |
| #28 | ToastNotification | Same |
| #29 | QuoteBuilder | Same |
| #30 | MultiStepForm | This was a duplicate; the multi-step-form on `claude/agitated-beaver-3733ae` is the QA'd version. Decide which one ships and close the other. |
| #12 | JobBoard (old) | This is the original Greenhouse JobBoard. Likely superseded by what's on `main`. Check + close if obsolete. |
| #10 | CMSSlider (third-party PR) | Not ours — review on its own merits. |

### Local-only branches with no PR

Older `add/<component>` local branches that don't have PRs. Run `git branch --merged main` to see candidates for deletion.

---

## The component lifecycle

End-to-end, here's how a new component gets from idea to in-canvas Webflow.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Spec (JSON file in scenarios/)                                       │
│    Either hand-written OR produced by the spec_generator workflow.       │
│    Spec includes: component name, description, full prop list (groups,  │
│    defaults, tooltips), optional API integrations.                       │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Run component_generator                                              │
│    npx output workflow run component_generator --input <spec.json>       │
│    Or async: npx output workflow start ... → npx output workflow result │
│                                                                          │
│    Internally:                                                           │
│    - Generates scaffold files (no LLM)                                   │
│    - Generates {Name}.tsx, {Name}.css, {Name}.webflow.tsx (LLM)          │
│    - Runs 13 deterministic checks (richTextHandledCorrectly, etc.)       │
│    - If checks pass, runs an LLM evaluator (target ≥ 90/100)             │
│    - Up to 3 iterations on failure with structured feedback              │
│    - Generates main.tsx (theme preview) + README                         │
│    - Writes everything to webflow-code-components/output/<kebab-name>/   │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. Move to repo root + verify build                                     │
│    cp -r webflow-code-components/output/<name> ./<name>                 │
│    cd <name> && npm install && npm run build                             │
│                                                                          │
│    Common build fixes (see qa-lessons.md):                               │
│    - main.tsx passes Image/Link as strings → wrap in object literal      │
│    - React types use { src, alt } literally → swap to                    │
│      PropValues[PropType.Image]                                          │
│    - Unused vars in strict mode → underscore-prefix or wire up           │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Publish to Webflow shared library                                    │
│    cd <name>                                                             │
│    NODE_OPTIONS="--max-http-header-size=65536" \                          │
│      ./node_modules/.bin/webflow library share                           │
│    First-run for each worktree opens a browser auth flow.                │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. Drop on the Webflow canvas, QA, find bugs                            │
│    Drop the component on the demo Webflow site, exercise every prop,     │
│    every visual variant, every responsive break. Most issues only show   │
│    up here, not in npm run build or the LLM evaluator.                   │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. Fix + republish                                                      │
│    Edit files in <name>/, npm run build to verify, commit, push, then    │
│    re-run npx webflow library share. Webflow CDN cache can be sticky;    │
│    hard-refresh the Designer canvas after publishing.                    │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 7. PR upstream                                                          │
│    Once a component is solid, open a PR against                          │
│    Webflow-Examples/code-components-examples on the matching add/<name>  │
│    branch.                                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Local dev setup

### Prerequisites

- Docker Desktop running
- Node 24.3+ (the workflow runtime needs it; see `webflow-code-components/package.json` `engines.node`)
- An Anthropic API key in `webflow-code-components/.env` (`ANTHROPIC_API_KEY=...`)
- A Webflow Developer Platform account with permission to publish to the workspace's shared library

### Starting the workflow stack

The workflow runs on Output.ai's local Docker stack (Temporal + postgres + redis + an API + a worker container). To start it:

```bash
cd webflow-code-components
npm install
npm run output:worker:build       # compiles src/ → dist/
docker compose -p webflow-code-components --project-directory . \
  -f node_modules/@output.ai/cli/dist/assets/docker/docker-compose-dev.yml up -d
```

The friendlier `npx output dev` works too but tends to detach awkwardly when run as a backgrounded command. Direct `docker compose up -d` is more reliable in scripts.

### Verifying the worker

```bash
docker logs -f webflow-code-components-worker-1
# Wait until you see "state: 'RUNNING'" — first boot does npm install + tsc, takes ~60s
npx output workflow list
# should print: blog_evaluator, build_validator, component_generator, component_pipeline, spec_generator
```

### Running a generation

```bash
cd webflow-code-components
npx output workflow run component_generator \
  --input src/workflows/component_generator/scenarios/<spec>.json
# OR async:
npx output workflow start component_generator --input <spec>.json
# returns a workflow ID; then:
npx output workflow status <id>
npx output workflow result <id>
```

Output lands in `webflow-code-components/output/<kebab-name>/`.

### After editing prompts or step code

```bash
npm run output:worker:build && docker restart webflow-code-components-worker-1
```

### Local dev gotchas

These all bit us. Putting them here so they don't bite the next person.

1. **Port conflicts with other Output.ai projects on the same machine.** Temporal binds 7233, the temporal UI binds 8080, the API binds 3001, redis binds 6379, postgres binds 5432. If you have a `growthx-workflows-*` (or any other Output.ai) stack running, *stop it first*. `docker stop $(docker ps -q --filter name=growthx-workflows)` is the blunt version.

2. **`docker-compose.yml` lives inside `node_modules`.** The CLI ships its compose file at `node_modules/@output.ai/cli/dist/assets/docker/docker-compose-dev.yml`. The `./` bind mount in that file resolves relative to the compose file's directory, so you must pass `--project-directory .` when invoking `docker compose` directly, or it'll mount the wrong path and the worker will fail with `ENOENT: no such file or directory, open '/app/package.json'`.

3. **`.env` location.** Output's CLI looks for `.env` next to the compose file. Symlinking or copying `webflow-code-components/.env` to `webflow-code-components/node_modules/@output.ai/cli/dist/assets/docker/.env` is the workaround until the CLI is fixed.

4. **Liquid templating in `.prompt` files.** The prompts are Liquid (jinja-ish). Anything containing `{{ … }}` that isn't a real variable (e.g. JSX like `style={{ ... }}`) needs to be wrapped in `{% raw %}…{% endraw %}` or rephrased. We hit this with `dangerouslySetInnerHTML={{ __html: prop }}` recently — the workflow refused to start until we either escaped or removed the double braces.

5. **`npx webflow library share` auth.** First run on each worktree opens a browser OAuth flow. If polling fails with `Parse Error: Header overflow`, you need a bigger Node header buffer:
   ```bash
   NODE_OPTIONS="--max-http-header-size=65536" ./node_modules/.bin/webflow library share
   ```
   Apply this every time until the CLI gets a fix upstream.

6. **`docker stop` doesn't always stop the auto-restart.** Some of the other Docker stacks on this machine have `restart: always` policies. If you `docker stop foo-1` and find it back up 30 seconds later, use `docker update --restart no foo-1` first, then stop.

7. **Components in worktrees show up with `+` in `git branch`.** The QA cycle was done in `.claude/worktrees/agitated-beaver-3733ae` (Claude Code's session worktree) for one set of components, and in fresh worktrees under `.claude/worktrees/` for others. When triaging branches, `git worktree list` shows where each is checked out.

---

## Open issues

Things that broke during QA and never got fully resolved.

1. **FAQ Accordion `[object Object]` rendering** — When the FaqAccordion is dropped in the Webflow canvas, the rich text answers initially rendered as `[object Object]` until we (a) added RichText `defaultValue`, (b) switched the open/close animation from `max-height` (with JS measurement) to a CSS `grid-template-rows` transition, and (c) discovered that adding any extra div above `{item.answer}` (even an empty debug div) made it work. Root cause is *still unclear* — best guess is some interaction between the React-element slot, conditional rendering with `{isOpen && …}`, and the runtime's slot projection in Shadow DOM. Currently shipping the version with the grid animation and "always render" pattern; it works, but if the same shape gets used elsewhere we may hit it again.

2. **`toKebabCase` mangles acronyms.** YouTubeChannel → `you-tube-channel` instead of `youtube-channel`. Fix is straightforward in `webflow-code-components/src/workflows/component_generator/utils.ts` — treat consecutive uppercase letters as one token. Renaming the output dir manually after generation is the current workaround.

3. **Generated React components use literal object shapes for Image/Link types.** The generator currently outputs `image?: { src: string; alt?: string }` instead of `image?: PropValues[PropType.Image]`. Both are *structurally* the same, but `declareComponent`'s generic check picks them apart and the literal shape gets inferred as `PropType.Slot`, which is fatal. We had to manually swap to `PropValues[PropType.X]` for hero-section, testimonial-carousel, logo-marquee, and instagram-feed during QA. The prompt should be updated to emit `PropValues[PropType.X]` directly.

4. **`main.tsx` previews routinely fail to type-check on first generation.** They pass strings where Image/Link object props are expected, comparing literal types where TS rejects (e.g. `activeTheme === 'dark'` inside an `activeTheme === 'custom'` branch). Doesn't affect Webflow runtime (only `main.tsx` is the local dev preview), but it does block `npm run build`. The `generate_main_tsx@v1` prompt should be tightened or post-processed.

5. **Six showcase components are unproven in Webflow.** They built locally and passed the LLM evaluator. They have not been dropped on the canvas yet. Any of them could have rendering / runtime / Shadow-DOM bugs.

6. **Some PRs against the upstream are stale.** The 13 PRs from early March (#14–#30) were pushed when the components were freshly generated, before the QA learnings. Several of those components likely have the Image/Link/RichText bugs we found later. They should each be QA'd before merging upstream — or closed.

---

## Next steps (prioritized)

1. **QA the six new showcase components.** `add/showcase-components` branch. The lifecycle in [The component lifecycle](#the-component-lifecycle) section is exact. Use `docs/qa-lessons.md` as the bug-pattern checklist. Expected: each will need 2–4 small fixes.

2. **Merge `improve/generator-lessons-from-qa` into `main`.** It's a clean prompt + scaffold + deterministic-check upgrade. Has one approved follow-up tucked inside (the 6 scenarios), so review before merging.

3. **Tighten the generator using known issues 2–4 above.**
   - `toKebabCase` acronym handling — `webflow-code-components/src/workflows/component_generator/utils.ts`
   - React component should emit `PropValues[PropType.X]` types — update `generate_react_component@v1.prompt`
   - `main.tsx` preview should type-check — update `generate_main_tsx@v1.prompt`, or add a deterministic check that runs `tsc --noEmit` against the preview

4. **Triage the upstream PR list.** Each pre-QA component PR should either get pulled into a QA cycle or closed. Don't merge upstream without a full Webflow-canvas pass.

5. **Move the repo to a GrowthX organization.** See [GrowthX move](#growthx-move).

6. **Decide on the FAQ Accordion mystery.** Either declare the current "always-mounted + grid animation" pattern as canon (and bake it into the React prompt) or actually root-cause why the simpler max-height pattern fails.

---

## GrowthX move

The repo currently lives at `KirklandGee/code-components-examples-testing`. To move it under a GrowthX organization there are two paths:

### Option A — Transfer ownership (preserves history, redirects URLs)

1. In GitHub web UI, navigate to the repo's **Settings** → **Danger Zone** → **Transfer ownership**. Type the GrowthX org name. GitHub will preserve all branches, PRs, issues, and stars; existing URLs auto-redirect.
2. After the transfer, update local remotes everywhere:
   ```bash
   git remote set-url origin git@github.com:GrowthX-Org/code-components-examples-testing.git
   ```
   (replace `GrowthX-Org` with the real org slug)
3. Anyone with worktrees needs the same `git remote set-url`.
4. CI / external integrations referencing the old URL get auto-redirects, but it's worth grepping for hardcoded URLs:
   ```bash
   grep -rn "KirklandGee/code-components-examples-testing" --include="*.json" --include="*.md" --include="*.yml"
   ```

This is the cleaner path. Recommended.

### Option B — Fork into the org

1. Use the GitHub UI to fork into the org.
2. Force-push every active branch from the personal fork into the org fork.
3. Re-open every PR (PRs don't transfer with a fork).
4. Update remotes locally.

This loses PR history and is more disruptive. Only use if Option A isn't permitted by the org's settings.

### What to keep / archive

- The personal `KirklandGee/code-components-examples-testing` fork can be archived after the transfer (or kept as a backup).
- The relationship to the original `Webflow-Examples/code-components-examples` upstream should be preserved — the org fork should still have it as `upstream` so we can keep PRing back.

---

## Things you'll wonder about

**Why are there so many `.claude/` directories?** Claude Code uses worktrees stored under `.claude/worktrees/` for parallel work. They reference real branches. `git worktree list` shows them all. To clean up: `git worktree remove <path>`.

**Why is the worker container named with a project prefix?** Output.ai's compose file uses `${DOCKER_SERVICE_NAME}-<service>-1` as container names, and we set `DOCKER_SERVICE_NAME=webflow-code-components` in `.env`. This lets multiple Output.ai projects coexist on the same machine *as long as you remap ports* (which we don't — they all want the same defaults).

**Where does the LLM cost come from?** Each component generation runs 1–3 iterations of three LLM calls (React component, CSS, declaration), plus an evaluator call, plus a main.tsx generation, plus a README generation. Roughly 50–150K tokens per component. Anthropic API key burns through this; the `ANTHROPIC_API_KEY` in `.env` is the one being charged.

**What's `output-sdk-*` doing in `docker ps -a`?** Earlier exited containers from `@output.ai/sdk` experiments. Safe to delete with `docker container prune`.

**Where's the Webflow library this all gets published to?** `https://webflow.com/dashboard/workspace/developer-platform-growth-plan/shared-libraries-and-templates`. You need access to the `developer-platform-growth-plan` workspace to publish. Auth is per-Webflow-account.
