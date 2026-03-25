#!/usr/bin/env bash
set -euo pipefail

# ── Usage ─────────────────────────────────────
# ./scripts/qa-component.sh <component-name>
#
# Runs pre-PR QA for a generated component:
#   1. TypeScript build check
#   2. npm install (if needed)
#   3. npx webflow library share  → upload to Webflow for visual testing
#   4. Pause for manual QA
#   5. Optionally run submit-component-pr.sh

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPTS_DIR" rev-parse --show-toplevel)"

# ── 1. Validate argument ──────────────────────
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <component-name>"
  echo "Example: $0 faq-accordion"
  exit 1
fi

COMPONENT_NAME="$1"
COMPONENT_DIR="${REPO_ROOT}/webflow-code-components/output/${COMPONENT_NAME}"

# ── 2. Pre-flight checks ──────────────────────
if [[ ! -d "$COMPONENT_DIR" ]]; then
  echo "ERROR: Component not found at: ${COMPONENT_DIR}"
  echo "Make sure the Output.ai workflow has run for '${COMPONENT_NAME}'."
  exit 1
fi

for required_file in package.json webflow.json; do
  if [[ ! -f "${COMPONENT_DIR}/${required_file}" ]]; then
    echo "ERROR: ${COMPONENT_DIR}/${required_file} not found. Re-run the component generator."
    exit 1
  fi
done

if [[ -z "${WEBFLOW_WORKSPACE_API_TOKEN:-}" ]]; then
  echo "WARNING: WEBFLOW_WORKSPACE_API_TOKEN is not set."
  echo "The Webflow CLI will likely prompt for authentication."
  echo "Set it with: export WEBFLOW_WORKSPACE_API_TOKEN=<your-token>"
  echo ""
fi

# ── 3. npm install ────────────────────────────
echo "▶ Installing dependencies in ${COMPONENT_NAME}..."
if [[ ! -d "${COMPONENT_DIR}/node_modules" ]]; then
  (cd "$COMPONENT_DIR" && npm install --silent)
  echo "  ✓ Dependencies installed"
else
  echo "  ✓ node_modules already present (skipping install)"
fi

# ── 4. TypeScript build check ─────────────────
echo ""
echo "▶ Running TypeScript build check..."
if (cd "$COMPONENT_DIR" && npm run build -- --noEmit 2>/dev/null || npx tsc -b --noEmit 2>/dev/null); then
  echo "  ✓ TypeScript build passed"
else
  echo ""
  echo "  ✗ TypeScript build FAILED. Fix errors before uploading to Webflow."
  echo ""
  echo "  Run manually to see errors:"
  echo "    cd ${COMPONENT_DIR} && npx tsc -b"
  exit 1
fi

# ── 5. Upload to Webflow via CLI ──────────────
echo ""
echo "▶ Uploading '${COMPONENT_NAME}' to Webflow..."
echo "  (Run from: ${COMPONENT_DIR})"
echo ""
(cd "$COMPONENT_DIR" && npx webflow library share)

# ── 6. Manual QA checkpoint ───────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Component uploaded. Manual QA checklist:"
echo ""
echo "  [ ] Component renders correctly in Webflow canvas"
echo "  [ ] All props are editable in the Webflow panel"
echo "  [ ] Site variables wire up correctly (colors, typography)"
echo "  [ ] Responsive layout looks correct at all breakpoints"
echo "  [ ] No console errors in preview mode"
echo "  [ ] Edge cases: empty props, long text, missing images"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -r -p "QA passed? Ready to submit PR? [y/N] " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo ""
  echo "PR creation skipped. Fix any issues and re-run this script."
  echo "Or run the PR script directly once ready:"
  echo "  ./scripts/submit-component-pr.sh ${COMPONENT_NAME}"
  exit 0
fi

# ── 7. Hand off to PR script ──────────────────
echo ""
echo "▶ Handing off to submit-component-pr.sh..."
exec "${SCRIPTS_DIR}/submit-component-pr.sh" "$COMPONENT_NAME"
