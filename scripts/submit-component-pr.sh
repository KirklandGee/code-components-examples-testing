#!/usr/bin/env bash
set -euo pipefail

UPSTREAM_REPO="Webflow-Examples/code-components-examples"
UPSTREAM_REMOTE_URL="git@github.com:Webflow-Examples/code-components-examples.git"

# ── 1. Validate argument ──────────────────────
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <component-name>"
  echo "Example: $0 faq-accordion"
  exit 1
fi

COMPONENT_NAME="$1"
REPO_ROOT="$(git rev-parse --show-toplevel)"
SOURCE_DIR="${REPO_ROOT}/webflow-code-components/output/${COMPONENT_NAME}"
DEST_DIR="${REPO_ROOT}/${COMPONENT_NAME}"
BRANCH_NAME="add/${COMPONENT_NAME}"

# ── 2. Pre-flight checks ──────────────────────
if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "ERROR: Generated component not found at: ${SOURCE_DIR}"
  echo "Make sure the Output.ai workflow has run for '${COMPONENT_NAME}'."
  exit 1
fi
for required_file in package.json webflow.json README.md; do
  if [[ ! -f "${SOURCE_DIR}/${required_file}" ]]; then
    echo "ERROR: ${SOURCE_DIR}/${required_file} not found. Re-run the component generator."
    exit 1
  fi
done
if ! command -v gh &>/dev/null; then
  echo "ERROR: GitHub CLI (gh) not installed. See: https://cli.github.com/"
  exit 1
fi
if ! gh auth status &>/dev/null; then
  echo "ERROR: Not authenticated with gh. Run: gh auth login"
  exit 1
fi

# ── 3. Branch safety ─────────────────────────
cd "$REPO_ROOT"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "WARNING: Currently on branch '${CURRENT_BRANCH}', not 'main'."
  read -r -p "Continue anyway? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

# ── 3a. Ensure working tree is clean ─────────
if ! git diff --cached --quiet; then
  echo "ERROR: You have staged changes. Commit or unstage them before running this script."
  echo ""
  git diff --cached --name-only
  exit 1
fi
if ! git diff --quiet; then
  echo "ERROR: You have unstaged changes. Commit or stash them before running this script."
  echo ""
  git diff --name-only
  exit 1
fi

# ── 4. Ensure upstream remote exists ─────────
if ! git remote get-url upstream &>/dev/null; then
  echo "Adding upstream remote: ${UPSTREAM_REMOTE_URL}"
  git remote add upstream "$UPSTREAM_REMOTE_URL"
fi

# ── 5. Handle existing destination dir ───────
if [[ -d "$DEST_DIR" ]]; then
  echo "WARNING: '${COMPONENT_NAME}/' already exists at repo root."
  read -r -p "Overwrite it? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
  rm -rf "$DEST_DIR"
fi

# ── 6. Handle existing branch ────────────────
if git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
  echo "WARNING: Branch '${BRANCH_NAME}' already exists locally."
  read -r -p "Delete and recreate it? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
  git branch -D "$BRANCH_NAME"
fi

# ── 7. Create branch + copy files ────────────
echo "Fetching upstream/main..."
git fetch upstream main

echo "Creating branch: ${BRANCH_NAME} (based on upstream/main)"
git checkout -b "$BRANCH_NAME" upstream/main

echo "Copying '${COMPONENT_NAME}' to repo root..."
cp -r "$SOURCE_DIR" "$DEST_DIR"
rm -rf "${DEST_DIR}/node_modules"
rm -f "${DEST_DIR}/package-lock.json"

# ── 8. Extract PR metadata from webflow.json ─
COMPONENT_DISPLAY_NAME="$(node -e "
  const fs = require('fs');
  const wf = JSON.parse(fs.readFileSync('${DEST_DIR}/webflow.json', 'utf8'));
  process.stdout.write(wf.library.name || '${COMPONENT_NAME}');
")"

COMPONENT_DESCRIPTION="$(node -e "
  const fs = require('fs');
  const wf = JSON.parse(fs.readFileSync('${DEST_DIR}/webflow.json', 'utf8'));
  process.stdout.write(wf.library.description || '');
")"

# ── 9. Commit ─────────────────────────────────
git add "${DEST_DIR}"
if git diff --cached --quiet; then
  echo "ERROR: Nothing staged — something went wrong with the copy step."
  exit 1
fi
git commit -m "Add ${COMPONENT_DISPLAY_NAME} code component

Generated component following the Webflow code components scaffold pattern.
Includes full and simple prop surface variations."

# ── 10. Push to fork ──────────────────────────
echo "Pushing to origin/${BRANCH_NAME}..."
git push --force-with-lease -u origin "$BRANCH_NAME"

# ── 11. Open PR ───────────────────────────────
echo "Creating PR against ${UPSTREAM_REPO}..."
GITHUB_USERNAME="$(gh api user --jq '.login')"

gh pr create \
  --repo "$UPSTREAM_REPO" \
  --title "Add ${COMPONENT_DISPLAY_NAME} component" \
  --body "## Component: ${COMPONENT_DISPLAY_NAME}

### Description
${COMPONENT_DESCRIPTION}

### What's Included
- React component with scoped CSS (no Tailwind, no shadcn)
- Colors via CSS site variables: \`var(--background-primary, #ffffff)\`, etc.
- Typography via inheritance: \`font-family: inherit; color: inherit;\`
- Full prop surface (\`${COMPONENT_DISPLAY_NAME}.webflow.tsx\`) — 20+ props for developers/agencies
- Simple prop surface (\`${COMPONENT_DISPLAY_NAME}Simple.webflow.tsx\`) — core text/link props for clients
- All CSS classes prefixed with \`wf-${COMPONENT_NAME}-\` for Shadow DOM safety

### Testing
- [ ] \`npm install && npm run dev\` runs locally
- [ ] \`npx webflow library share\` imports successfully
- [ ] Full and simple prop surfaces render in Webflow canvas
- [ ] Site variables wire up correctly" \
  --base main \
  --head "${GITHUB_USERNAME}:${BRANCH_NAME}"

# ── 12. Return to original branch ────────────
git checkout "$CURRENT_BRANCH"

echo ""
echo "Done! PR created against ${UPSTREAM_REPO}."
echo ""
echo "Reminder: Update the root README.md to list '${COMPONENT_NAME}' before merge."
