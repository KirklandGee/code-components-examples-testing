import InstagramFeed from "./InstagramFeed";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./InstagramFeed.css";

export default declareComponent(InstagramFeed, {
  name: "InstagramFeed",
  description: "A responsive grid of recent Instagram posts fetched via an RSS-to-JSON bridge. Because Instagram's Basic Display API was deprecated in December 2024, this component consumes a JSON Feed v1 URL produced by a free service like rss.app or rsshub.app — the designer pastes in the generated feed URL and the component handles fetching, parsing, and rendering. Supports a configurable post count (up to 24), 2 / 3 / 4 column grid on desktop with responsive collapse on mobile, square / portrait / original aspect ratios, and one of four hover effects (none, zoom, overlay, fade). Each post shows the image, optional truncated caption, and optional relative date; clicking a post opens the original on instagram.com in a new tab. Includes a header with a profile link and a 'Follow on Instagram' CTA. Skeleton loading state, friendly error state with retry, and empty state when the feed is currently empty. Client-side cache keeps the quota-friendly request rate gentle.",
  group: "Social",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting with CSS or JavaScript"
    }),
    feedUrl: props.Text({
      name: "Feed URL",
      defaultValue: "https://rss.app/feeds/json/example.json",
      group: "Settings",
      tooltip: "JSON Feed URL from an RSS-to-JSON bridge service like rss.app"
    }),
    profileUrl: props.Link({
      name: "Profile URL",
      group: "Settings",
      tooltip: "Link to the Instagram profile page"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Follow us on Instagram",
      group: "Content",
      tooltip: "Main heading text displayed above the feed"
    }),
    subheading: props.Text({
      name: "Subheading",
      defaultValue: "@yourhandle",
      group: "Content",
      tooltip: "Subheading text displayed below the main heading"
    }),
    showHeading: props.Boolean({
      name: "Show Heading",
      defaultValue: true,
      group: "Display",
      tooltip: "Toggle visibility of the heading block"
    }),
    followButtonText: props.Text({
      name: "Follow Button Text",
      defaultValue: "Follow on Instagram",
      group: "Content",
      tooltip: "Text displayed on the follow CTA button"
    }),
    showFollowButton: props.Boolean({
      name: "Show Follow Button",
      defaultValue: true,
      group: "Display",
      tooltip: "Toggle visibility of the follow CTA button in the header"
    }),
    maxPosts: props.Number({
      name: "Max Posts",
      defaultValue: 9,
      group: "Behavior",
      tooltip: "Maximum number of posts to display (1–24)"
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
      tooltip: "Open Instagram posts in a new browser tab when clicked"
    }),
    columns: props.Variant({
      name: "Columns",
      options: ["2", "3", "4"],
      defaultValue: "3",
      group: "Style",
      tooltip: "Number of columns on desktop (collapses responsively on mobile)"
    }),
    aspectRatio: props.Variant({
      name: "Aspect Ratio",
      options: ["square", "portrait", "original"],
      defaultValue: "square",
      group: "Style",
      tooltip: "Aspect ratio for post image tiles"
    }),
    gap: props.Number({
      name: "Gap",
      defaultValue: 12,
      group: "Style",
      tooltip: "Spacing between post tiles in pixels"
    }),
    hoverEffect: props.Variant({
      name: "Hover Effect",
      options: ["none", "zoom", "overlay", "fade"],
      defaultValue: "overlay",
      group: "Style",
      tooltip: "Visual effect applied when hovering over post tiles"
    }),
    borderRadius: props.Variant({
      name: "Border Radius",
      options: ["none", "small", "medium", "large"],
      defaultValue: "medium",
      group: "Style",
      tooltip: "Corner rounding applied to post tiles"
    }),
    showCaption: props.Boolean({
      name: "Show Caption",
      defaultValue: false,
      group: "Post Card",
      tooltip: "Display post captions below tiles or in overlay on hover"
    }),
    captionLines: props.Number({
      name: "Caption Lines",
      defaultValue: 2,
      group: "Post Card",
      tooltip: "Maximum number of caption lines before truncating with ellipsis"
    }),
    showDate: props.Boolean({
      name: "Show Date",
      defaultValue: false,
      group: "Post Card",
      tooltip: "Display relative post date (e.g. '3 days ago')"
    }),
    loadingText: props.Text({
      name: "Loading Text",
      defaultValue: "Loading Instagram posts…",
      group: "States",
      tooltip: "Message displayed while the feed is loading"
    }),
    errorText: props.Text({
      name: "Error Text",
      defaultValue: "We couldn't reach Instagram right now. Please try again in a moment.",
      group: "States",
      tooltip: "Message displayed when the feed fails to load"
    }),
    retryButtonText: props.Text({
      name: "Retry Button Text",
      defaultValue: "Retry",
      group: "States",
      tooltip: "Text displayed on the retry button in error state"
    }),
    emptyStateText: props.Text({
      name: "Empty State Text",
      defaultValue: "No posts to show yet.",
      group: "States",
      tooltip: "Message displayed when the feed contains no posts"
    })
  }
});