import { evaluator, z, EvaluationNumberResult } from '@output.ai/core';
import { generateObject } from '@output.ai/llm';
import type { BlogContent } from './types.js';

const blogContentSchema = z.object( {
  title: z.string(),
  url: z.string(),
  content: z.string(),
  tokenCount: z.number()
} );

export const evaluateSignalToNoise = evaluator( {
  name: 'evaluate_signal_to_noise',
  description: 'Evaluate the signal-to-noise ratio of blog content',
  inputSchema: blogContentSchema,
  fn: async ( input: BlogContent ) => {
    const { result } = await generateObject( {
      prompt: 'signal_noise@v1',
      variables: {
        title: input.title,
        content: input.content
      },
      schema: z.object( {
        score: z.number().min( 0 ).max( 100 ).describe( 'Signal-to-noise score 0-100' )
      } )
    } );

    return new EvaluationNumberResult( {
      value: result.score,
      confidence: 0.85
    } );
  }
} );
