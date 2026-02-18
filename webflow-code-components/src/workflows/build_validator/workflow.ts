/* eslint-disable @typescript-eslint/no-explicit-any */
import { workflow } from '@output.ai/core';
import { installDeps, runTsc } from './steps.js';
import { WorkflowInputSchema, WorkflowOutputSchema } from './types.js';

const buildValidator: any = workflow( {
  name: 'build_validator',
  description: 'Validate a generated component by installing dependencies and running tsc --noEmit',
  inputSchema: WorkflowInputSchema,
  outputSchema: WorkflowOutputSchema,
  fn: async ( input ) => {
    const outputDir = `/app/output/${input.kebabName}`;

    // Step 1: Install dependencies
    const installResult = await installDeps( { outputDir } );

    if ( !installResult.success ) {
      return {
        passed: false,
        errorCount: 1,
        errors: [ `npm install failed: ${installResult.error ?? 'unknown error'}` ],
      };
    }

    // Step 2: Run TypeScript compiler
    const tscResult = await runTsc( { outputDir } );

    return {
      passed: tscResult.passed,
      errorCount: tscResult.errorCount,
      errors: tscResult.errors,
    };
  },
  options: {
    retry: {
      maximumAttempts: 1,
    },
  },
} );

export default buildValidator;
