# YouTubeChannel

A live YouTube channel widget that fetches and displays the latest videos from any public channel using the YouTube Data API v3.

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
| API Key | Text | — | YouTube Data API v3 key (create at console.cloud.google.com). The key is sent as a query parameter and only needs read access to the public YouTube Data API. |
| Channel ID | Text | UCsBjURrPoezykLs9EqgamOA | YouTube channel ID (starts with UC, e.g. UCsBjURrPoezykLs9EqgamOA). Find it in the channel URL or via youtube.com/account_advanced. |
| Heading | TextNode | Latest from our channel | Optional heading shown above the channel header |
| Subheading | Text | Subscribe to stay in the loop | Optional subheading below the main heading |
| Show Heading | Boolean | true | Show or hide the heading and subheading |
| Layout | Variant | grid | Arrangement of video cards (grid, row, list) |
| Columns | Variant | 3 | Number of columns on desktop (2, 3, 4) — grid layout only |
| Card Style | Variant | minimal | Visual style of video cards (elevated, outlined, minimal) |
| Max Videos | Number | 6 | Maximum number of recent videos to fetch and display (1–12) |
| Refresh Interval | Number | 15 | Client-side cache duration in minutes (0 disables caching, 10+ recommended to protect API quota) |
| Open In New Tab | Boolean | true | Open video and subscribe links in a new browser tab |
| Show Channel Avatar | Boolean | true | Display the channel avatar in the header |
| Show Channel Name | Boolean | true | Display the channel name in the header |
| Show Subscriber Count | Boolean | true | Display the live subscriber count pill |
| Subscriber Suffix | Text | subscribers | Text appended to the formatted subscriber count (e.g. 'subscribers') |
| Show Subscribe Button | Boolean | true | Show a Subscribe CTA that deep-links to YouTube's subscribe confirmation |
| Subscribe Button Text | Text | Subscribe | Text on the Subscribe CTA |
| Show Video Title | Boolean | true | Show each video's title on its card |
| Show Publish Date | Boolean | true | Show each video's publish date (as 'X days / weeks / months ago') |
| Show View Count | Boolean | true | Show each video's view count (e.g. '12K views') |
| Show Duration Badge | Boolean | true | Show a small duration badge on the thumbnail (e.g. '5:42') |
| Loading Text | Text | Loading latest videos… | Text shown while videos are loading |
| Error Text | Text | Couldn't load videos right now. Please try again shortly. | Message shown when the API call fails |
| Retry Button Text | Text | Retry | Text on the retry button in the error state |
| Empty State Text | Text | No videos published yet — check back soon. | Message shown when the channel has no public videos |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Main background and card backgrounds | #ffffff |
| --background-secondary | Hover states and skeleton shimmer animation | #f5f5f5 |
| --text-primary | Headings, video titles, and channel name | #1a1a1a |
| --text-secondary | Subheading, metadata, and subscriber count | #737373 |
| --border-color | Card borders, dividers, and scrollbar | #e5e5e5 |
| --accent-color | Subscribe button background and focus outlines | #1a1a1a |
| --accent-text-color | Subscribe button text color | #ffffff |
| --border-radius | All rounded corners (cards, buttons, badges) | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Video Card Click Handling

Intercept video clicks to track analytics or implement a custom video player:

```javascript
document.addEventListener('click', (e) => {
  const videoCard = e.target.closest('.wf-youtubechannel-video-card');
  if (videoCard) {
    e.preventDefault();
    const videoId = new URL(videoCard.href).searchParams.get('v');
    
    // Track the click
    analytics.track('Video Clicked', { videoId });
    
    // Open in custom modal player
    openVideoModal(videoId);
  }
});
```

### Styling Video Cards by Position

Apply custom styles to featured videos (e.g., first card):

```css
.wf-youtubechannel-video-card:first-child {
  grid-column: 1 / -1;
}

.wf-youtubechannel-video-card:first-child .wf-youtubechannel-video-thumbnail-wrapper {
  padding-bottom: 42%;
}

.wf-youtubechannel-video-card:first-child .wf-youtubechannel-video-title {
  font-size: 20px;
  -webkit-line-clamp: 3;
}
```

## Dependencies

No external dependencies.