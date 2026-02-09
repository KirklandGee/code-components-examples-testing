import { step, z } from '@output.ai/core';
import { generateObject, generateText } from '@output.ai/llm';
import {
  GenerateSpecInputSchema,
  GenerateSpecOutputSchema,
  ResearchApiInputSchema,
  ResearchApiOutputSchema,
} from './types.js';

/**
 * Strip markdown code fences from LLM output.
 */
function stripCodeFences( code: string ): string {
  let result = code.trim();
  result = result.replace( /^```[\w]*\s*\n?/, '' );
  result = result.replace( /\n?```\s*$/, '' );
  return result;
}

// ─── Step 1: Generate Spec from Description (LLM) ───────────────────────────

export const generateSpec = step( {
  name: 'generate_spec',
  description: 'Generate a complete component specification from a plain English description',
  inputSchema: GenerateSpecInputSchema,
  outputSchema: GenerateSpecOutputSchema,
  fn: async ( input ) => {
    const { result } = await generateObject( {
      prompt: 'generate_spec@v1',
      variables: {
        description: input.description,
        complexity: input.complexity,
      },
      schema: GenerateSpecOutputSchema,
    } );

    return result;
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );

// ─── Step 2: Research API Integrations (LLM) ────────────────────────────────

export const researchApiIntegrations = step( {
  name: 'research_api_integrations',
  description: 'Detect and research external API integrations from the component spec',
  inputSchema: ResearchApiInputSchema,
  outputSchema: ResearchApiOutputSchema,
  fn: async ( input ) => {
    const { result: rawText } = await generateText( {
      prompt: 'research_api@v1',
      variables: {
        componentName: input.componentName,
        description: input.description,
        propsJson: JSON.stringify( input.props, null, 2 ),
      },
    } );

    // Parse the JSON response with code fence stripping
    const cleaned = stripCodeFences( rawText ).trim();
    try {
      const parsed = ResearchApiOutputSchema.parse( JSON.parse( cleaned ) );
      return parsed;
    } catch {
      // Try extracting JSON from surrounding text
      const jsonMatch = cleaned.match( /\{[\s\S]*\}/ );
      if ( jsonMatch ) {
        try {
          return ResearchApiOutputSchema.parse( JSON.parse( jsonMatch[0] ) );
        } catch {
          // No APIs detected as fallback
          return { hasApis: false, integrations: [] };
        }
      }
      return { hasApis: false, integrations: [] };
    }
  },
  options: {
    retry: { maximumAttempts: 2 },
  },
} );
