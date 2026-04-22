import GithubRepoCard from "./GithubRepoCard";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./GithubRepoCard.css";

export default declareComponent(GithubRepoCard, {
  name: "GithubRepoCard",
  description: "A live GitHub repository card that pulls public repo stats directly from api.github.com with no authentication required — just owner and repo name. Displays the repo name, description, primary language with a color dot, star count, fork count, watcher count, latest release tag and date, top contributors as a stacked avatar row, and a prominent 'View on GitHub' CTA. Star / fork counts animate up from 0 on first render. Compact or full layout variants, light or dark theme, and configurable toggles for every metadata section so designers can trim what they don't need. Perfect for open-source project marketing sites, developer-tool landing pages, and 'built with' attributions. Graceful loading, error (with retry), and rate-limit states; the component detects 403-with-X-RateLimit-Remaining=0 specifically and suggests waiting 60 minutes. Client-side cache respects the configured interval to keep requests under GitHub's anonymous 60-req/hr-per-IP limit.",
  group: "Developer",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID for targeting with CSS or JavaScript"
    }),
    owner: props.Text({
      name: "Repository Owner",
      defaultValue: "facebook",
      group: "Settings",
      tooltip: "GitHub username or organization that owns the repo"
    }),
    repo: props.Text({
      name: "Repository Name",
      defaultValue: "react",
      group: "Settings",
      tooltip: "Repository name (the part after the slash in the repo URL)"
    }),
    layout: props.Variant({
      name: "Layout",
      options: ["compact", "full"],
      defaultValue: "full",
      group: "Style",
      tooltip: "Card size and density"
    }),
    theme: props.Variant({
      name: "Theme",
      options: ["light", "dark"],
      defaultValue: "light",
      group: "Style",
      tooltip: "Visual theme"
    }),
    cardStyle: props.Variant({
      name: "Card Style",
      options: ["elevated", "outlined", "minimal"],
      defaultValue: "outlined",
      group: "Style",
      tooltip: "Border / shadow treatment"
    }),
    showDescription: props.Boolean({
      name: "Show Description",
      defaultValue: true,
      group: "Metadata",
      tooltip: "Show the repo description below the name"
    }),
    showLanguage: props.Boolean({
      name: "Show Language",
      defaultValue: true,
      group: "Metadata",
      tooltip: "Show the primary language with its color dot"
    }),
    showStars: props.Boolean({
      name: "Show Stars",
      defaultValue: true,
      group: "Metadata",
      tooltip: "Show the star count"
    }),
    showForks: props.Boolean({
      name: "Show Forks",
      defaultValue: true,
      group: "Metadata",
      tooltip: "Show the fork count"
    }),
    showWatchers: props.Boolean({
      name: "Show Watchers",
      defaultValue: false,
      group: "Metadata",
      tooltip: "Show the watcher count"
    }),
    showOpenIssues: props.Boolean({
      name: "Show Open Issues",
      defaultValue: false,
      group: "Metadata",
      tooltip: "Show the open-issue count"
    }),
    showLatestRelease: props.Boolean({
      name: "Show Latest Release",
      defaultValue: true,
      group: "Metadata",
      tooltip: "Show the latest release tag and publish date"
    }),
    showLastCommit: props.Boolean({
      name: "Show Last Commit",
      defaultValue: true,
      group: "Metadata",
      tooltip: "Show the date of the most recent push to the default branch"
    }),
    showContributors: props.Boolean({
      name: "Show Contributors",
      defaultValue: true,
      group: "Metadata",
      tooltip: "Show the top contributors as a stacked avatar row"
    }),
    maxContributors: props.Number({
      name: "Max Contributors",
      defaultValue: 5,
      group: "Metadata",
      tooltip: "Maximum number of contributor avatars to stack"
    }),
    animateCounts: props.Boolean({
      name: "Animate Counts",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Animate star / fork / watcher counts counting up from 0"
    }),
    refreshInterval: props.Number({
      name: "Refresh Interval",
      defaultValue: 10,
      group: "Behavior",
      tooltip: "Client-side cache duration in minutes (0 disables caching)"
    }),
    openInNewTab: props.Boolean({
      name: "Open in New Tab",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Open GitHub links in a new browser tab"
    }),
    showCta: props.Boolean({
      name: "Show CTA",
      defaultValue: true,
      group: "CTA",
      tooltip: "Show the 'View on GitHub' CTA button"
    }),
    ctaText: props.Text({
      name: "CTA Text",
      defaultValue: "View on GitHub",
      group: "CTA",
      tooltip: "Text on the CTA button"
    }),
    loadingText: props.Text({
      name: "Loading Text",
      defaultValue: "Loading repository…",
      group: "States",
      tooltip: "Text shown while the repo is loading"
    }),
    errorText: props.Text({
      name: "Error Text",
      defaultValue: "Couldn't load this repository right now. Please try again shortly.",
      group: "States",
      tooltip: "Generic error message for 4xx / 5xx responses"
    }),
    notFoundText: props.Text({
      name: "Not Found Text",
      defaultValue: "Repository not found. Check the owner and repo names.",
      group: "States",
      tooltip: "Message shown for a 404 response"
    }),
    rateLimitText: props.Text({
      name: "Rate Limit Text",
      defaultValue: "GitHub rate limit reached. Please wait a few minutes before trying again.",
      group: "States",
      tooltip: "Message shown when GitHub rate limit is exceeded"
    }),
    retryButtonText: props.Text({
      name: "Retry Button Text",
      defaultValue: "Retry",
      group: "States",
      tooltip: "Text on the retry button"
    })
  }
});