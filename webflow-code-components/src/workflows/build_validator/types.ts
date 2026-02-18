import { z } from '@output.ai/core';

// ─── Workflow Input ─────────────────────────────────────────────────────────

export const WorkflowInputSchema = z.object( {
  kebabName: z.string().describe( 'Kebab-case component name matching the output directory (e.g. "job-board")' ),
} );

// ─── Workflow Output ────────────────────────────────────────────────────────

export const WorkflowOutputSchema = z.object( {
  passed: z.boolean().describe( 'Whether the TypeScript build succeeded with no errors' ),
  errorCount: z.number().describe( 'Number of TypeScript errors found' ),
  errors: z.array( z.string() ).describe( 'Array of tsc error messages' ),
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

// ─── Inferred Types ─────────────────────────────────────────────────────────

export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;
