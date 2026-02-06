import { z } from '@output.ai/core';

export const blogContentSchema = z.object( {
  title: z.string(),
  url: z.string(),
  content: z.string(),
  tokenCount: z.number()
} );

export const workflowInputSchema = z.object( {
  url: z.string().url().describe( 'URL of the blog post to evaluate' )
} );

export const workflowOutputSchema = z.object( {
  url: z.string(),
  title: z.string(),
  signalToNoiseScore: z.number().min( 0 ).max( 100 ),
  confidence: z.number().min( 0 ).max( 1 ),
  summary: z.string()
} );

export type BlogContent = z.infer<typeof blogContentSchema>;
export type WorkflowInput = z.infer<typeof workflowInputSchema>;
export type WorkflowOutput = z.infer<typeof workflowOutputSchema>;
