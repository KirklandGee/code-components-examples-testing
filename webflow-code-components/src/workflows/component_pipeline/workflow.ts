/* eslint-disable @typescript-eslint/no-explicit-any */
import { workflow } from '@output.ai/core';
import specGenerator from '../spec_generator/workflow.js';
import componentGenerator from '../component_generator/workflow.js';
import buildValidator from '../build_validator/workflow.js';
import { WorkflowInputSchema, WorkflowOutputSchema } from './types.js';
import type { WorkflowOutput as SpecOutput } from '../spec_generator/types.js';
import type { WorkflowOutput as ComponentOutput } from '../component_generator/types.js';
import type { WorkflowOutput as ValidatorOutput } from '../build_validator/types.js';

const componentPipeline: any = workflow( {
  name: 'component_pipeline',
  description: 'End-to-end pipeline: plain English description → spec with API research → complete Webflow code component',
  inputSchema: WorkflowInputSchema,
  outputSchema: WorkflowOutputSchema,
  fn: async ( input ) => {
    // Step 1: Generate spec from description (includes API research)
    const spec = await specGenerator( {
      description: input.description,
      complexity: input.complexity,
    } ) as SpecOutput;

    // Step 2: Generate the full component from the spec
    const component = await componentGenerator( {
      componentName: spec.componentName,
      description: spec.description,
      props: spec.props,
      npmDependencies: spec.npmDependencies,
      group: spec.group,
      apiIntegrations: spec.apiIntegrations,
    } ) as ComponentOutput;

    // Step 3: Validate the build (npm install + tsc --noEmit)
    const validation = await buildValidator( {
      kebabName: component.kebabName,
    } ) as ValidatorOutput;

    return {
      componentName: component.componentName,
      kebabName: component.kebabName,
      files: component.files,
      evaluation: {
        score: component.evaluation.score,
        iterations: component.evaluation.iterations,
      },
      buildValidation: {
        passed: validation.passed,
        errorCount: validation.errorCount,
        errors: validation.errors,
      },
    };
  },
  options: {
    retry: {
      maximumAttempts: 2,
    },
  },
} );

export default componentPipeline;
