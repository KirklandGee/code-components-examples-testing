import type { Prop, DeterministicChecksResult } from './types.js';

/**
 * Convert PascalCase to kebab-case.
 * "PricingTable" → "pricing-table"
 */
export function toKebabCase( str: string ): string {
  return str
    .replace( /([a-z0-9])([A-Z])/g, '$1-$2' )
    .replace( /([A-Z])([A-Z][a-z])/g, '$1-$2' )
    .toLowerCase();
}

/**
 * Convert PascalCase to lowercase component prefix for CSS classes.
 * "PricingTable" → "pricingtable"
 * Used for wf-pricingtable- CSS class prefix.
 */
export function toClassPrefix( str: string ): string {
  return str.toLowerCase();
}

/**
 * Serialize props array to a readable string for LLM prompt context.
 */
export function serializePropsForPrompt( props: Prop[] ): string {
  return props.map( p => {
    let line = `- ${p.name}: ${p.type}`;
    if ( p.options ) line += ` [${p.options.join( ', ' )}]`;
    if ( p.defaultValue !== undefined ) line += ` (default: ${p.defaultValue})`;
    if ( p.group ) line += ` [group: ${p.group}]`;
    line += ` — ${p.description}`;
    return line;
  } ).join( '\n' );
}

/**
 * Build human-readable feedback from deterministic check failures.
 */
/**
 * Strip markdown code fences from LLM output.
 * Removes leading ```typescript, ```tsx, ```css, ```json, ```markdown, ``` etc. and trailing ```.
 */
export function stripCodeFences( code: string ): string {
  let result = code.trim();
  // Remove leading code fence (```lang or just ```)
  result = result.replace( /^```[\w]*\s*\n?/, '' );
  // Remove trailing code fence
  result = result.replace( /\n?```\s*$/, '' );
  return result;
}

export function buildDeterministicFeedback( result: DeterministicChecksResult ): string {
  if ( result.failures.length === 0 ) return '';
  return `The following deterministic checks FAILED. You MUST fix each one:\n\n${result.failures.map( ( f, i ) => `${i + 1}. ${f}` ).join( '\n' )}`;
}

/**
 * Generate the scaffold files that are identical across all components.
 * Pure string templates — no LLM needed.
 */
export function buildScaffoldFiles( input: {
  componentName: string;
  kebabName: string;
  description: string;
  npmDependencies?: Record<string, string>;
} ): Record<string, string> {
  const { componentName, kebabName, description, npmDependencies } = input;

  const baseDeps: Record<string, string> = {
    'react': '^19.1.1',
    'react-dom': '^19.1.1',
    ...( npmDependencies || {} ),
  };

  const packageJson = JSON.stringify( {
    name: kebabName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc -b && vite build',
      preview: 'vite preview',
    },
    dependencies: baseDeps,
    devDependencies: {
      '@types/react': '^19.1.13',
      '@types/react-dom': '^19.1.9',
      '@vitejs/plugin-react': '^5.0.3',
      '@webflow/data-types': '^1.0.1',
      '@webflow/react': '^1.0.1',
      '@webflow/webflow-cli': '^1.8.44',
      'typescript': '~5.8.3',
      'vite': '^7.1.7',
    },
  }, null, 2 );

  const webflowJson = JSON.stringify( {
    library: {
      name: componentName,
      components: [ './src/**/*.webflow.@(js|jsx|mjs|ts|tsx)' ],
      description,
      id: kebabName,
    },
  }, null, 2 );

  const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;

  const tsconfigJson = JSON.stringify( {
    files: [],
    references: [
      { path: './tsconfig.app.json' },
      { path: './tsconfig.node.json' },
    ],
  }, null, 2 );

  const tsconfigAppJson = JSON.stringify( {
    compilerOptions: {
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.app.tsBuildInfo',
      target: 'ES2022',
      useDefineForClassFields: true,
      lib: [ 'ES2022', 'DOM', 'DOM.Iterable' ],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      verbatimModuleSyntax: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedSideEffectImports: true,
    },
    include: [ 'src' ],
  }, null, 2 );

  const tsconfigNodeJson = JSON.stringify( {
    compilerOptions: {
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.node.tsBuildInfo',
      target: 'ES2023',
      lib: [ 'ES2023' ],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      verbatimModuleSyntax: true,
      noEmit: true,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedSideEffectImports: true,
    },
    include: [ 'vite.config.ts' ],
  }, null, 2 );

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${componentName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  return {
    'package.json': packageJson,
    'webflow.json': webflowJson,
    'vite.config.ts': viteConfig,
    'tsconfig.json': tsconfigJson,
    'tsconfig.app.json': tsconfigAppJson,
    'tsconfig.node.json': tsconfigNodeJson,
    'index.html': indexHtml,
  };
}
