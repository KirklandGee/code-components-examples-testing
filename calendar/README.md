# Calendar

A date picker calendar built on [react-day-picker](https://daypicker.dev/) that adapts to your Webflow site's design system. Drop it in, and it matches your site's colors, typography, and spacing automatically.

## Getting Started

```bash
npm install
npx webflow library share
```

For local development: `npm run dev` → `http://localhost:5173`

## Designer Properties

These are configurable in the Webflow Designer properties panel:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Element ID | ID | — | HTML ID for targeting with CSS or JavaScript |
| Size | Variant | `default` | Cell sizing: `compact` (28px), `default` (36px), `large` (44px) |
| Caption Layout | Variant | `label` | `label` shows month/year text, `dropdown` adds month/year selectors |
| Show Outside Days | Boolean | `true` | Show dates from previous and next months |
| Show Week Numbers | Boolean | `false` | Display ISO week numbers in the first column |
| Fixed Weeks | Boolean | `false` | Always show 6 weeks so calendar height stays consistent |
| Header | Slot | — | Content area above the calendar grid |
| Footer | Slot | — | Content area below the calendar grid |

## Styling

This component automatically adapts to your Webflow site's design system. It inherits `font-family`, `color`, and `line-height` from its parent element, and references site variables for everything else.

### Site Variables

Make sure your site defines these variables, or rename them in `Calendar.css` to match your site's variable names:

| Site Variable | What It Controls | Fallback |
|---------------|-----------------|----------|
| `--background-primary` | Calendar background | `#ffffff` |
| `--background-secondary` | Hover states, today highlight | `#f5f5f5` |
| `--text-primary` | Day numbers, navigation | `#1a1a1a` |
| `--text-secondary` | Weekday labels, outside days, week numbers | `#737373` |
| `--border-color` | Calendar border, footer separator | `#e5e5e5` |
| `--accent-color` | Selected date background, focus ring | `#1a1a1a` |
| `--accent-text-color` | Selected date text | `#ffffff` |
| `--border-radius` | Corner rounding on calendar, buttons, cells | `8px` |

**To find your site's variable names:** In the Webflow Designer, open the Variables panel, click the three-dot menu on any variable, and select "Copy CSS". Then update `Calendar.css` to match.

### Inherited Properties

These CSS properties pass through Shadow DOM automatically — the calendar picks them up from its parent:

- `font-family` — uses your site's typeface
- `color` — uses your site's text color
- `line-height` — uses your site's line height

### Tag Selectors

This component has `applyTagSelectors: true`, so any tag-level styles you've defined in your site (like `button` styling) will apply inside the calendar.

## Extending in Code

The calendar ships with single-date selection wired up internally. To customize behavior, edit `Calendar.tsx`:

### Change selection mode

```tsx
// Range selection
<DayPicker mode="range" selected={range} onSelect={setRange} />

// Multiple dates
<DayPicker mode="multiple" selected={dates} onSelect={setDates} />
```

### Disable specific dates

```tsx
<DayPicker
  disabled={[
    { before: new Date() },           // disable past dates
    { dayOfWeek: [0, 6] },            // disable weekends
    new Date(2026, 0, 1),             // disable specific date
  ]}
/>
```

### Add locale support

```tsx
import { es } from "react-day-picker/locale";

<DayPicker locale={es} />
```

### Communicate selected date to other components

Since Webflow code components run in isolated Shadow DOM containers, use one of these patterns:

```tsx
// Custom events
const handleSelect = (date: Date | undefined) => {
  setSelected(date);
  window.dispatchEvent(new CustomEvent("calendar-date-selected", {
    detail: { date: date?.toISOString() },
  }));
};

// URL params
const url = new URL(window.location.href);
url.searchParams.set("date", date.toISOString());
window.history.pushState({}, "", url);

// localStorage
localStorage.setItem("selectedDate", date.toISOString());
```

## Dependencies

- [react-day-picker](https://daypicker.dev/) — date picker engine
