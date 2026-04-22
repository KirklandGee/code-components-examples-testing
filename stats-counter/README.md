# StatsCounter

A horizontal or grid bar of animated stat counters with smooth count-up animations triggered on scroll.

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
| Layout | Variant | row | Arrangement of stats — row (horizontal) or grid (wraps on narrow screens) |
| Alignment | Variant | center | Text alignment within each stat cell |
| Divider Style | Variant | line | Visual separator between stats (none, line, or dot) |
| Number Size | Variant | large | Size scale for the big stat number (medium, large, or xlarge) |
| Heading | TextNode | By the Numbers | Optional main heading above the stats |
| Subheading | Text | A snapshot of what we've built together | Optional subheading below the main heading |
| Show Heading | Boolean | true | Show or hide the heading and subheading block |
| Animation Duration | Number | 2000 | Count-up animation duration in milliseconds |
| Animate On Scroll | Boolean | true | Trigger the animation when the component scrolls into view (otherwise animate on mount) |
| Animate Once | Boolean | true | Only animate the first time the component enters the viewport |
| Stat 1 Value | Number | 12000 | First stat target value (the number the counter counts up to) |
| Stat 1 Prefix | Text | — | Text shown before the number (e.g. $, ~) |
| Stat 1 Suffix | Text | + | Text shown after the number (e.g. +, %, K, M, /mo) |
| Stat 1 Label | Text | Happy customers | Short label shown below the number |
| Stat 1 Description | Text | Across 40 countries | Optional supporting caption below the label |
| Stat 1 Visible | Visibility | — | Show or hide the first stat |
| Stat 2 Value | Number | 98 | Second stat target value |
| Stat 2 Prefix | Text | — | Text shown before the number |
| Stat 2 Suffix | Text | % | Text shown after the number |
| Stat 2 Label | Text | Customer satisfaction | Short label shown below the number |
| Stat 2 Description | Text | Based on annual NPS survey | Optional supporting caption below the label |
| Stat 2 Visible | Visibility | — | Show or hide the second stat |
| Stat 3 Value | Number | 250 | Third stat target value |
| Stat 3 Prefix | Text | $ | Text shown before the number |
| Stat 3 Suffix | Text | M | Text shown after the number |
| Stat 3 Label | Text | Funding raised | Short label shown below the number |
| Stat 3 Description | Text | Series C lead by Sequoia | Optional supporting caption below the label |
| Stat 3 Visible | Visibility | — | Show or hide the third stat |
| Stat 4 Value | Number | 150 | Fourth stat target value |
| Stat 4 Prefix | Text | — | Text shown before the number |
| Stat 4 Suffix | Text | — | Text shown after the number |
| Stat 4 Label | Text | Team members | Short label shown below the number |
| Stat 4 Description | Text | Remote-first across 12 time zones | Optional supporting caption below the label |
| Stat 4 Visible | Visibility | — | Show or hide the fourth stat |
| Stat 5 Value | Number | 0 | Fifth stat target value |
| Stat 5 Prefix | Text | — | Text shown before the number |
| Stat 5 Suffix | Text | — | Text shown after the number |
| Stat 5 Label | Text | Awards won | Short label shown below the number |
| Stat 5 Description | Text | — | Optional supporting caption below the label |
| Stat 5 Visible | Visibility | — | Show or hide the fifth stat |
| Stat 6 Value | Number | 0 | Sixth stat target value |
| Stat 6 Prefix | Text | — | Text shown before the number |
| Stat 6 Suffix | Text | — | Text shown after the number |
| Stat 6 Label | Text | — | Short label shown below the number |
| Stat 6 Description | Text | — | Optional supporting caption below the label |
| Stat 6 Visible | Visibility | — | Show or hide the sixth stat |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Component background color | (none) |
| --text-primary | Main text color for numbers and labels | #1a1a1a |
| --text-secondary | Subheading and description text color | #737373 |
| --border-color | Divider lines and dots color | #e5e5e5 |
| --accent-color | Number color emphasis | #1a1a1a |
| --border-radius | Corner rounding | (none) |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Animation Easing

Modify the easing function for different animation feels:

```typescript
// In your component code, replace easeOutExpo with a custom easing
const easeInOutCubic = (t: number) => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
```

### Formatting Large Numbers

Add custom number formatting for thousands separators:

```typescript
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(Math.floor(value));
};
```

## Dependencies

No external dependencies.