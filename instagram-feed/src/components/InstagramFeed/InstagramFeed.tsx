import { useState, useEffect, useRef } from "react";
import type { PropValues, PropType } from "@webflow/data-types";

export interface InstagramFeedProps {
  id?: string;
  feedUrl?: string;
  profileUrl?: PropValues[PropType.Link];
  heading?: React.ReactNode;
  subheading?: string;
  showHeading?: boolean;
  followButtonText?: string;
  showFollowButton?: boolean;
  maxPosts?: number;
  refreshInterval?: number;
  openInNewTab?: boolean;
  columns?: "2" | "3" | "4";
  aspectRatio?: "square" | "portrait" | "original";
  gap?: number;
  hoverEffect?: "none" | "zoom" | "overlay" | "fade";
  borderRadius?: "none" | "small" | "medium" | "large";
  showCaption?: boolean;
  captionLines?: number;
  showDate?: boolean;
  loadingText?: string;
  errorText?: string;
  retryButtonText?: string;
  emptyStateText?: string;
}

interface JSONFeedItem {
  id: string;
  url?: string;
  title?: string;
  content_text?: string;
  content_html?: string;
  image?: string;
  banner_image?: string;
  date_published?: string;
  attachments?: Array<{
    url: string;
    mime_type?: string;
    title?: string;
  }>;
}

interface JSONFeed {
  version: string;
  title: string;
  home_page_url?: string;
  feed_url?: string;
  icon?: string;
  items: JSONFeedItem[];
}

interface CacheEntry {
  data: JSONFeed;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
  if (diffWeek > 0) return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  return "just now";
}

export default function InstagramFeed({
  id,
  feedUrl = "https://rss.app/feeds/json/example.json",
  profileUrl,
  heading,
  subheading = "@yourhandle",
  showHeading = true,
  followButtonText = "Follow on Instagram",
  showFollowButton = true,
  maxPosts = 9,
  refreshInterval = 10,
  openInNewTab = true,
  columns = "3",
  aspectRatio = "square",
  gap = 12,
  hoverEffect = "overlay",
  borderRadius = "medium",
  showCaption = false,
  captionLines = 2,
  showDate = false,
  loadingText = "Loading Instagram posts…",
  errorText = "We couldn't reach Instagram right now. Please try again in a moment.",
  retryButtonText = "Retry",
  emptyStateText = "No posts to show yet.",
}: InstagramFeedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<JSONFeedItem[]>([]);
  const fetchAttemptRef = useRef(0);

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);
    fetchAttemptRef.current += 1;
    const currentAttempt = fetchAttemptRef.current;

    try {
      const cacheKey = feedUrl;
      const cached = cache.get(cacheKey);
      const now = Date.now();
      const cacheValidMs = refreshInterval * 60 * 1000;

      if (cached && refreshInterval > 0 && now - cached.timestamp < cacheValidMs) {
        if (currentAttempt === fetchAttemptRef.current) {
          setPosts(cached.data.items.slice(0, maxPosts));
          setLoading(false);
        }
        return;
      }

      const response = await fetch(feedUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data: JSONFeed = await response.json();

      if (currentAttempt === fetchAttemptRef.current) {
        cache.set(cacheKey, { data, timestamp: now });
        setPosts(data.items.slice(0, maxPosts));
        setLoading(false);
      }
    } catch (err) {
      if (currentAttempt === fetchAttemptRef.current) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [feedUrl, maxPosts, refreshInterval]);

  const handleRetry = () => {
    fetchFeed();
  };

  const resolveImageUrl = (item: JSONFeedItem): string => {
    return (
      item.image ||
      item.banner_image ||
      item.attachments?.find((a) => a.mime_type?.startsWith("image/"))?.url ||
      ""
    );
  };

  const resolveCaption = (item: JSONFeedItem): string => {
    return item.content_text || item.title || "";
  };

  const aspectRatioMap = {
    square: "1 / 1",
    portrait: "4 / 5",
    original: "auto",
  };

  const borderRadiusMap = {
    none: "0px",
    small: "4px",
    medium: "8px",
    large: "16px",
  };

  return (
    <div
      id={id}
      className="wf-instagramfeed"
      style={
        {
          "--wf-instagramfeed-columns": columns,
          "--wf-instagramfeed-gap": `${gap}px`,
          "--wf-instagramfeed-aspect-ratio": aspectRatioMap[aspectRatio],
          "--wf-instagramfeed-border-radius": borderRadiusMap[borderRadius],
          "--wf-instagramfeed-caption-lines": captionLines,
        } as React.CSSProperties
      }
    >
      {showHeading && (
        <header className="wf-instagramfeed-header">
          <div className="wf-instagramfeed-header-content">
            {heading && <h2 className="wf-instagramfeed-heading">{heading}</h2>}
            {subheading && <p className="wf-instagramfeed-subheading">{subheading}</p>}
          </div>
          {showFollowButton && (
            <a
              href={profileUrl?.href || "#"}
              target={profileUrl?.target}
              className="wf-instagramfeed-follow-button"
            >
              {followButtonText}
            </a>
          )}
        </header>
      )}

      {loading && (
        <div className="wf-instagramfeed-loading">
          <div className="wf-instagramfeed-skeleton-grid">
            {Array.from({ length: maxPosts }).map((_, i) => (
              <div key={i} className="wf-instagramfeed-skeleton-item">
                <div className="wf-instagramfeed-skeleton-image"></div>
              </div>
            ))}
          </div>
          <p className="wf-instagramfeed-loading-text">{loadingText}</p>
        </div>
      )}

      {!loading && error && (
        <div className="wf-instagramfeed-error">
          <p className="wf-instagramfeed-error-text">{errorText}</p>
          <button onClick={handleRetry} className="wf-instagramfeed-retry-button">
            {retryButtonText}
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="wf-instagramfeed-empty">
          <p className="wf-instagramfeed-empty-text">{emptyStateText}</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className={`wf-instagramfeed-grid wf-instagramfeed-hover-${hoverEffect}`}>
          {posts.map((post) => {
            const imageUrl = resolveImageUrl(post);
            const caption = resolveCaption(post);
            const postUrl = post.url || "#";
            const target = openInNewTab ? "_blank" : undefined;
            const rel = openInNewTab ? "noopener noreferrer" : undefined;

            return (
              <a
                key={post.id}
                href={postUrl}
                target={target}
                rel={rel}
                className="wf-instagramfeed-item"
              >
                <div className="wf-instagramfeed-item-image-wrapper">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={caption || "Instagram post"}
                      className="wf-instagramfeed-item-image"
                      loading="lazy"
                    />
                  )}
                  {hoverEffect === "overlay" && showCaption && caption && (
                    <div className="wf-instagramfeed-item-overlay">
                      <p className="wf-instagramfeed-item-overlay-caption">{caption}</p>
                    </div>
                  )}
                </div>
                {showCaption && hoverEffect !== "overlay" && caption && (
                  <p className="wf-instagramfeed-item-caption">{caption}</p>
                )}
                {showDate && post.date_published && (
                  <p className="wf-instagramfeed-item-date">
                    {getRelativeTime(post.date_published)}
                  </p>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}