# PricingTable

A responsive pricing table with 3 tiers displayed as cards. Each tier shows a name, price, billing period, description, feature list, and CTA button with link. Supports highlighting a recommended tier with a visual accent badge. Cards stack vertically on mobile and display horizontally on desktop.

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
| Layout | Variant | horizontal | Card arrangement direction (horizontal or vertical) |
| Heading | TextNode | Choose Your Plan | Main heading above the pricing cards |
| Subheading | Text | Select the perfect plan for your needs | Subheading text below the main heading |
| Tier 1 Name | Text | Basic | First tier plan name |
| Tier 1 Price | Text | $9 | First tier price display |
| Tier 1 Period | Text | /month | First tier billing period |
| Tier 1 Description | Text | Perfect for getting started | First tier short description |
| Tier 1 Features | Text | Up to 5 projects\nBasic support\n1GB storage\nEmail notifications | First tier features, one per line |
| Tier 1 CTA Text | Text | Get Started | First tier call-to-action button text |
| Tier 1 CTA Link | Link | — | First tier call-to-action button link |
| Tier 1 Visible | Visibility | — | Show or hide the first tier |
| Tier 2 Name | Text | Professional | Second tier plan name |
| Tier 2 Price | Text | $29 | Second tier price display |
| Tier 2 Period | Text | /month | Second tier billing period |
| Tier 2 Description | Text | Most popular choice | Second tier short description |
| Tier 2 Features | Text | Unlimited projects\nPriority support\n10GB storage\nAdvanced analytics\nTeam collaboration\nCustom integrations | Second tier features, one per line |
| Tier 2 CTA Text | Text | Start Free Trial | Second tier call-to-action button text |
| Tier 2 CTA Link | Link | — | Second tier call-to-action button link |
| Tier 2 Recommended | Boolean | true | Show recommended badge on this tier |
| Tier 2 Visible | Visibility | — | Show or hide the second tier |
| Tier 3 Name | Text | Enterprise | Third tier plan name |
| Tier 3 Price | Text | $99 | Third tier price display |
| Tier 3 Period | Text | /month | Third tier billing period |
| Tier 3 Description | Text | For large organizations | Third tier short description |
| Tier 3 Features | Text | Everything in Pro\nDedicated support\nUnlimited storage\nAdvanced security\nCustom workflows\nSLA guarantee | Third tier features, one per line |
| Tier 3 CTA Text | Text | Contact Sales | Third tier call-to-action button text |
| Tier 3 CTA Link | Link | — | Third tier call-to-action button link |
| Tier 3 Visible | Visibility | — | Show or hide the third tier |
| Badge Text | Text | Most Popular | Text shown on the recommended tier badge |
| Footer Text | Text | All plans include 24/7 support and 30-day money-back guarantee | Optional footer text below the pricing cards |
| Show Footer | Boolean | true | Show or hide the footer text |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Card background color | #ffffff |
| --background-secondary | Hover state backgrounds | — |
| --text-primary | Headings and main text color | #1a1a1a |
| --text-secondary | Subheadings and descriptions color | #737373 |
| --border-color | Card borders and dividers | #e5e5e5 |
| --accent-color | Recommended badge and CTA button background | #1a1a1a |
| --accent-text-color | Text color on accent backgrounds | #ffffff |
| --border-radius | Card and button corner rounding | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Tier Visibility Logic

Control which tiers display based on user authentication or subscription status:

```javascript
// Show enterprise tier only for authenticated users
const showEnterprise = user?.role === 'admin';
<PricingTable tier3Visible={showEnterprise} />
```

### Dynamic Pricing Based on Billing Cycle

Update prices and periods based on annual vs. monthly selection:

```javascript
const [isAnnual, setIsAnnual] = useState(false);

<PricingTable
  tier1Price={isAnnual ? '$90' : '$9'}
  tier1Period={isAnnual ? '/year' : '/month'}
  tier2Price={isAnnual ? '$290' : '$29'}
  tier2Period={isAnnual ? '/year' : '/month'}
  tier3Price={isAnnual ? '$990' : '$99'}
  tier3Period={isAnnual ? '/year' : '/month'}
/>
```

## Dependencies

No external dependencies.