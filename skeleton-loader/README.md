# SkeletonLoader
An animated placeholder component that displays shimmer-loading shapes while content loads.

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
| ID | Id | — | HTML ID attribute for targeting |
| Variant | Variant | text | Primary skeleton shape type (text, circular, rectangular) |
| Text Line Count | Number | 3 | Number of text lines to display (1-6) |
| Width | Text | 100% | Width of rectangular or circular shape (CSS value) |
| Height | Text | 200px | Height of rectangular shape (CSS value) |
| Circle Size | Text | 64px | Diameter of circular shape (CSS value) |
| Show Circle | Visibility | — | Show or hide circular avatar placeholder |
| Show Rectangle | Visibility | — | Show or hide rectangular image placeholder |
| Show Text Lines | Visibility | — | Show or hide text line placeholders |
| Enable Animation | Boolean | true | Enable or disable shimmer animation |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-secondary | Skeleton base color | #f5f5f5 |
| --border-color | Shimmer highlight color | #e5e5e5 |
| --border-radius | Corner rounding for shapes | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Creating a Card Skeleton

Combine multiple shape types to create a realistic card loading state:

```javascript
// Set variant to "text" and configure visibility props:
// - Show Rectangle: true (for card image)
// - Show Circle: true (for avatar)
// - Show Text Lines: true (for content)
// - Text Line Count: 4
// - Height: 180px (for card image)
// - Circle Size: 48px (for small avatar)
```

### Custom Loading States

Disable animation for a static placeholder or adjust timing:

```css
/* Slower shimmer animation */
.wf-skeletonloader-animated .wf-skeletonloader-circle::after,
.wf-skeletonloader-animated .wf-skeletonloader-rectangle::after,
.wf-skeletonloader-animated .wf-skeletonloader-text-line::after {
  animation-duration: 3s;
}

/* Custom pulse timing */
.wf-skeletonloader:not(.wf-skeletonloader-animated) .wf-skeletonloader-circle {
  animation-duration: 1.5s;
}
```

## Dependencies

No external dependencies.