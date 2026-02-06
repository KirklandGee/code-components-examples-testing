import { z } from '@output.ai/core';

// ─── Prop Schema ─────────────────────────────────────────────────────────────

export const PropSchema = z.object( {
  name: z.string().describe( 'Prop name in camelCase' ),
  type: z.enum( [
    'Id', 'Variant', 'Boolean', 'Visibility', 'Number',
    'Text', 'TextNode', 'RichText', 'Slot', 'Image', 'Link'
  ] ).describe( 'Webflow prop type from @webflow/data-types' ),
  description: z.string().describe( 'What this prop controls' ),
  options: z.array( z.string() ).optional().describe( 'Options for Variant props' ),
  defaultValue: z.union( [ z.string(), z.number(), z.boolean() ] ).optional().describe( 'Default value' ),
  group: z.string().optional().describe( 'Prop group in Designer panel (e.g. Settings, Style, Display, Content, Behavior, or custom like "Tier 1")' ),
} );

// ─── Workflow Input / Output ─────────────────────────────────────────────────

export const WorkflowInputSchema = z.object( {
  componentName: z.string().describe( 'PascalCase component name, e.g. "PricingTable"' ),
  description: z.string().describe( 'What the component does, its features, behaviors' ),
  props: z.array( PropSchema ).describe( 'Component props to expose in Webflow Designer' ),
  npmDependencies: z.record( z.string(), z.string() ).optional().describe( 'Additional npm packages, e.g. {"swiper": "^11.0.0"}' ),
  group: z.string().optional().default( 'Components' ).describe( 'Webflow component group/category' ),
} );

export const DeterministicChecksSchema = z.object( {
  classPrefixCorrect: z.boolean(),
  typographyInherited: z.boolean(),
  siteVariableFallbacks: z.boolean(),
  noDesignSystemImports: z.boolean(),
  cssImportInWebflow: z.boolean(),
  interfaceExported: z.boolean(),
  defaultExportPresent: z.boolean(),
  declareComponentPresent: z.boolean(),
  propsGrouped: z.boolean(),
  ssrFlagCorrect: z.boolean(),
  noCodeFences: z.boolean(),
} );

export const EvaluationSchema = z.object( {
  score: z.number(),
  iterations: z.number(),
  deterministicChecks: DeterministicChecksSchema,
} );

export const WorkflowOutputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  files: z.record( z.string(), z.string() ).describe( 'Map of relative file paths to file contents' ),
  evaluation: EvaluationSchema,
} );

// ─── Step Schemas ────────────────────────────────────────────────────────────

export const GenerateScaffoldInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  npmDependencies: z.record( z.string(), z.string() ).optional(),
} );

export const GenerateScaffoldOutputSchema = z.record( z.string(), z.string() );

export const GenerateReactComponentInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  props: z.array( PropSchema ),
  npmDependencies: z.record( z.string(), z.string() ).optional(),
  feedback: z.string().optional().default( '' ),
} );

export const CodeOutputSchema = z.object( {
  code: z.string().describe( 'The complete source code' ),
} );

export const GenerateComponentCSSInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  props: z.array( PropSchema ),
  reactComponentCode: z.string(),
  feedback: z.string().optional().default( '' ),
} );

export const GenerateWebflowDeclarationInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  props: z.array( PropSchema ),
  group: z.string(),
  reactComponentCode: z.string(),
  feedback: z.string().optional().default( '' ),
} );

export const GenerateMainTsxInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  props: z.array( PropSchema ),
} );

export const GenerateReadmeInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  props: z.array( PropSchema ),
  cssCode: z.string(),
  npmDependencies: z.record( z.string(), z.string() ).optional(),
} );

// ─── Simple Declaration Step Schema ─────────────────────────────────────────

export const GenerateSimpleDeclarationInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  group: z.string(),
  fullDeclarationCode: z.string(),
  reactComponentCode: z.string(),
} );

// ─── Write Files Step Schema ─────────────────────────────────────────────────

export const WriteFilesInputSchema = z.object( {
  kebabName: z.string().describe( 'Kebab-case name used as the output directory name' ),
  files: z.record( z.string(), z.string() ).describe( 'Map of relative file paths to file contents' ),
} );

export const WriteFilesOutputSchema = z.object( {
  outputDir: z.string().describe( 'Absolute path to the written component directory' ),
  filesWritten: z.number().describe( 'Number of files written' ),
} );

// ─── Deterministic Checks Schemas ────────────────────────────────────────────

export const RunDeterministicChecksInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  reactComponentCode: z.string(),
  cssCode: z.string(),
  webflowDeclarationCode: z.string(),
} );

export const RunDeterministicChecksOutputSchema = z.object( {
  allPassed: z.boolean(),
  checks: DeterministicChecksSchema,
  failures: z.array( z.string() ),
} );

// ─── Evaluator Schemas ──────────────────────────────────────────────────────

export const EvaluateComponentInputSchema = z.object( {
  componentName: z.string(),
  kebabName: z.string(),
  description: z.string(),
  reactComponentCode: z.string(),
  cssCode: z.string(),
  webflowDeclarationCode: z.string(),
} );

export const EvaluationCriterionSchema = z.object( {
  score: z.number().min( 0 ).max( 100 ),
  notes: z.string(),
} );

export const EvaluationResultSchema = z.object( {
  score: z.number().min( 0 ).max( 100 ),
  reasoning: z.string(),
  criteria: z.object( {
    functionalityCompleteness: EvaluationCriterionSchema,
    propWiring: EvaluationCriterionSchema,
    cssCompleteness: EvaluationCriterionSchema,
    semanticHtml: EvaluationCriterionSchema,
    accessibility: EvaluationCriterionSchema,
    codeQuality: EvaluationCriterionSchema,
  } ),
} );

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type Prop = z.infer<typeof PropSchema>;
export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;
export type DeterministicChecks = z.infer<typeof DeterministicChecksSchema>;
export type DeterministicChecksResult = z.infer<typeof RunDeterministicChecksOutputSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
