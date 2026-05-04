# GithubRepoCard

A live GitHub repository card that pulls public repo stats directly from api.github.com with no authentication required.

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
| Element ID | Id | — | HTML ID for targeting with CSS or JavaScript |
| Owner | Text | facebook | GitHub username or organization that owns the repo (the part before the slash in the repo URL) |
| Repo | Text | react | Repository name (the part after the slash in the repo URL) |
| Layout | Variant | full | Card size and density (compact, full) |
| Theme | Variant | light | Visual theme (light, dark) |
| Card Style | Variant | outlined | Border / shadow treatment (elevated, outlined, minimal) |
| Show Description | Boolean | true | Show the repo description below the name |
| Show Language | Boolean | true | Show the primary language with its color dot |
| Show Stars | Boolean | true | Show the star count |
| Show Forks | Boolean | true | Show the fork count |
| Show Watchers | Boolean | false | Show the watcher count |
| Show Open Issues | Boolean | false | Show the open-issue count |
| Show Latest Release | Boolean | true | Show the latest release tag and publish date (hides silently if the repo has no releases) |
| Show Last Commit | Boolean | true | Show the date of the most recent push to the default branch |
| Show Contributors | Boolean | true | Show the top contributors as a stacked avatar row |
| Max Contributors | Number | 5 | Maximum number of contributor avatars to stack (overflow collapses to a +N pill) |
| Animate Counts | Boolean | true | Animate star / fork / watcher counts counting up from 0 on first render |
| Refresh Interval | Number | 10 | Client-side cache duration in minutes (0 disables caching, 5+ recommended to stay under GitHub's anonymous 60-req/hr-per-IP limit) |
| Open In New Tab | Boolean | true | Open GitHub links in a new browser tab |
| Show CTA | Boolean | true | Show the 'View on GitHub' CTA |
| CTA Text | Text | View on GitHub | Text on the CTA button |
| Loading Text | Text | Loading repository… | Text shown while the repo is loading |
| Error Text | Text | Couldn't load this repository right now. Please try again shortly. | Generic error message (shown for 4xx / 5xx that isn't a 404 or rate limit) |
| Not Found Text | Text | Repository not found. Check the owner and repo names. | Message shown for a 404 — owner/repo combination doesn't exist or is private |
| Rate Limit Text | Text | GitHub rate limit reached. Please wait a few minutes before trying again. | Message shown when GitHub returns 403 with X-RateLimit-Remaining=0 |
| Retry Button Text | Text | Retry | Text on the retry button |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Card background color | #ffffff |
| --background-secondary | Hover states and secondary backgrounds | #f5f5f5 |
| --text-primary | Main text color | #1a1a1a |
| --text-secondary | Muted text, labels, and metadata | #737373 |
| --border-color | Card borders and dividers | #e5e5e5 |
| --accent-color | Links and CTA background | #1a1a1a |
| --accent-text-color | Text on accent background | #ffffff |
| --border-radius | Corner rounding for card and buttons | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Customizing Metadata Display

Toggle specific metadata sections to create focused repository cards for different use cases:

```javascript
// Minimal card showing only stars and language
<GithubRepoCard
  owner="vercel"
  repo="next.js"
  layout="compact"
  showDescription={false}
  showForks={false}
  showWatchers={false}
  showOpenIssues={false}
  showLatestRelease={false}
  showLastCommit={false}
  showContributors={false}
/>

// Full-featured card for open-source project pages
<GithubRepoCard
  owner="microsoft"
  repo="vscode"
  layout="full"
  showWatchers={true}
  showOpenIssues={true}
  maxContributors={8}
/>
```

### Managing API Rate Limits

Adjust the refresh interval to balance freshness with GitHub's 60-requests-per-hour anonymous limit:

```javascript
// Conservative caching for high-traffic pages
<GithubRepoCard
  owner="facebook"
  repo="react"
  refreshInterval={30}  // Cache for 30 minutes
/>

// Disable caching for development/testing
<GithubRepoCard
  owner="facebook"
  repo="react"
  refreshInterval={0}  // Fetch on every render
/>
```

## Dependencies

No external dependencies.