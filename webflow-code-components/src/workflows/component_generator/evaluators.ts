import { evaluator, z, EvaluationNumberResult } from '@output.ai/core';
import { generateObject } from '@output.ai/llm';
import { toClassPrefix } from './utils.js';
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

    const { result } = await generateObject( {
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
      schema: EvaluationResultSchema,
    } );

    // Compute confidence from criteria scores
    const criteriaScores = [
      result.criteria.functionalityCompleteness.score,
      result.criteria.propWiring.score,
      result.criteria.cssCompleteness.score,
      result.criteria.semanticHtml.score,
      result.criteria.accessibility.score,
      result.criteria.codeQuality.score,
    ];
    const avgCriteriaScore = criteriaScores.reduce( ( a, b ) => a + b, 0 ) / criteriaScores.length;
    const confidence = Math.round( ( avgCriteriaScore / 100 ) * 100 ) / 100;

    return new EvaluationNumberResult( {
      value: result.score,
      confidence,
      reasoning: result.reasoning,
    } );
  },
} );
