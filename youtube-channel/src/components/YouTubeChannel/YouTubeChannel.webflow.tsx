import YouTubeChannel from "./YouTubeChannel";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./YouTubeChannel.css";

export default declareComponent(YouTubeChannel, {
  name: "YouTubeChannel",
  description: "A live YouTube channel widget that fetches and displays the latest videos from any public channel using the YouTube Data API v3. Shows the channel avatar, channel name, and live subscriber count in a header row, followed by a responsive grid of the N most recent videos. Each video card shows the video thumbnail (16:9), title, publish date (as a relative 'X days ago' string), and view count. Clicking a video opens it on YouTube in a new tab. Includes a prominent 'Subscribe' CTA that deep-links to the channel's subscribe-confirmation page. Configurable layout (grid, row, list), column count, and which metadata pieces to display. Graceful loading state with skeleton cards, error state with retry, and empty state when the channel has no public videos. Caches responses client-side for the configured interval to avoid burning through the YouTube API quota. Inherits typography from the Webflow site and uses site color variables for text and accent colors with sensible fallbacks.",
  group: "Data Display",
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
    apiKey: props.Text({
      name: "API Key",
      defaultValue: "",
      group: "Settings",
      tooltip: "YouTube Data API v3 key (create at console.cloud.google.com)"
    }),
    channelId: props.Text({
      name: "Channel ID",
      defaultValue: "UCsBjURrPoezykLs9EqgamOA",
      group: "Settings",
      tooltip: "YouTube channel ID starting with UC (find in channel URL or account settings)"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Latest from our channel",
      group: "Content",
      tooltip: "Main heading displayed above the channel header"
    }),
    subheading: props.Text({
      name: "Subheading",
      defaultValue: "Subscribe to stay in the loop",
      group: "Content",
      tooltip: "Secondary text shown below the main heading"
    }),
    showHeading: props.Boolean({
      name: "Show Heading",
      defaultValue: true,
      group: "Display",
      tooltip: "Display or hide the heading and subheading section"
    }),
    layout: props.Variant({
      name: "Layout",
      options: ["grid", "row", "list"],
      defaultValue: "grid",
      group: "Style",
      tooltip: "Arrangement style for video cards"
    }),
    columns: props.Variant({
      name: "Columns",
      options: ["2", "3", "4"],
      defaultValue: "3",
      group: "Style",
      tooltip: "Number of columns on desktop (grid layout only)"
    }),
    cardStyle: props.Variant({
      name: "Card Style",
      options: ["elevated", "outlined", "minimal"],
      defaultValue: "minimal",
      group: "Style",
      tooltip: "Visual appearance of video cards"
    }),
    maxVideos: props.Number({
      name: "Max Videos",
      defaultValue: 6,
      group: "Behavior",
      tooltip: "Maximum number of recent videos to display (1–12)"
    }),
    refreshInterval: props.Number({
      name: "Refresh Interval",
      defaultValue: 15,
      group: "Behavior",
      tooltip: "Cache duration in minutes (0 disables caching, 10+ recommended)"
    }),
    openInNewTab: props.Boolean({
      name: "Open in New Tab",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Open video and subscribe links in a new browser tab"
    }),
    showChannelAvatar: props.Boolean({
      name: "Show Channel Avatar",
      defaultValue: true,
      group: "Channel Header",
      tooltip: "Display the channel's profile image in the header"
    }),
    showChannelName: props.Boolean({
      name: "Show Channel Name",
      defaultValue: true,
      group: "Channel Header",
      tooltip: "Display the channel's name in the header"
    }),
    showSubscriberCount: props.Boolean({
      name: "Show Subscriber Count",
      defaultValue: true,
      group: "Channel Header",
      tooltip: "Display the live subscriber count badge"
    }),
    subscriberSuffix: props.Text({
      name: "Subscriber Suffix",
      defaultValue: "subscribers",
      group: "Channel Header",
      tooltip: "Text appended to the subscriber count (e.g. 'subscribers')"
    }),
    showSubscribeButton: props.Boolean({
      name: "Show Subscribe Button",
      defaultValue: true,
      group: "Channel Header",
      tooltip: "Display the Subscribe CTA button"
    }),
    subscribeButtonText: props.Text({
      name: "Subscribe Button Text",
      defaultValue: "Subscribe",
      group: "Channel Header",
      tooltip: "Text displayed on the Subscribe button"
    }),
    showVideoTitle: props.Boolean({
      name: "Show Video Title",
      defaultValue: true,
      group: "Video Cards",
      tooltip: "Display each video's title on its card"
    }),
    showPublishDate: props.Boolean({
      name: "Show Publish Date",
      defaultValue: true,
      group: "Video Cards",
      tooltip: "Display relative publish date (e.g. '3 days ago')"
    }),
    showViewCount: props.Boolean({
      name: "Show View Count",
      defaultValue: true,
      group: "Video Cards",
      tooltip: "Display formatted view count (e.g. '12K views')"
    }),
    showDurationBadge: props.Boolean({
      name: "Show Duration Badge",
      defaultValue: true,
      group: "Video Cards",
      tooltip: "Display video duration badge on thumbnails (e.g. '5:42')"
    }),
    loadingText: props.Text({
      name: "Loading Text",
      defaultValue: "Loading latest videos…",
      group: "States",
      tooltip: "Message shown while fetching videos from YouTube"
    }),
    errorText: props.Text({
      name: "Error Text",
      defaultValue: "Couldn't load videos right now. Please try again shortly.",
      group: "States",
      tooltip: "Message displayed when the API request fails"
    }),
    retryButtonText: props.Text({
      name: "Retry Button Text",
      defaultValue: "Retry",
      group: "States",
      tooltip: "Text on the retry button in error state"
    }),
    emptyStateText: props.Text({
      name: "Empty State Text",
      defaultValue: "No videos published yet — check back soon.",
      group: "States",
      tooltip: "Message shown when the channel has no public videos"
    })
  }
});