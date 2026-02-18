import { step } from '@output.ai/core';
import { execSync } from 'node:child_process';
import {
  InstallDepsInputSchema,
  InstallDepsOutputSchema,
  RunTscInputSchema,
  RunTscOutputSchema,
} from './types.js';

// ─── Step 1: Install Dependencies ───────────────────────────────────────────

export const installDeps = step( {
  name: 'install_deps',
  description: 'Run npm install in the component output directory to get TypeScript and type definitions',
  inputSchema: InstallDepsInputSchema,
  outputSchema: InstallDepsOutputSchema,
  fn: async ( input ) => {
    try {
      execSync( 'npm install --ignore-scripts --no-audit --no-fund', {
        cwd: input.outputDir,
        timeout: 120_000,
        stdio: 'pipe',
      } );
      return { success: true };
    } catch ( err ) {
      const message = err instanceof Error ? err.message : String( err );
      return { success: false, error: message };
    }
  },
  options: {
    retry: { maximumAttempts: 2 },
  },
} );

// ─── Step 2: Run TypeScript Compiler ────────────────────────────────────────

export const runTsc = step( {
  name: 'run_tsc',
  description: 'Run tsc --noEmit to type-check the generated component without emitting files',
  inputSchema: RunTscInputSchema,
  outputSchema: RunTscOutputSchema,
  fn: async ( input ) => {
    try {
      execSync( 'npx tsc --noEmit', {
        cwd: input.outputDir,
        timeout: 60_000,
        stdio: 'pipe',
      } );
      // If tsc exits 0, no errors
      return { passed: true, errorCount: 0, errors: [], rawOutput: '' };
    } catch ( err: unknown ) {
      // tsc exits non-zero when there are errors
      const execErr = err as { stdout?: Buffer; stderr?: Buffer; message?: string };
      const stdout = execErr.stdout?.toString() ?? '';
      const stderr = execErr.stderr?.toString() ?? '';
      const rawOutput = ( stdout + '\n' + stderr ).trim();

      // Parse individual errors from tsc output
      // tsc errors look like: src/components/Foo/Foo.tsx(12,5): error TS2307: Cannot find module...
      const errorLines = rawOutput
        .split( '\n' )
        .filter( ( line ) => line.includes( ': error TS' ) )
        .map( ( line ) => line.trim() );

      return {
        passed: false,
        errorCount: errorLines.length,
        errors: errorLines,
        rawOutput,
      };
    }
  },
  options: {
    retry: { maximumAttempts: 1 },
  },
} );
