# HeroSection

A responsive hero section featuring a large headline, subheading, call-to-action button, and optional background image.

## Getting Started

Install dependencies:
```bash
npm install
```

Share the component to your Webflow workspace:
```bash
npx webflow library share
```

For local development:
```bash
npm run dev
```

## Designer Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| ID | Id | — | HTML ID attribute for targeting and anchoring |
| Layout | Variant | centered | Content alignment layout (left, centered) |
| Size | Variant | large | Hero section height (medium, large, full) |
| Headline | TextNode | Build Something Amazing | Main hero headline text |
| Subheading | Text | Create powerful experiences that drive results and delight your customers | Supporting subheading text below headline |
| CTA Text | Text | Get Started | Primary CTA button text |
| CTA Link | Link | — | Primary CTA button destination |
| Show Secondary CTA | Visibility | — | Show or hide the secondary CTA button |
| Secondary CTA Text | Text | Learn More | Secondary CTA button text |
| Secondary CTA Link | Link | — | Secondary CTA button destination |
| Show Background Image | Boolean | false | Enable or disable background image |
| Background Image | Image | — | Hero section background image URL |
| Overlay Opacity | Variant | medium | Background overlay darkness level (none, light, medium, dark) |
| Show Badge | Visibility | — | Show or hide the badge above headline |
| Badge Text | Text | New Release | Small badge text above headline |
| Content Max Width | Variant | medium | Maximum width of content area (narrow, medium, wide) |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Hero section background color and badge background | #ffffff |
| --background-secondary | Secondary CTA button hover background | #f5f5f5 |
| --text-primary | Headline, badge, and secondary button text color | #1a1a1a |
| --text-secondary | Subheading text color | #737373 |
| --border-color | Badge and secondary button border color | #e5e5e5 |
| --accent-color | Primary CTA button background and focus outline | #1a1a1a |
| --accent-text-color | Primary CTA button text color | #ffffff |
| --border-radius | Button and badge corner rounding | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Content Width Variants

Adjust the content max-width for different layout needs:

```javascript
// In your component's CSS
.wf-herosection-content-narrow {
  --wf-herosection-content-max-width: 600px;
}

.wf-herosection-content-medium {
  --wf-herosection-content-max-width: 800px;
}

.wf-herosection-content-wide {
  --wf-herosection-content-max-width: 1000px;
}
```

### Custom Overlay Opacity Levels

Fine-tune the background overlay darkness:

```javascript
// In your component's CSS
.wf-herosection-overlay-none {
  --wf-herosection-overlay-opacity: 0;
}

.wf-herosection-overlay-light {
  --wf-herosection-overlay-opacity: 0.3;
}

.wf-herosection-overlay-medium {
  --wf-herosection-overlay-opacity: 0.5;
}

.wf-herosection-overlay-dark {
  --wf-herosection-overlay-opacity: 0.7;
}
```

## Dependencies

No external dependencies.