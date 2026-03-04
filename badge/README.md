# Badge
A compact badge component that displays a label with visual styling variants for different semantic meanings.

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
| Label | TextNode | Badge | The text content displayed in the badge |
| Variant | Variant | info | Visual style variant for semantic meaning (success, warning, error, info) |
| Size | Variant | md | Size of the badge (sm, md, lg) |
| Show Close Button | Boolean | false | Whether to display the close button on the right side |
| Close Button Aria Label | Text | Remove badge | Accessible label for the close button |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --border-radius | Badge corner rounding | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color (overridden by variant colors)
- `line-height` — Text spacing

## Extending in Code

### Custom Close Button Handler

Add custom behavior when the close button is clicked:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const badges = document.querySelectorAll('.wf-badge');
  
  badges.forEach(badge => {
    const closeButton = badge.querySelector('.wf-badge-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        // Fade out animation
        badge.style.transition = 'opacity 0.2s';
        badge.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
          badge.remove();
        }, 200);
      });
    }
  });
});
```

### Dynamic Badge Creation

Programmatically create badges with different variants:

```javascript
function createBadge(label, variant = 'info', showClose = false) {
  const badge = document.createElement('div');
  badge.className = `wf-badge wf-badge-${variant} wf-badge-md`;
  
  const labelSpan = document.createElement('span');
  labelSpan.className = 'wf-badge-label';
  labelSpan.textContent = label;
  badge.appendChild(labelSpan);
  
  if (showClose) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'wf-badge-close';
    closeBtn.setAttribute('aria-label', 'Remove badge');
    closeBtn.innerHTML = '<svg class="wf-badge-close-icon" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 2l8 8M10 2l-8 8"/></svg>';
    badge.appendChild(closeBtn);
  }
  
  return badge;
}

// Usage
const container = document.getElementById('badge-container');
container.appendChild(createBadge('New', 'success', true));
container.appendChild(createBadge('Pending', 'warning'));
```

## Dependencies

No external dependencies.