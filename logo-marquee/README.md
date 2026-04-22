# LogoMarquee
An infinite horizontal scrolling strip of client / partner / press logos — the classic 'trusted by' trust bar.

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
| ID | Id | — | HTML ID for targeting with CSS or JavaScript |
| Heading | TextNode | Trusted by teams at | Optional heading above the logo strip (e.g. 'Trusted by') |
| Show Heading | Boolean | true | Show or hide the heading |
| Direction | Variant | left | Direction of the marquee scroll (left or right) |
| Speed | Number | 40 | Duration of one full loop in seconds — lower is faster |
| Pause On Hover | Boolean | true | Pause the animation while the user is hovering the marquee |
| Grayscale | Boolean | true | Render logos in grayscale; they regain color on hover |
| Fade Edges | Boolean | true | Fade the left and right edges to transparent using a CSS mask |
| Logo Height | Number | 40 | Height of each logo in pixels (width scales proportionally) |
| Logo Gap | Number | 64 | Gap between logos in pixels |
| ARIA Label | Text | Partner and customer logos | Accessible label describing the marquee for screen readers |
| Logo 1–12 | Image | — | Logo images (12 slots available) |
| Logo 1–12 Link | Link | — | Optional links for each logo |
| Logo 1–12 Visible | Visibility | — | Show or hide individual logos |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --text-primary | Heading text color | #1a1a1a |
| --text-secondary | Logo default color (when grayscale is off) | — |
| --background-primary | Component background | — |
| --border-color | Optional borders or dividers | — |
| --accent-color | Logo hover accent and focus outline color | #1a1a1a |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Adjusting Animation Speed Per Breakpoint

You can override the speed property at different screen sizes by targeting the component with custom CSS:

```css
@media (max-width: 768px) {
  #my-marquee .wf-logomarquee-track {
    animation-duration: 25s !important; /* Faster on mobile */
  }
}
```

### Custom Edge Fade Gradient

Replace the default fade-to-transparent mask with a custom gradient:

```css
.wf-logomarquee--fade-edges .wf-logomarquee-container {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}
```

## Dependencies

No external dependencies.