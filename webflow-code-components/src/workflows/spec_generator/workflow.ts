import { workflow, z } from '@output.ai/core';
import { generateSpec, researchApiIntegrations } from './steps.js';
import { WorkflowInputSchema, WorkflowOutputSchema } from './types.js';

export default workflow( {
  name: 'spec_generator',
  description: 'Generate a complete Webflow code component specification from a plain English description',
  inputSchema: WorkflowInputSchema,
  outputSchema: WorkflowOutputSchema,
  fn: async ( input ) => {
    // Step 1: Generate the base spec from description
    const spec = await generateSpec( {
      description: input.description,
      complexity: input.complexity ?? 'standard',
    } );

    // Step 2: Research API integrations if the component involves external services
    const apiResearch = await researchApiIntegrations( {
      description: spec.description,
      componentName: spec.componentName,
      props: spec.props,
    } );

    return {
      ...spec,
      apiIntegrations: apiResearch.hasApis ? apiResearch.integrations : undefined,
    };
  },
  options: {
    retry: {
      maximumAttempts: 2,
    },
  },
} );
