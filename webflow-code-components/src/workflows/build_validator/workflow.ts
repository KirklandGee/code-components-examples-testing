/* eslint-disable @typescript-eslint/no-explicit-any */
import { workflow } from '@output.ai/core';
import { installDeps, runTsc, runStaticChecks } from './steps.js';
import { WorkflowInputSchema, WorkflowOutputSchema } from './types.js';

const buildValidator: any = workflow( {
  name: 'build_validator',
  description: 'Validate a generated component: install dependencies, run tsc --noEmit, and run static code quality checks',
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
        staticChecks: { passed: false, issueCount: 0, checks: [] },
      };
    }

    // Step 2: Run TypeScript compiler
    const tscResult = await runTsc( { outputDir } );

    // Step 3: Static code quality checks (runs regardless of tsc result)
    const staticResult = await runStaticChecks( { outputDir, kebabName: input.kebabName } );

    return {
      passed: tscResult.passed && staticResult.passed,
      errorCount: tscResult.errorCount,
      errors: tscResult.errors,
      staticChecks: {
        passed: staticResult.passed,
        issueCount: staticResult.issueCount,
        checks: staticResult.checks,
      },
    };
  },
  options: {
    retry: {
      maximumAttempts: 1,
    },
  },
} );

export default buildValidator;
