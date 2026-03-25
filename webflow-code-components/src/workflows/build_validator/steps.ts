import { step } from '@output.ai/core';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  InstallDepsInputSchema,
  InstallDepsOutputSchema,
  RunTscInputSchema,
  RunTscOutputSchema,
  RunStaticChecksInputSchema,
  RunStaticChecksOutputSchema,
} from './types.js';
import type { StaticCheck } from './types.js';

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

// ─── Step 3: Static Code Quality Checks ─────────────────────────────────────

export const runStaticChecks = step( {
  name: 'run_static_checks',
  description: 'Check generated files for Webflow conventions: CSS var fallbacks, typography inheritance, class prefix, no hardcoded content URLs',
  inputSchema: RunStaticChecksInputSchema,
  outputSchema: RunStaticChecksOutputSchema,
  fn: async ( input ) => {
    const { outputDir, kebabName } = input;
    const checks: StaticCheck[] = [];

    // Derive the CSS class prefix: "job-board" → "wf-jobboard"
    const cssPrefix = 'wf-' + kebabName.replace( /-/g, '' );
    const componentDir = join( outputDir, 'src', 'components' );

    // Collect CSS and TSX file contents
    let cssContent = '';
    let componentTsxContent = '';

    try {
      // Find the component subdirectory (e.g. src/components/JobBoard/)
      const componentSubdirs = readdirSync( componentDir, { withFileTypes: true } )
        .filter( d => d.isDirectory() )
        .map( d => d.name );

      for ( const subdir of componentSubdirs ) {
        const subdirPath = join( componentDir, subdir );
        const files = readdirSync( subdirPath );

        for ( const file of files ) {
          const filePath = join( subdirPath, file );
          const content = readFileSync( filePath, 'utf8' );

          if ( file.endsWith( '.css' ) ) {
            cssContent += content + '\n';
          }
          // Main component file (e.g. JobBoard.tsx) — not the .webflow.tsx declaration
          if ( file.endsWith( '.tsx' ) && !file.endsWith( '.webflow.tsx' ) ) {
            componentTsxContent += content + '\n';
          }
        }
      }
    } catch {
      // If we can't read the files, mark all checks as skipped
      const skipped: StaticCheck = { name: 'file-read', passed: false, issues: [ `Could not read component files from ${componentDir}` ] };
      return { passed: false, issueCount: 1, checks: [ skipped ] };
    }

    // ── Check 1: CSS var() fallbacks ──────────────────────────────────────
    {
      // Match var(--something) with no fallback (no comma before closing paren)
      // Exclude --wf-* internal vars (they're not site variables, no fallback needed)
      const noFallback: string[] = [];
      const varRegex = /var\(\s*(--[^,)\s]+)\s*\)/g;
      let match: RegExpExecArray | null;
      while ( ( match = varRegex.exec( cssContent ) ) !== null ) {
        const varName = match[ 1 ];
        if ( !varName.startsWith( '--wf-' ) ) {
          noFallback.push( varName );
        }
      }
      checks.push( {
        name: 'css-var-fallbacks',
        passed: noFallback.length === 0,
        issues: noFallback.map( v => `${v} is missing a fallback value` ),
      } );
    }

    // ── Check 2: Typography inheritance on root element ───────────────────
    {
      const issues: string[] = [];
      const rootClassBlock = new RegExp(
        `\\.${cssPrefix}\\s*\\{([^}]*)\\}`, 'g'
      );
      let foundRoot = false;
      let hasFontFamily = false;
      let hasColor = false;

      let match: RegExpExecArray | null;
      while ( ( match = rootClassBlock.exec( cssContent ) ) !== null ) {
        foundRoot = true;
        const block = match[ 1 ];
        if ( /font-family\s*:\s*inherit/.test( block ) ) hasFontFamily = true;
        if ( /color\s*:\s*inherit/.test( block ) ) hasColor = true;
      }

      if ( !foundRoot ) {
        issues.push( `Root class .${cssPrefix} not found in CSS` );
      } else {
        if ( !hasFontFamily ) issues.push( `Root .${cssPrefix} is missing font-family: inherit` );
        if ( !hasColor ) issues.push( `Root .${cssPrefix} is missing color: inherit` );
      }

      checks.push( { name: 'typography-inheritance', passed: issues.length === 0, issues } );
    }

    // ── Check 3: CSS class prefix ─────────────────────────────────────────
    {
      // Find all class selectors defined in the CSS
      const issues: string[] = [];
      const classRegex = /\.([\w-]+)\s*[{,:\[]/g;
      const seen = new Set<string>();
      let match: RegExpExecArray | null;

      while ( ( match = classRegex.exec( cssContent ) ) !== null ) {
        const cls = match[ 1 ];
        if ( seen.has( cls ) ) continue;
        seen.add( cls );
        // Must be exactly the root prefix OR start with prefix + "-"
        if ( cls !== cssPrefix && !cls.startsWith( cssPrefix + '-' ) ) {
          issues.push( `Class .${cls} does not use the expected prefix .${cssPrefix}-` );
        }
      }

      checks.push( { name: 'css-class-prefix', passed: issues.length === 0, issues } );
    }

    // ── Check 4: No hardcoded content URLs in React component ─────────────
    {
      // Flag src= or href= JSX attributes with literal https:// strings.
      // These should come from props, not be hardcoded in the component.
      // Exempt: fetch() calls and similar API endpoint strings (those are code logic).
      const issues: string[] = [];

      // Match src={"https://..."} or src="https://..." (JSX attributes)
      const hardcodedSrc = /\bsrc=\{?"https?:\/\/[^"'}\s]+/g;
      const hardcodedHref = /\bhref=\{?"https?:\/\/[^"'}\s]+/g;

      let match: RegExpExecArray | null;
      while ( ( match = hardcodedSrc.exec( componentTsxContent ) ) !== null ) {
        issues.push( `Hardcoded src URL: ${match[ 0 ].slice( 0, 80 )}` );
      }
      while ( ( match = hardcodedHref.exec( componentTsxContent ) ) !== null ) {
        issues.push( `Hardcoded href URL: ${match[ 0 ].slice( 0, 80 )}` );
      }

      checks.push( { name: 'no-hardcoded-content-urls', passed: issues.length === 0, issues } );
    }

    // ── Check 5: Toggle / switch alignment ────────────────────────────────
    // If the component has toggle/switch/slider CSS classes, their container
    // blocks must use display:flex + align-items:center so the thumb is centered.
    {
      const issues: string[] = [];
      const toggleKeywords = [ 'toggle', 'switch', 'slider' ];

      // Find CSS blocks for toggle-like classes and verify they have flex alignment
      // e.g. .wf-foo-toggle { ... } or .wf-foo-toggle-track { ... }
      const blockRegex = /\.([\w-]+)\s*\{([^}]*)\}/g;
      let match: RegExpExecArray | null;

      while ( ( match = blockRegex.exec( cssContent ) ) !== null ) {
        const className = match[ 1 ];
        const blockBody = match[ 2 ];
        const isToggleClass = toggleKeywords.some( kw => className.includes( kw ) );
        if ( !isToggleClass ) continue;

        // Container/row classes (not the thumb) should have flex + align-items: center
        const isThumb = className.includes( 'thumb' ) || className.includes( 'knob' ) || className.includes( 'dot' );
        if ( isThumb ) continue;

        const hasDisplay = /display\s*:\s*flex/.test( blockBody );
        const hasAlignItems = /align-items\s*:\s*center/.test( blockBody );

        if ( hasDisplay && !hasAlignItems ) {
          issues.push( `.${className} uses display:flex but is missing align-items:center — toggle elements will not be vertically centered` );
        }
      }

      checks.push( { name: 'toggle-alignment', passed: issues.length === 0, issues } );
    }

    const allIssues = checks.flatMap( c => c.issues );
    return {
      passed: checks.every( c => c.passed ),
      issueCount: allIssues.length,
      checks,
    };
  },
  options: {
    retry: { maximumAttempts: 1 },
  },
} );
