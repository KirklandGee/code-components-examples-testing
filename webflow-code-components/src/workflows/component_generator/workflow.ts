import { workflow, z } from '@output.ai/core';
import { toKebabCase, buildDeterministicFeedback } from './utils.js';
import {
  generateScaffold,
  generateReactComponent,
  generateComponentCSS,
  generateWebflowDeclaration,
  runDeterministicChecks,
  generateMainTsx,
  generateReadme,
  generateSimpleDeclaration,
  writeFiles,
} from './steps.js';
import { evaluateComponent } from './evaluators.js';
import { WorkflowInputSchema, WorkflowOutputSchema } from './types.js';
import type { DeterministicChecks } from './types.js';

const MAX_ITERATIONS = 3;
const MIN_SCORE = 90;

export default workflow( {
  name: 'component_generator',
  description: 'Generate a complete Webflow code component directory from a specification',
  inputSchema: WorkflowInputSchema,
  outputSchema: WorkflowOutputSchema,
  fn: async ( input ) => {
    const kebabName = toKebabCase( input.componentName );
    const group = input.group ?? 'Components';

    // Step 1: Generate scaffold files (pure templates, outside loop)
    const scaffoldFiles = await generateScaffold( {
      componentName: input.componentName,
      kebabName,
      description: input.description,
      npmDependencies: input.npmDependencies,
    } );

    // Step 2: Generate + Verify Loop (max 3 iterations)
    let reactCode = '';
    let cssCode = '';
    let webflowCode = '';
    let deterministicChecks: DeterministicChecks = {
      classPrefixCorrect: false,
      typographyInherited: false,
      siteVariableFallbacks: false,
      noDesignSystemImports: false,
      cssImportInWebflow: false,
      interfaceExported: false,
      defaultExportPresent: false,
      declareComponentPresent: false,
      propsGrouped: false,
      ssrFlagCorrect: false,
      noCodeFences: false,
    };
    let llmScore = 0;
    let iterations = 0;
    let feedback = '';

    for ( let i = 0; i < MAX_ITERATIONS; i++ ) {
      iterations = i + 1;

      // Generate the three core files
      const reactResult = await generateReactComponent( {
        componentName: input.componentName,
        kebabName,
        description: input.description,
        props: input.props,
        npmDependencies: input.npmDependencies,
        feedback,
      } );
      reactCode = reactResult.code;

      const cssResult = await generateComponentCSS( {
        componentName: input.componentName,
        kebabName,
        description: input.description,
        props: input.props,
        reactComponentCode: reactCode,
        feedback,
      } );
      cssCode = cssResult.code;

      const webflowResult = await generateWebflowDeclaration( {
        componentName: input.componentName,
        kebabName,
        description: input.description,
        props: input.props,
        group,
        reactComponentCode: reactCode,
        feedback,
      } );
      webflowCode = webflowResult.code;

      // Tier 1: Deterministic checks (instant, free)
      const checkResults = await runDeterministicChecks( {
        componentName: input.componentName,
        kebabName,
        reactComponentCode: reactCode,
        cssCode,
        webflowDeclarationCode: webflowCode,
      } );
      deterministicChecks = checkResults.checks;

      // If deterministic checks fail, build feedback and continue loop
      if ( !checkResults.allPassed ) {
        feedback = buildDeterministicFeedback( checkResults );
        continue;
      }

      // Tier 2: LLM judge (only if deterministic checks pass)
      const evalResult = await evaluateComponent( {
        componentName: input.componentName,
        kebabName,
        description: input.description,
        reactComponentCode: reactCode,
        cssCode,
        webflowDeclarationCode: webflowCode,
      } );
      llmScore = evalResult.value;

      if ( llmScore >= MIN_SCORE ) {
        break; // Quality gate passed
      }

      // Build feedback from LLM evaluation for next iteration
      feedback = evalResult.reasoning ?? `Score was ${llmScore}/100. Needs improvement to reach ${MIN_SCORE}.`;
    }

    // Step 3: Generate main.tsx with theme preview (outside loop)
    const mainResult = await generateMainTsx( {
      componentName: input.componentName,
      kebabName,
      description: input.description,
      props: input.props,
    } );

    // Step 4: Generate README (outside loop, depends on final CSS)
    const readmeResult = await generateReadme( {
      componentName: input.componentName,
      kebabName,
      description: input.description,
      props: input.props,
      cssCode,
      npmDependencies: input.npmDependencies,
    } );

    // Step 5: Generate simple declaration (client-friendly prop subset)
    const simpleResult = await generateSimpleDeclaration( {
      componentName: input.componentName,
      kebabName,
      description: input.description,
      group,
      fullDeclarationCode: webflowCode,
      reactComponentCode: reactCode,
    } );

    // Assemble all files into the output map
    const componentDir = `src/components/${input.componentName}`;
    const files: Record<string, string> = {
      ...scaffoldFiles,
      'src/main.tsx': mainResult.code,
      [`${componentDir}/${input.componentName}.tsx`]: reactCode,
      [`${componentDir}/${input.componentName}.css`]: cssCode,
      [`${componentDir}/${input.componentName}.webflow.tsx`]: webflowCode,
      [`${componentDir}/${input.componentName}Simple.webflow.tsx`]: simpleResult.code,
      'README.md': readmeResult.code,
    };

    // Step 6: Write files to disk
    await writeFiles( { kebabName, files } );

    return {
      componentName: input.componentName,
      kebabName,
      files,
      evaluation: {
        score: llmScore,
        iterations,
        deterministicChecks,
      },
    };
  },
  options: {
    retry: {
      maximumAttempts: 2,
    },
  },
} );
