# FaqAccordion
A vertically stacked accordion component designed for FAQ sections with 5-6 collapsible items.

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
| Heading | TextNode | Frequently Asked Questions | Main heading displayed above the accordion |
| Subheading | Text | Find answers to common questions about our service | Optional subheading below the main heading |
| Icon Position | Variant | right | Position of the expand/collapse icon (left or right) |
| Default Open | Number | 1 | Index of the item to open by default (1-6, or 0 for none) |
| Item 1 Question | Text | What is your return policy? | First item question text |
| Item 1 Answer | RichText | We offer a 30-day money-back guarantee... | First item answer content with formatting support |
| Item 1 Visible | Visibility | — | Show or hide the first accordion item |
| Item 2 Question | Text | How long does shipping take? | Second item question text |
| Item 2 Answer | RichText | Standard shipping typically takes 5-7 business days... | Second item answer content with formatting support |
| Item 2 Visible | Visibility | — | Show or hide the second accordion item |
| Item 3 Question | Text | Do you offer customer support? | Third item question text |
| Item 3 Answer | RichText | Yes! Our customer support team is available 24/7... | Third item answer content with formatting support |
| Item 3 Visible | Visibility | — | Show or hide the third accordion item |
| Item 4 Question | Text | Can I change my subscription plan? | Fourth item question text |
| Item 4 Answer | RichText | Absolutely! You can upgrade or downgrade... | Fourth item answer content with formatting support |
| Item 4 Visible | Visibility | — | Show or hide the fourth accordion item |
| Item 5 Question | Text | Is my data secure? | Fifth item question text |
| Item 5 Answer | RichText | Security is our top priority... | Fifth item answer content with formatting support |
| Item 5 Visible | Visibility | — | Show or hide the fifth accordion item |
| Item 6 Question | Text | How do I cancel my account? | Sixth item question text |
| Item 6 Answer | RichText | You can cancel your account at any time... | Sixth item answer content with formatting support |
| Item 6 Visible | Visibility | — | Show or hide the sixth accordion item |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Main background color | transparent |
| --background-secondary | Hover and active item background | #f5f5f5 |
| --text-primary | Main text color for questions and headings | #1a1a1a |
| --text-secondary | Subheading and answer text color | #737373 |
| --border-color | Item borders and dividers | #e5e5e5 |
| --accent-color | Active item highlight and links | #1a1a1a |
| --border-radius | Corner rounding (not currently applied) | — |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Animation Timing

Adjust the expand/collapse animation speed by modifying the transition duration:

```css
.wf-faqaccordion-content-wrapper {
  transition: max-height 0.5s ease; /* Slower animation */
}

.wf-faqaccordion-icon {
  transition: transform 0.5s ease; /* Match icon rotation */
}
```

### Add Custom Spacing Between Items

Create visual separation between accordion items:

```css
.wf-faqaccordion-item {
  margin-bottom: 8px;
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: 8px;
  overflow: hidden;
}

.wf-faqaccordion-item:first-child {
  border-top: 1px solid var(--border-color, #e5e5e5);
}
```

## Dependencies

No external dependencies.