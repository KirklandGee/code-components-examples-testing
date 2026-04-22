# InstagramFeed

A responsive grid of recent Instagram posts fetched via an RSS-to-JSON bridge.

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
| Feed URL | Text | https://rss.app/feeds/json/example.json | JSON Feed URL from an RSS-to-JSON bridge. Generate one for any public Instagram account at rss.app (free tier) by pointing it at instagram.com/{handle} and copying the JSON URL. Must return JSON Feed v1 format. |
| Profile URL | Link | — | Link to the Instagram profile (e.g. https://www.instagram.com/yourhandle/) |
| Heading | TextNode | Follow us on Instagram | Optional heading above the feed |
| Subheading | Text | @yourhandle | Optional subheading below the heading |
| Show Heading | Boolean | true | Show or hide the heading block |
| Follow Button Text | Text | Follow on Instagram | Text on the 'Follow on Instagram' CTA |
| Show Follow Button | Boolean | true | Show or hide the follow CTA in the header |
| Max Posts | Number | 9 | Maximum number of posts to display (1–24) |
| Refresh Interval | Number | 10 | Client-side cache duration in minutes (0 disables caching) |
| Open In New Tab | Boolean | true | Open posts on instagram.com in a new browser tab |
| Columns | Variant | 3 | Number of columns on desktop (collapses responsively on narrow screens) |
| Aspect Ratio | Variant | square | Aspect ratio of each post tile |
| Gap | Number | 12 | Gap between post tiles in pixels |
| Hover Effect | Variant | overlay | Hover treatment on post tiles |
| Border Radius | Variant | medium | Corner rounding on post tiles |
| Show Caption | Boolean | false | Show the post caption below each tile (uses overlay on hover when hoverEffect='overlay') |
| Caption Lines | Number | 2 | Maximum number of caption lines before truncating with an ellipsis |
| Show Date | Boolean | false | Show the relative post date (e.g. '3 days ago') |
| Loading Text | Text | Loading Instagram posts… | Text shown while the feed is loading |
| Error Text | Text | We couldn't reach Instagram right now. Please try again in a moment. | Message shown when the feed fails to load |
| Retry Button Text | Text | Retry | Text on the retry button |
| Empty State Text | Text | No posts to show yet. | Message shown when the feed is empty |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Main background color and skeleton shimmer highlight | #ffffff |
| --background-secondary | Hover states and skeleton shimmer base | #f5f5f5 |
| --text-primary | Headings, captions, and post dates | #1a1a1a |
| --text-secondary | Subheading and loading text | #737373 |
| --border-color | Borders and dividers | — |
| --accent-color | Follow button background, overlay background, and focus outlines | #1a1a1a |
| --accent-text-color | Follow button text color | #ffffff |
| --border-radius | Component and button corner rounding | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Feed URL Generation

If you need to programmatically generate feed URLs based on user input or CMS data, you can wrap the component and pass dynamic feed URLs:

```jsx
const DynamicInstagramFeed = ({ instagramHandle }) => {
  const feedUrl = `https://rss.app/feeds/json/${instagramHandle}.json`;
  const profileUrl = `https://www.instagram.com/${instagramHandle}/`;
  
  return (
    <InstagramFeed
      feedUrl={feedUrl}
      profileUrl={profileUrl}
      subheading={`@${instagramHandle}`}
    />
  );
};
```

### Custom Post Filtering

To filter posts by hashtag or date range before rendering, you can extend the component's data fetching logic to process the JSON Feed items array before display.

## Dependencies

No external dependencies.