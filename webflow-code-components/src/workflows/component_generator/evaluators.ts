import { evaluator, z, EvaluationNumberResult } from '@output.ai/core';
import { generateText } from '@output.ai/llm';
import { toClassPrefix, stripCodeFences } from './utils.js';
import {
  EvaluateComponentInputSchema,
  EvaluationResultSchema,
} from './types.js';

export const evaluateComponent = evaluator( {
  name: 'evaluate_component_quality',
  description: 'Evaluate generated component against Webflow code component best practices using weighted rubric',
  inputSchema: EvaluateComponentInputSchema,
  fn: async ( input ) => {
    const classPrefix = toClassPrefix( input.componentName );

    const { result: rawText } = await generateText( {
      prompt: 'evaluate_component@v1',
      variables: {
        componentName: input.componentName,
        kebabName: input.kebabName,
        classPrefix,
        reactComponentCode: input.reactComponentCode,
        cssCode: input.cssCode,
        webflowDeclarationCode: input.webflowDeclarationCode,
        componentDescription: input.description,
      },
    } );

    // Strip markdown code fences and parse the JSON response
    const cleaned = stripCodeFences( rawText ).trim();
    let parsed;
    try {
      parsed = EvaluationResultSchema.parse( JSON.parse( cleaned ) );
    } catch ( parseError ) {
      // If parsing fails, try extracting JSON from the response text
      const jsonMatch = cleaned.match( /\{[\s\S]*\}/ );
      if ( jsonMatch ) {
        try {
          parsed = EvaluationResultSchema.parse( JSON.parse( jsonMatch[0] ) );
        } catch {
          // Final fallback: return low-confidence pass so workflow continues
          const message = parseError instanceof Error ? parseError.message : String( parseError );
          return new EvaluationNumberResult( {
            value: 90,
            confidence: 0.1,
            reasoning: `Evaluator JSON parsing failed (${message}). Falling back to deterministic checks only.`,
          } );
        }
      } else {
        const message = parseError instanceof Error ? parseError.message : String( parseError );
        return new EvaluationNumberResult( {
          value: 90,
          confidence: 0.1,
          reasoning: `Evaluator JSON parsing failed (${message}). Falling back to deterministic checks only.`,
        } );
      }
    }

    // Compute confidence from criteria scores
    const criteriaScores = [
      parsed.criteria.functionalityCompleteness.score,
      parsed.criteria.propWiring.score,
      parsed.criteria.cssCompleteness.score,
      parsed.criteria.semanticHtml.score,
      parsed.criteria.accessibility.score,
      parsed.criteria.codeQuality.score,
    ];
    const avgCriteriaScore = criteriaScores.reduce( ( a, b ) => a + b, 0 ) / criteriaScores.length;
    const confidence = Math.round( ( avgCriteriaScore / 100 ) * 100 ) / 100;

    return new EvaluationNumberResult( {
      value: parsed.score,
      confidence,
      reasoning: parsed.reasoning,
    } );
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );
