import { z } from '@output.ai/core';

// Re-use the PropSchema from component_generator for output compatibility
export const PropSchema = z.object( {
  name: z.string().describe( 'Prop name in camelCase' ),
  type: z.enum( [
    'Id', 'Variant', 'Boolean', 'Visibility', 'Number',
    'Text', 'TextNode', 'RichText', 'Slot', 'Image', 'Link'
  ] ).describe( 'Webflow prop type from @webflow/data-types' ),
  description: z.string().describe( 'What this prop controls' ),
  options: z.array( z.string() ).optional().describe( 'Options for Variant props' ),
  defaultValue: z.union( [ z.string(), z.number(), z.boolean() ] ).optional().describe( 'Default value' ),
  group: z.string().optional().describe( 'Prop group in Designer panel' ),
} );

// ─── API Integration Schema ────────────────────────────────────────────────

export const ApiIntegrationSchema = z.object( {
  service: z.string().describe( 'Service name, e.g. "Greenhouse", "OpenWeatherMap"' ),
  endpoint: z.string().describe( 'Full API endpoint URL pattern with placeholders, e.g. "https://boards-api.greenhouse.io/v1/boards/{boardToken}/jobs?content=true"' ),
  authMethod: z.enum( [ 'none', 'api-key-header', 'api-key-query', 'path-token', 'bearer-token' ] ).describe( 'How the API authenticates' ),
  authParamName: z.string().optional().describe( 'Name of the auth header or query param, e.g. "appid" or "Authorization"' ),
  requiredParams: z.record( z.string(), z.string() ).optional().describe( 'Required query parameters and their purpose' ),
  responseShape: z.string().describe( 'TypeScript interface of the API response — include optional fields with ? suffix' ),
  notes: z.string().optional().describe( 'Important notes: optional fields, pagination, rate limits, CORS, etc.' ),
} );

// ─── Workflow Input ─────────────────────────────────────────────────────────

export const WorkflowInputSchema = z.object( {
  description: z.string().describe( 'Plain English description of the component to build. Can be a sentence or a paragraph.' ),
  complexity: z.enum( [ 'simple', 'standard', 'complex' ] ).optional().default( 'standard' ).describe(
    'Complexity hint: simple (~5-10 props, basic UI), standard (~15-25 props), complex (~25-40 props, multiple sections/interactions)'
  ),
} );

// ─── Spec Output (before API research) ──────────────────────────────────────

export const BaseSpecSchema = z.object( {
  componentName: z.string().describe( 'PascalCase component name' ),
  description: z.string().describe( 'Detailed component description with features and behaviors' ),
  props: z.array( PropSchema ).describe( 'Complete props array ready for component_generator' ),
  npmDependencies: z.record( z.string(), z.string() ).optional().describe( 'Any npm packages needed' ),
  group: z.string().describe( 'Webflow component group/category' ),
} );

// ─── Workflow Output (matches component_generator input) ────────────────────

export const WorkflowOutputSchema = BaseSpecSchema.extend( {
  apiIntegrations: z.array( ApiIntegrationSchema ).optional().describe( 'External API integrations with verified response shapes' ),
} );

// ─── Step Schemas ───────────────────────────────────────────────────────────

export const GenerateSpecInputSchema = z.object( {
  description: z.string(),
  complexity: z.string(),
} );

export const GenerateSpecOutputSchema = BaseSpecSchema;

export const ResearchApiInputSchema = z.object( {
  description: z.string().describe( 'Component description' ),
  componentName: z.string(),
  props: z.array( PropSchema ),
} );

export const ResearchApiOutputSchema = z.object( {
  hasApis: z.boolean().describe( 'Whether the component involves external APIs' ),
  integrations: z.array( ApiIntegrationSchema ).describe( 'API integrations (empty if hasApis is false)' ),
} );

// ─── Inferred Types ─────────────────────────────────────────────────────────

export type Prop = z.infer<typeof PropSchema>;
export type ApiIntegration = z.infer<typeof ApiIntegrationSchema>;
export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;
