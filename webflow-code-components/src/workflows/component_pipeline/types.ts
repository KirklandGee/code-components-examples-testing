import { z } from '@output.ai/core';

// ─── Workflow Input ─────────────────────────────────────────────────────────

export const WorkflowInputSchema = z.object( {
  description: z.string().describe( 'Plain English description of the component to build' ),
  complexity: z.enum( [ 'simple', 'standard', 'complex' ] ).optional().default( 'standard' ).describe(
    'Complexity hint: simple (~5-10 props), standard (~15-25 props), complex (~25-40 props)'
  ),
} );

// ─── Workflow Output ────────────────────────────────────────────────────────

export const WorkflowOutputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  files: z.record( z.string(), z.string() ).describe( 'Map of relative file paths to file contents' ),
  evaluation: z.object( {
    score: z.number(),
    iterations: z.number(),
  } ),
  buildValidation: z.object( {
    passed: z.boolean(),
    errorCount: z.number(),
    errors: z.array( z.string() ),
  } ),
} );

// ─── Inferred Types ─────────────────────────────────────────────────────────

export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;
