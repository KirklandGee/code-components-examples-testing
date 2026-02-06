import { step, z } from '@output.ai/core';
import { generateText } from '@output.ai/llm';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { buildScaffoldFiles, toClassPrefix, serializePropsForPrompt, stripCodeFences } from './utils.js';
import {
  GenerateScaffoldInputSchema,
  GenerateScaffoldOutputSchema,
  GenerateReactComponentInputSchema,
  CodeOutputSchema,
  GenerateComponentCSSInputSchema,
  GenerateWebflowDeclarationInputSchema,
  GenerateMainTsxInputSchema,
  GenerateReadmeInputSchema,
  RunDeterministicChecksInputSchema,
  RunDeterministicChecksOutputSchema,
  GenerateSimpleDeclarationInputSchema,
  WriteFilesInputSchema,
  WriteFilesOutputSchema,
} from './types.js';

// ─── Step 1: Generate Scaffold (No LLM) ─────────────────────────────────────

export const generateScaffold = step( {
  name: 'generate_scaffold',
  description: 'Generate boilerplate scaffold files from templates (no LLM)',
  inputSchema: GenerateScaffoldInputSchema,
  outputSchema: GenerateScaffoldOutputSchema,
  fn: async ( input ) => {
    return buildScaffoldFiles( input );
  },
} );

// ─── Step 2: Generate React Component (LLM) ─────────────────────────────────

export const generateReactComponent = step( {
  name: 'generate_react_component',
  description: 'Generate the pure React .tsx component using LLM',
  inputSchema: GenerateReactComponentInputSchema,
  outputSchema: CodeOutputSchema,
  fn: async ( input ) => {
    const propsText = serializePropsForPrompt( input.props );
    const classPrefix = toClassPrefix( input.componentName );
    const depsText = input.npmDependencies
      ? Object.entries( input.npmDependencies ).map( ( [ k, v ] ) => `${k}@${v}` ).join( ', ' )
      : 'none';

    const { result } = await generateText( {
      prompt: 'generate_react_component@v1',
      variables: {
        componentName: input.componentName,
        kebabName: input.kebabName,
        classPrefix,
        description: input.description,
        propsText,
        propsJson: JSON.stringify( input.props, null, 2 ),
        npmDependencies: depsText,
        feedback: input.feedback || '',
      },
    } );

    return { code: stripCodeFences( result ) };
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );

// ─── Step 3: Generate Component CSS (LLM) ───────────────────────────────────

export const generateComponentCSS = step( {
  name: 'generate_component_css',
  description: 'Generate the CSS file with site variable references',
  inputSchema: GenerateComponentCSSInputSchema,
  outputSchema: CodeOutputSchema,
  fn: async ( input ) => {
    const propsText = serializePropsForPrompt( input.props );
    const classPrefix = toClassPrefix( input.componentName );

    const { result } = await generateText( {
      prompt: 'generate_component_css@v1',
      variables: {
        componentName: input.componentName,
        kebabName: input.kebabName,
        classPrefix,
        description: input.description,
        propsText,
        reactComponentCode: input.reactComponentCode,
        feedback: input.feedback || '',
      },
    } );

    return { code: stripCodeFences( result ) };
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );

// ─── Step 4: Generate Webflow Declaration (LLM) ─────────────────────────────

export const generateWebflowDeclaration = step( {
  name: 'generate_webflow_declaration',
  description: 'Generate the .webflow.tsx declaration file',
  inputSchema: GenerateWebflowDeclarationInputSchema,
  outputSchema: CodeOutputSchema,
  fn: async ( input ) => {
    const propsText = serializePropsForPrompt( input.props );
    const classPrefix = toClassPrefix( input.componentName );

    const { result } = await generateText( {
      prompt: 'generate_webflow_declaration@v1',
      variables: {
        componentName: input.componentName,
        kebabName: input.kebabName,
        classPrefix,
        description: input.description,
        group: input.group,
        propsText,
        propsJson: JSON.stringify( input.props, null, 2 ),
        reactComponentCode: input.reactComponentCode,
        feedback: input.feedback || '',
      },
    } );

    return { code: stripCodeFences( result ) };
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );

// ─── Step 5: Run Deterministic Checks (No LLM) ─────────────────────────────

export const runDeterministicChecks = step( {
  name: 'run_deterministic_checks',
  description: 'Binary pass/fail validation of generated code against hard requirements',
  inputSchema: RunDeterministicChecksInputSchema,
  outputSchema: RunDeterministicChecksOutputSchema,
  fn: async ( input ) => {
    const { componentName, kebabName, reactComponentCode, cssCode, webflowDeclarationCode } = input;
    const classPrefix = toClassPrefix( componentName );
    const failures: string[] = [];

    // 1. CSS class prefix check
    const classNameMatches = reactComponentCode.match( /className="([^"]+)"/g ) || [];
    const templateClassNames = reactComponentCode.match( /className=\{`([^`]+)`\}/g ) || [];
    let classPrefixCorrect = true;

    for ( const match of classNameMatches ) {
      const classes = match.replace( /className="([^"]+)"/, '$1' ).split( /\s+/ );
      for ( const cls of classes ) {
        if ( cls && !cls.startsWith( `wf-${classPrefix}` ) ) {
          classPrefixCorrect = false;
          failures.push( `CSS class "${cls}" does not use the wf-${classPrefix}- prefix` );
        }
      }
    }
    for ( const match of templateClassNames ) {
      const template = match.replace( /className=\{`([^`]+)`\}/, '$1' );
      const staticParts = template.replace( /\$\{[^}]+\}/g, '' ).trim().split( /\s+/ );
      for ( const cls of staticParts ) {
        if ( cls && !cls.startsWith( `wf-${classPrefix}` ) ) {
          classPrefixCorrect = false;
          failures.push( `CSS class "${cls}" in template literal does not use the wf-${classPrefix}- prefix` );
        }
      }
    }

    // 2. Typography inherit check
    const rootClassRegex = new RegExp( `\\.wf-${classPrefix}\\s*\\{[^}]*\\}`, 's' );
    const rootMatch = cssCode.match( rootClassRegex );
    const rootBlock = rootMatch ? rootMatch[0] : '';
    const hasInheritFont = rootBlock.includes( 'font-family: inherit' );
    const hasInheritColor = rootBlock.includes( 'color: inherit' );
    const hasInheritLineHeight = rootBlock.includes( 'line-height: inherit' );
    const typographyInherited = hasInheritFont && hasInheritColor && hasInheritLineHeight;
    if ( !typographyInherited ) {
      const missing = [];
      if ( !hasInheritFont ) missing.push( 'font-family: inherit' );
      if ( !hasInheritColor ) missing.push( 'color: inherit' );
      if ( !hasInheritLineHeight ) missing.push( 'line-height: inherit' );
      failures.push( `Root class .wf-${classPrefix} is missing typography inheritance: ${missing.join( ', ' )}` );
    }

    // 3. Site variable fallbacks check
    // Skip component-internal custom properties (--wf-*) — only site variables need fallbacks
    const varMatches = cssCode.match( /var\(--[^)]+\)/g ) || [];
    let siteVariableFallbacks = true;
    for ( const v of varMatches ) {
      const varName = v.match( /var\((--[^,)]+)/ )?.[1] ?? '';
      if ( varName.startsWith( '--wf-' ) ) continue; // Component-internal variable, skip
      if ( !v.includes( ',' ) ) {
        siteVariableFallbacks = false;
        failures.push( `${v} in CSS is missing a fallback value — use var(--name, fallback)` );
      }
    }

    // 4. No design system imports check
    const allCode = reactComponentCode + cssCode + webflowDeclarationCode;
    const designSystemKeywords = [ 'tailwind', '@tailwind', 'shadcn', '@mui', '@chakra', '@mantine' ];
    let noDesignSystemImports = true;
    for ( const keyword of designSystemKeywords ) {
      if ( allCode.toLowerCase().includes( keyword ) ) {
        noDesignSystemImports = false;
        failures.push( `Found design system reference "${keyword}" — no design systems allowed` );
      }
    }

    // 5. CSS import location check
    const cssFileName = `${componentName}.css`;
    const cssImportInWebflow = webflowDeclarationCode.includes( cssFileName );
    const cssImportInReact = reactComponentCode.includes( '.css' );
    const cssImportCorrect = cssImportInWebflow && !cssImportInReact;
    if ( !cssImportInWebflow ) {
      failures.push( `CSS file "${cssFileName}" is not imported in .webflow.tsx — it must be imported there` );
    }
    if ( cssImportInReact ) {
      failures.push( `CSS is imported in ${componentName}.tsx — CSS should only be imported in .webflow.tsx` );
    }

    // 6. Interface exported check
    const interfaceRegex = new RegExp( `export interface ${componentName}Props` );
    const interfaceExported = interfaceRegex.test( reactComponentCode );
    if ( !interfaceExported ) {
      failures.push( `Missing "export interface ${componentName}Props" in React component` );
    }

    // 7. Default export check
    const defaultExportPresent = /export default function/.test( reactComponentCode );
    if ( !defaultExportPresent ) {
      failures.push( 'Missing "export default function" in React component' );
    }

    // 8. declareComponent check
    const declareComponentPresent = webflowDeclarationCode.includes( 'declareComponent' );
    if ( !declareComponentPresent ) {
      failures.push( 'Missing "declareComponent" call in .webflow.tsx' );
    }

    // 9. Props grouped check
    const propBlocks = webflowDeclarationCode.match( /props\.\w+\(\{[^}]+\}/g ) || [];
    let propsGrouped = true;
    for ( const block of propBlocks ) {
      if ( !block.includes( 'group:' ) ) {
        propsGrouped = false;
        failures.push( `A prop declaration in .webflow.tsx is missing the "group:" field` );
        break;
      }
    }

    // 10. SSR flag check
    const usesBrowserAPIs = /\b(useState|useEffect|useRef|window\.|document\.)\b/.test( reactComponentCode );
    const hasSsrFalse = /ssr:\s*false/.test( webflowDeclarationCode );
    const ssrFlagCorrect = !usesBrowserAPIs || hasSsrFalse;
    if ( usesBrowserAPIs && !hasSsrFalse ) {
      failures.push( 'Component uses browser APIs (useState/useEffect/window/document) but .webflow.tsx does not set ssr: false' );
    }

    // 11. No code fences check
    const codeFencePattern = /^```[\w]*\s*$/m;
    let noCodeFences = true;
    for ( const [ label, code ] of [ [ 'React component', reactComponentCode ], [ 'CSS', cssCode ], [ 'Webflow declaration', webflowDeclarationCode ] ] ) {
      if ( codeFencePattern.test( code ) ) {
        noCodeFences = false;
        failures.push( `${label} contains markdown code fences (\`\`\`) — these must be stripped` );
      }
    }

    const checks = {
      classPrefixCorrect,
      typographyInherited,
      siteVariableFallbacks,
      noDesignSystemImports,
      cssImportInWebflow: cssImportCorrect,
      interfaceExported,
      defaultExportPresent,
      declareComponentPresent,
      propsGrouped,
      ssrFlagCorrect,
      noCodeFences,
    };

    const allPassed = Object.values( checks ).every( Boolean );

    return { allPassed, checks, failures };
  },
} );

// ─── Step 6: Generate main.tsx (LLM — Theme Preview) ────────────────────────

export const generateMainTsx = step( {
  name: 'generate_main_tsx',
  description: 'Generate the local dev entry point with theme preview system',
  inputSchema: GenerateMainTsxInputSchema,
  outputSchema: CodeOutputSchema,
  fn: async ( input ) => {
    const propsText = serializePropsForPrompt( input.props );

    const { result } = await generateText( {
      prompt: 'generate_main_tsx@v1',
      variables: {
        componentName: input.componentName,
        kebabName: input.kebabName,
        description: input.description,
        propsText,
        propsJson: JSON.stringify( input.props, null, 2 ),
      },
    } );

    return { code: stripCodeFences( result ) };
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );

// ─── Step 7: Generate README (LLM) ──────────────────────────────────────────

export const generateReadme = step( {
  name: 'generate_readme',
  description: 'Generate the README following the exact template structure',
  inputSchema: GenerateReadmeInputSchema,
  outputSchema: CodeOutputSchema,
  fn: async ( input ) => {
    const propsText = serializePropsForPrompt( input.props );
    const depsText = input.npmDependencies
      ? Object.entries( input.npmDependencies ).map( ( [ k, v ] ) => `- [${k}](https://www.npmjs.com/package/${k}) @ ${v}` ).join( '\n' )
      : 'None beyond React.';

    const { result } = await generateText( {
      prompt: 'generate_readme@v1',
      variables: {
        componentName: input.componentName,
        kebabName: input.kebabName,
        description: input.description,
        propsText,
        propsJson: JSON.stringify( input.props, null, 2 ),
        cssCode: input.cssCode,
        npmDependencies: depsText,
      },
    } );

    return { code: stripCodeFences( result ) };
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );

// ─── Step 8: Generate Simple Declaration (LLM) ──────────────────────────────

export const generateSimpleDeclaration = step( {
  name: 'generate_simple_declaration',
  description: 'Generate a simplified .webflow.tsx with only core content props for client use',
  inputSchema: GenerateSimpleDeclarationInputSchema,
  outputSchema: CodeOutputSchema,
  fn: async ( input ) => {
    const { result } = await generateText( {
      prompt: 'generate_simple_declaration@v1',
      variables: {
        componentName: input.componentName,
        kebabName: input.kebabName,
        description: input.description,
        group: input.group,
        fullDeclarationCode: input.fullDeclarationCode,
        reactComponentCode: input.reactComponentCode,
      },
    } );

    return { code: stripCodeFences( result ) };
  },
  options: {
    retry: { maximumAttempts: 3 },
  },
} );

// ─── Step 9: Write Files to Disk ─────────────────────────────────────────────

export const writeFiles = step( {
  name: 'write_files',
  description: 'Write generated component files to output/ directory inside the project',
  inputSchema: WriteFilesInputSchema,
  outputSchema: WriteFilesOutputSchema,
  fn: async ( input ) => {
    // Write to /app/output/<kebabName>/ inside the container,
    // which maps to webflow-code-components/output/<kebabName>/ on the host
    const outputDir = join( '/app', 'output', input.kebabName );

    let filesWritten = 0;
    for ( const [ relativePath, content ] of Object.entries( input.files ) ) {
      const fullPath = join( outputDir, relativePath );
      await mkdir( dirname( fullPath ), { recursive: true } );
      // Final safety net: strip any lingering code fences from source files
      const cleanContent = ( relativePath.endsWith( '.tsx' ) || relativePath.endsWith( '.ts' ) || relativePath.endsWith( '.css' ) )
        ? stripCodeFences( content )
        : content;
      await writeFile( fullPath, cleanContent, 'utf-8' );
      filesWritten++;
    }

    return { outputDir, filesWritten };
  },
} );
