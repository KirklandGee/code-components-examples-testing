import { z } from '@output.ai/core';

// ─── Workflow Input ─────────────────────────────────────────────────────────

export const WorkflowInputSchema = z.object( {
  kebabName: z.string().describe( 'Kebab-case component name matching the output directory (e.g. "job-board")' ),
} );

// ─── Workflow Output ────────────────────────────────────────────────────────

export const StaticCheckSchema = z.object( {
  name: z.string(),
  passed: z.boolean(),
  issues: z.array( z.string() ),
} );

export const WorkflowOutputSchema = z.object( {
  passed: z.boolean().describe( 'Whether all checks (TypeScript build + static) passed' ),
  errorCount: z.number().describe( 'Number of TypeScript errors found' ),
  errors: z.array( z.string() ).describe( 'Array of tsc error messages' ),
  staticChecks: z.object( {
    passed: z.boolean(),
    issueCount: z.number(),
    checks: z.array( StaticCheckSchema ),
  } ).describe( 'Results of static code quality checks' ),
} );

// ─── Step Schemas ───────────────────────────────────────────────────────────

export const InstallDepsInputSchema = z.object( {
  outputDir: z.string().describe( 'Absolute path to the component output directory' ),
} );

export const InstallDepsOutputSchema = z.object( {
  success: z.boolean(),
  error: z.string().optional(),
} );

export const RunTscInputSchema = z.object( {
  outputDir: z.string().describe( 'Absolute path to the component output directory' ),
} );

export const RunTscOutputSchema = z.object( {
  passed: z.boolean(),
  errorCount: z.number(),
  errors: z.array( z.string() ),
  rawOutput: z.string(),
} );

export const RunStaticChecksInputSchema = z.object( {
  outputDir: z.string().describe( 'Absolute path to the component output directory' ),
  kebabName: z.string().describe( 'Kebab-case component name (e.g. "job-board")' ),
} );

export const RunStaticChecksOutputSchema = z.object( {
  passed: z.boolean(),
  issueCount: z.number(),
  checks: z.array( StaticCheckSchema ),
} );

// ─── Inferred Types ─────────────────────────────────────────────────────────

export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;
export type StaticCheck = z.infer<typeof StaticCheckSchema>;
