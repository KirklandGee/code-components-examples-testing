# Accordion
A fully accessible accordion component that displays collapsible content sections with smooth slide animations.

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
| ID | Id | — | HTML ID attribute for targeting and accessibility |
| Variant | Variant | bordered | Visual style of the accordion (bordered or flush) |
| Expansion Mode | Variant | single | Controls whether multiple sections can be open at once (single or multiple) |
| Item 1 Visible | Visibility | — | Show or hide the first accordion item |
| Item 1 Title | Text | What is your return policy? | Header title for the first accordion item |
| Item 1 Content | RichText | We offer a 30-day money-back guarantee... | Body content for the first accordion item |
| Item 2 Visible | Visibility | — | Show or hide the second accordion item |
| Item 2 Title | Text | How long does shipping take? | Header title for the second accordion item |
| Item 2 Content | RichText | Standard shipping typically takes... | Body content for the second accordion item |
| Item 3 Visible | Visibility | — | Show or hide the third accordion item |
| Item 3 Title | Text | Do you offer international shipping? | Header title for the third accordion item |
| Item 3 Content | RichText | Yes, we ship to over 50 countries... | Body content for the third accordion item |
| Item 4 Visible | Visibility | — | Show or hide the fourth accordion item |
| Item 4 Title | Text | How can I track my order? | Header title for the fourth accordion item |
| Item 4 Content | RichText | Once your order ships, you'll receive... | Body content for the fourth accordion item |
| Item 5 Visible | Visibility | — | Show or hide the fifth accordion item |
| Item 5 Title | Text | What payment methods do you accept? | Header title for the fifth accordion item |
| Item 5 Content | RichText | We accept all major credit cards... | Body content for the fifth accordion item |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Accordion item background color | #ffffff |
| --background-secondary | Button hover state background | #f5f5f5 |
| --text-primary | Title and content text color | #1a1a1a |
| --text-secondary | Muted text elements color | — |
| --border-color | Item borders and dividers | #e5e5e5 |
| --accent-color | Focus outline and link color | #1a1a1a |
| --border-radius | Corner rounding for bordered variant | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Animation Duration
Modify the slide animation speed by targeting the content wrapper:
```css
.wf-accordion-content {
  transition: max-height 0.5s ease-in-out;
}
```

### Adjust Item Spacing
Control the padding around accordion items:
```css
.wf-accordion-button {
  padding: 20px 24px;
}
.wf-accordion-body {
  padding: 0 24px 24px 24px;
}
```

## Dependencies

No external dependencies.