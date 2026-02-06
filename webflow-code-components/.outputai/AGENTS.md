# Output.ai Based Project Guide

## Overview

This project uses Output.ai Framework to build production-ready AI applications with built-in prompt management, evaluation, observability, and error handling. Developers use it to build AI features like fact checkers, content generators, data extractors, research assistants, and multi-step agents.

### Project Overview

Each workflow lives in its own folder under `src/workflows/` and follows a consistent structure. Workflows define the orchestration logic, calling steps to perform external operations like API calls, database queries, and LLM inference. The framework automatically handles retries, timeouts, and reliable execution.

### Key Concepts

#### Durable Execution powered by Temporal.io

Output provides durable execution guarantees (built on Temporal.io) - if execution fails mid-run, it resumes from the last successful step rather than restarting. The framework provides high-level abstractions (`workflow`, `step`, `evaluator`) that enforce best practices and provide automatic tracing.

#### Single Folder Project Structure

Each workflow is self-contained in a single folder with a predictable structure: `workflow.ts` contains the deterministic orchestration logic, `steps.ts` contains I/O operations (API calls, LLM inference), `evaluators.ts` contains analysis logic returning confidence-scored results, and `prompts/*.prompt` files define LLM prompts using Liquid.js templates with YAML frontmatter for model configuration.

## Critical Conventions

- **HTTP**: Never use axios → use `@output.ai/http` (traced, auto-retry)
- **LLM**: Never call LLM APIs directly → use `@output.ai/llm`
- **Workflows**: Must be deterministic - only call steps/evaluators, no direct I/O
- **Steps**: All external operations (APIs, DBs, LLMs) must be wrapped in steps
- **Schemas**: Use Zod (`z`) from `@output.ai/core` to define input/output schemas

## Code Reuse Rules

**IMPORTANT: Workflows are isolated by design.** Do not reuse code directly between sibling workflows.

### Allowed Code Sharing Locations:
- `src/clients/` - HTTP API clients shared across ALL workflows
- `src/workflows/{name}/shared/` - Shared utilities within a workflow group
- `src/workflows/{name}/lib/` - Internal libraries for a workflow group

### Forbidden:
- Importing from sibling workflow folders (e.g., `../other_workflow/steps.js`)
- Copying step implementations between workflows
- Referencing types from other workflow folders

Each workflow must remain independently deployable and testable. Cross-workflow imports create hidden dependencies that break this isolation.

## Project Structure

```
src/
  clients/             # Shared HTTP API clients (one file per external service)
    jina.ts            # Example: Jina Reader API client
    stripe.ts          # Example: Stripe API client
  workflows/{name}/
    types.ts           # Zod schemas and TypeScript types (should hold ALL types for the workflow)
    workflow.ts        # Orchestration logic (deterministic)
    steps.ts           # I/O operations (APIs, LLM, DB)
    evaluators.ts      # LLM-as-a-judge analysis steps returning EvaluationResult
    prompts/*.prompt   # LLM prompts (name@v1.prompt)
    scenarios/*.json   # Test scenarios
```

## API Clients Pattern

External API integrations should be placed in `src/clients/` as reusable modules. Each client wraps `@output.ai/http` for automatic tracing and retries.

```typescript
// src/clients/jina.ts
import { httpClient } from '@output.ai/http';

const client = httpClient({
  prefixUrl: 'https://r.jina.ai',
  timeout: 30000
});

export const jinaClient = {
  read: async (url: string): Promise<string> => {
    const response = await client.get(url);
    return response.text();
  }
};
```

**Usage in steps:**
```typescript
// src/workflows/my_workflow/steps.ts
import { jinaClient } from '../../clients/jina.js';

export const scrapeUrl = step({
  name: 'scrapeUrl',
  // ...
  fn: async (url) => jinaClient.read(url)
});
```

**Key requirements:**
- One file per external service in `src/clients/`
- Always use `@output.ai/http` (never axios or fetch directly)
- Export a named client object with typed methods
- Import clients in steps using relative paths (`../../clients/`)

## Types Pattern

Every workflow MUST have a `types.ts` file containing all Zod schemas and TypeScript types. This ensures type safety and schema reusability across workflow components.

```typescript
import { z } from '@output.ai/core';

// Workflow input/output schemas
export const WorkflowInputSchema = z.object({
  query: z.string().describe('The search query'),
  maxResults: z.number().optional().default(10)
});

export const WorkflowOutputSchema = z.object({
  results: z.array(z.object({
    title: z.string(),
    content: z.string()
  })),
  totalCount: z.number()
});

// Step schemas
export const FetchDataInputSchema = z.object({
  url: z.string().url()
});

export const FetchDataOutputSchema = z.object({
  data: z.unknown(),
  status: z.number()
});

// Inferred TypeScript types
export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;
export type FetchDataInput = z.infer<typeof FetchDataInputSchema>;
export type FetchDataOutput = z.infer<typeof FetchDataOutputSchema>;

// Shared interfaces (non-Zod types used within the workflow)
export interface ApiResponse {
  code: number;
  data: unknown;
}
```

**Key requirements:**
- All Zod schemas used in `workflow.ts` and `steps.ts` MUST be defined in `types.ts`
- Export both schemas (for runtime validation) and inferred types (for TypeScript)
- Use `.describe()` on schema fields for documentation
- Keep API response interfaces separate from Zod schemas

## Commands

```bash
npx output dev                                      # Start dev (Temporal:8080, API:3001)
npx output workflow list                            # List workflows

# Sync execution (waits for result)
npx output workflow run <name> --input <JSON|JSON_FILE>      # Execute and wait

# Async execution
npx output workflow start <name> --input <JSON|JSON_FILE>    # Start workflow, returns ID
npx output workflow status <workflowId>             # Check execution status
npx output workflow result <workflowId>             # Get result when complete
npx output workflow stop <workflowId>               # Cancel running workflow
```

**When running workflows for users**: After execution completes, try to format the result nicely for readability. Use markdown formatting, tables for structured data, and highlight key values. Don't just dump raw JSON.

## Workflow Pattern

Workflows orchestrate steps. They must be deterministic (no direct I/O).

```typescript
import { workflow, z } from '@output.ai/core';
import { processData, callApi } from './steps.js';

export default workflow({
  name: 'my-workflow',
  description: 'What this workflow does',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  fn: async (input) => {
    const data = await processData(input);
    const result = await callApi(data);
    return { result };
  }
});
```

**Allowed imports**: steps.ts, evaluators.ts, ../../shared/steps/*.ts, types.ts, consts.ts, utils.ts

**Forbidden in workflows**: Direct API calls, Math.random(), Date.now(), dynamic imports

## Step Pattern

Steps contain all I/O operations. They are automatically retried on failure.

```typescript
import { step, z } from '@output.ai/core';
import { httpClient } from '@output.ai/http';

const client = httpClient({ prefixUrl: 'https://api.example.com' });

export const fetchData = step({
  name: 'fetchData',
  description: 'Fetch data from external API',
  inputSchema: z.object({ id: z.string() }),
  outputSchema: z.object({ data: z.any() }),
  fn: async ({ id }) => {
    const response = await client.get(`items/${id}`).json();
    return { data: response };
  },
  options: {
    retry: { maximumAttempts: 3 }
  }
});
```

## LLM Pattern

Use `@output.ai/llm` for all LLM operations. Prompts are defined in `.prompt` files.

**Prompt file** (`summarize@v1.prompt`):
```yaml
---
provider: anthropic
model: claude-sonnet-4-20250514
temperature: 0.7
maxTokens: 2000
---
<system>You are a helpful assistant.</system>
<user>Summarize: </user>
```

**Step using prompt**:
```typescript
import { step, z } from '@output.ai/core';
import { generateText, generateObject } from '@output.ai/llm';

export const summarize = step({
  name: 'summarize',
  inputSchema: z.object({ content: z.string() }),
  outputSchema: z.string(),
  fn: async ({ content }) => {
    const { result } = await generateText({
      prompt: 'summarize@v1',
      variables: { content }
    });
    return result;
  }
});

// For structured output
export const extractInfo = step({
  name: 'extractInfo',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ title: z.string(), summary: z.string() }),
  fn: async ({ text }) => {
    const { result } = await generateObject({
      prompt: 'extract@v1',
      variables: { text },
      schema: z.object({ title: z.string(), summary: z.string() })
    });
    return result;
  }
});
```

**Available functions**: `generateText`, `generateObject`, `generateArray`, `generateEnum`

**Providers**: anthropic, openai, azure

## HTTP Pattern

Use `@output.ai/http` for traced HTTP requests with automatic retry.

```typescript
import { httpClient } from '@output.ai/http';

const client = httpClient({
  prefixUrl: 'https://api.example.com',
  timeout: 30000,
  retry: { limit: 3 }
});

// In a step:
const data = await client.get('endpoint').json();
const result = await client.post('endpoint', { json: payload }).json();
```

## Evaluator Pattern

Evaluators are LLM-as-a-judge for analyzing data and return confidence-scored results. They are highly recommended for anything that is high-value involving LLMs and can benefit from self-improvement loops or scoring for logging the results on tracing.

```typescript
import { evaluator, EvaluationStringResult } from '@output.ai/core';

export const judgeQuality = evaluator({
  name: 'judgeQuality',
  inputSchema: z.string(),
  fn: async (content) => {
    // Analysis logic
    return new EvaluationStringResult({
      value: 'good',
      confidence: 0.95
    });
  }
});
```

## Error Handling

```typescript
import { FatalError, ValidationError } from '@output.ai/core';

// Non-retryable error (workflow fails immediately)
throw new FatalError('Critical failure - do not retry');

// Validation error (input/output schema failure)
throw new ValidationError('Invalid input format');
```

## Creating New Workflows

**IMPORTANT**: When creating a new workflow, you MUST use the following agents and commands in order. Do not skip steps.

### Mandatory Workflow Creation Process

1. **Plan** → `/outputai:plan_workflow` or `workflow-planner` agent
   - Defines workflow architecture, steps, and data flow
   - Identifies required external APIs and LLM operations
   - MUST be run first before any implementation

2. **Build** → `/outputai:build_workflow`
   - Creates the workflow folder structure
   - Generates `types.ts`, `workflow.ts`, `steps.ts`
   - Sets up test scenarios

3. **Prompts** → `workflow-prompt-writer` agent
   - Creates `.prompt` files for all LLM operations
   - Reviews and optimizes prompt templates
   - Ensures proper Liquid.js templating

4. **Quality** → `workflow-quality` agent
   - Validates implementation against best practices
   - Checks for proper error handling and retries
   - Ensures schema consistency across components

### Available Sub-Agents

| Agent | Purpose |
|-------|---------|
| `workflow-planner` | Architecture design, step breakdown, data flow planning |
| `workflow-prompt-writer` | Create and review `.prompt` files with proper templates |
| `workflow-quality` | Validate best practices, error handling, schema consistency |
| `workflow-context-fetcher` | Retrieve project context (used by other agents) |
| `workflow-debugger` | Debug workflow issues, analyze execution traces |

### Available Commands

| Command | When to Use |
|---------|-------------|
| `/outputai:plan_workflow` | **ALWAYS FIRST** - Plan new workflow architecture |
| `/outputai:build_workflow` | Implement the planned workflow |
| `/outputai:debug_workflow` | Debug failing or misbehaving workflows |

## Working with This Codebase

**CRITICAL: Trust the documentation.** When creating or modifying workflows:

1. **Do NOT scan the entire codebase** - The patterns and examples in this document are authoritative
2. **Follow the documented patterns** - Use the step, workflow, and evaluator patterns exactly as shown
3. **Use the sub-agents** - They have the context needed to create correct implementations

### What to Read:
- This current file (you're reading it)
- The specific workflow folder you're modifying
- `src/clients/` for available HTTP clients

### What NOT to Do:
- Grep through all workflows looking for "examples"
- Read multiple workflow implementations to "understand patterns"
- Second-guess the documented patterns based on existing code variations

## Common Issues

### Restarting Worker After Adding Workflows

After creating a new workflow, you likely need restart the worker container for changes to take effect.

```bash
# Check running containers
docker ps --filter "name=output" --format "{{.Names}}: {{.Status}}"

# Restart the worker (adjust container name based on your project)
docker restart <project-name>-worker-1

# Wait for worker to restart, then run the workflow
sleep 5 && npx output workflow run <workflow_name> --input '<json>'
```

### Payload Size Limits

Plan for size limits when designing workflows.**

- **Temporal limit**: ~2MB per workflow input/output payload
- **gRPC limit**: ~4MB per message

When planning workflows that process large data (documents, images, API responses):
- Chunk large arrays and process in batches
- Summarize or extract only needed fields from large API responses
- When dealing with files prompt the user about cloud storage (S3, etc)

### Docker-Based Development

`npx output dev` runs services in Docker containers. For debugging:

```bash
# View worker logs
docker logs -f output-worker-1

# View API logs
docker logs -f output-api-1

# View Temporal logs
docker logs -f output-temporal-1

# Shell into a container
docker exec -it output-worker-1 sh
```

Logs do not appear in the terminal directly - check container logs when debugging workflow issues.

## Configuration

See `.env` file for required environment variables (API keys, etc.)
