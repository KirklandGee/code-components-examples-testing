# Local dev cheatsheet

The minimum commands to do real work. Read [`HANDOFF.md`](../HANDOFF.md) for context.

## One-time setup

```bash
# 1. Stop any other Output.ai stack on this machine (port conflicts on 3001, 5432, 6379, 7233, 8080)
docker ps --format "{{.Names}}" | grep -v webflow-code-components | xargs -I {} docker stop {} 2>/dev/null

# 2. Set the Anthropic key (only the first time you clone)
echo "ANTHROPIC_API_KEY=sk-ant-..." > webflow-code-components/.env

# 3. Install workflow deps + build
cd webflow-code-components && npm install && npm run output:worker:build && cd ..

# 4. Workaround for the CLI's misplaced .env
cp webflow-code-components/.env webflow-code-components/node_modules/@output.ai/cli/dist/assets/docker/.env
```

## Bring the stack up

```bash
cd webflow-code-components
docker compose -p webflow-code-components --project-directory . \
  -f node_modules/@output.ai/cli/dist/assets/docker/docker-compose-dev.yml up -d

# Wait until the worker logs say "state: 'RUNNING'"
docker logs -f webflow-code-components-worker-1
```

## After editing prompts or steps

```bash
cd webflow-code-components
npm run output:worker:build && docker restart webflow-code-components-worker-1
```

## Generate a component

```bash
cd webflow-code-components
# Sync (waits for completion):
npx output workflow run component_generator \
  --input src/workflows/component_generator/scenarios/<spec>.json

# Async (good for long runs):
npx output workflow start component_generator \
  --input src/workflows/component_generator/scenarios/<spec>.json
# returns workflow ID; then:
npx output workflow status <id>
npx output workflow result <id>
```

Output lands in `webflow-code-components/output/<kebab-name>/`.

## Move generation output to repo root and verify

```bash
cp -r webflow-code-components/output/<kebab-name> ./<kebab-name>
cd <kebab-name>
npm install
npm run build      # fix any TS errors before publishing
npm run dev        # local theme preview at http://localhost:5173
```

## Publish to the Webflow shared library

```bash
cd <kebab-name>
NODE_OPTIONS="--max-http-header-size=65536" \
  ./node_modules/.bin/webflow library share
# First publish from each worktree opens a browser auth flow
```

If you see `Parse Error: Header overflow`, the `NODE_OPTIONS` flag is mandatory — Webflow's poll endpoint sometimes returns oversized response headers.

## Inspect Temporal workflow execution

```
open http://localhost:8080
```

You'll see every workflow run, every step, every retry, every input/output.

## Tear down the stack

```bash
cd webflow-code-components
docker compose -p webflow-code-components --project-directory . \
  -f node_modules/@output.ai/cli/dist/assets/docker/docker-compose-dev.yml down
```

`down -v` if you also want to wipe Temporal state.

## Tour of an existing component (the references)

If you're confused about how a piece should look, read the working examples first:

```bash
ls hero-section/             # straightforward content component
ls testimonial-carousel/     # external library + imported CSS
ls weather-widget/           # API integration with auth
ls faq-accordion/            # collapsible content + animation
```

Each has the same shape:
- `package.json` — Vite scaffold
- `webflow.json` — library metadata
- `index.html` + `src/main.tsx` — local theme preview
- `src/components/<Name>/<Name>.tsx` — the React component (Webflow knows nothing about it)
- `src/components/<Name>/<Name>.css` — plain CSS with `var(--site-variable, fallback)` references
- `src/components/<Name>/<Name>.webflow.tsx` — the Webflow declaration (`declareComponent` + `props.X` calls)
- `src/vite-env.d.ts` — the `vite/client` reference + any ambient declarations

`README.md` per component documents every prop and every site variable the user should wire up.
