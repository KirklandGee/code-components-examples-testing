import { useState, useEffect } from "react";

export interface YouTubeChannelProps {
  id?: string;
  apiKey?: string;
  channelId?: string;
  heading?: React.ReactNode;
  subheading?: string;
  showHeading?: boolean;
  layout?: "grid" | "row" | "list";
  columns?: "2" | "3" | "4";
  cardStyle?: "elevated" | "outlined" | "minimal";
  maxVideos?: number;
  refreshInterval?: number;
  openInNewTab?: boolean;
  showChannelAvatar?: boolean;
  showChannelName?: boolean;
  showSubscriberCount?: boolean;
  subscriberSuffix?: string;
  showSubscribeButton?: boolean;
  subscribeButtonText?: string;
  showVideoTitle?: boolean;
  showPublishDate?: boolean;
  showViewCount?: boolean;
  showDurationBadge?: boolean;
  loadingText?: string;
  errorText?: string;
  retryButtonText?: string;
  emptyStateText?: string;
}

interface ChannelData {
  title: string;
  avatarUrl: string;
  subscriberCount: number;
  hiddenSubscriberCount: boolean;
}

interface VideoData {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
}

interface CacheEntry {
  timestamp: number;
  channelData: ChannelData;
  videos: VideoData[];
}

const cache = new Map<string, CacheEntry>();

function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatViewCount(count: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(count);
}

function formatSubscriberCount(count: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(count);
}

function getRelativeTime(isoDate: string): string {
  const now = Date.now();
  const published = new Date(isoDate).getTime();
  const diffMs = now - published;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return "Today";
}

export default function YouTubeChannel({
  id,
  apiKey = "",
  channelId = "UCsBjURrPoezykLs9EqgamOA",
  heading,
  subheading = "Subscribe to stay in the loop",
  showHeading = true,
  layout = "grid",
  columns = "3",
  cardStyle = "minimal",
  maxVideos = 6,
  refreshInterval = 15,
  openInNewTab = true,
  showChannelAvatar = true,
  showChannelName = true,
  showSubscriberCount = true,
  subscriberSuffix = "subscribers",
  showSubscribeButton = true,
  subscribeButtonText = "Subscribe",
  showVideoTitle = true,
  showPublishDate = true,
  showViewCount = true,
  showDurationBadge = true,
  loadingText = "Loading latest videos…",
  errorText = "Couldn't load videos right now. Please try again shortly.",
  retryButtonText = "Retry",
  emptyStateText = "No videos published yet — check back soon.",
}: YouTubeChannelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);

  const fetchData = async () => {
    if (!apiKey) {
      setError("API key is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const cacheKey = `${channelId}-${maxVideos}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && refreshInterval > 0 && now - cached.timestamp < refreshInterval * 60 * 1000) {
      setChannelData(cached.channelData);
      setVideos(cached.videos);
      setLoading(false);
      return;
    }

    try {
      const [channelRes, searchRes] = await Promise.all([
        fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
        ),
        fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=${Math.min(maxVideos, 50)}&type=video&key=${apiKey}`
        ),
      ]);

      if (!channelRes.ok || !searchRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const channelJson = await channelRes.json();
      const searchJson = await searchRes.json();

      if (!channelJson.items || channelJson.items.length === 0) {
        throw new Error("Channel not found");
      }

      const channel = channelJson.items[0];
      const channelInfo: ChannelData = {
        title: channel.snippet?.title || "",
        avatarUrl: channel.snippet?.thumbnails?.default?.url || "",
        subscriberCount: parseInt(channel.statistics?.subscriberCount || "0", 10),
        hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount === true,
      };

      if (!searchJson.items || searchJson.items.length === 0) {
        setChannelData(channelInfo);
        setVideos([]);
        setLoading(false);
        cache.set(cacheKey, { timestamp: now, channelData: channelInfo, videos: [] });
        return;
      }

      const videoIds = searchJson.items.map((item: any) => item.id.videoId).join(",");
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`
      );

      if (!videosRes.ok) {
        throw new Error("Failed to fetch video details");
      }

      const videosJson = await videosRes.json();
      type VideoDetails = { viewCount: number; duration: string };
      const videoDetailsMap = new Map<string, VideoDetails>(
        (videosJson.items || []).map((item: any) => [
          item.id as string,
          {
            viewCount: parseInt(item.statistics?.viewCount || "0", 10),
            duration: item.contentDetails?.duration || "PT0S",
          } satisfies VideoDetails,
        ])
      );

      const videoList: VideoData[] = searchJson.items.map((item: any) => {
        const details: VideoDetails = videoDetailsMap.get(item.id.videoId) ?? { viewCount: 0, duration: "PT0S" };
        return {
          id: item.id.videoId,
          title: item.snippet?.title || "",
          thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || "",
          publishedAt: item.snippet?.publishedAt || "",
          viewCount: details.viewCount,
          duration: parseDuration(details.duration),
        };
      });

      setChannelData(channelInfo);
      setVideos(videoList);
      cache.set(cacheKey, { timestamp: now, channelData: channelInfo, videos: videoList });
    } catch (err) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiKey, channelId, maxVideos, refreshInterval]);

  const linkTarget = openInNewTab ? "_blank" : undefined;
  const linkRel = openInNewTab ? "noopener noreferrer" : undefined;

  if (loading) {
    return (
      <div id={id} className="wf-youtubechannel wf-youtubechannel--loading" aria-busy="true" aria-live="polite">
        <span className="wf-youtubechannel-sr-only">{loadingText}</span>
        <div className="wf-youtubechannel-loading">
          <div className="wf-youtubechannel-skeleton-header">
            <div className="wf-youtubechannel-skeleton-avatar"></div>
            <div className="wf-youtubechannel-skeleton-text-group">
              <div className="wf-youtubechannel-skeleton-text wf-youtubechannel-skeleton-text--title"></div>
              <div className="wf-youtubechannel-skeleton-text wf-youtubechannel-skeleton-text--subtitle"></div>
            </div>
          </div>
          <div
            className={`wf-youtubechannel-skeleton-grid wf-youtubechannel-skeleton-grid--${layout} wf-youtubechannel-skeleton-grid--cols-${columns}`}
          >
            {Array.from({ length: maxVideos }).map((_, i) => (
              <div key={i} className="wf-youtubechannel-skeleton-card">
                <div className="wf-youtubechannel-skeleton-thumbnail"></div>
                <div className="wf-youtubechannel-skeleton-card-content">
                  <div className="wf-youtubechannel-skeleton-text wf-youtubechannel-skeleton-text--card-title"></div>
                  <div className="wf-youtubechannel-skeleton-text wf-youtubechannel-skeleton-text--card-meta"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id={id} className="wf-youtubechannel wf-youtubechannel--error">
        <div className="wf-youtubechannel-error">
          <p className="wf-youtubechannel-error-text">{errorText}</p>
          <button className="wf-youtubechannel-retry-button" onClick={fetchData}>
            {retryButtonText}
          </button>
        </div>
      </div>
    );
  }

  if (!channelData) {
    return null;
  }

  if (videos.length === 0) {
    return (
      <div id={id} className="wf-youtubechannel wf-youtubechannel--empty">
        <div className="wf-youtubechannel-empty">
          <p className="wf-youtubechannel-empty-text">{emptyStateText}</p>
        </div>
      </div>
    );
  }

  const showSubscriberPill =
    showSubscriberCount && !channelData.hiddenSubscriberCount && channelData.subscriberCount > 0;

  return (
    <div id={id} className={`wf-youtubechannel wf-youtubechannel--${layout}`}>
      {showHeading && (heading || subheading) && (
        <div className="wf-youtubechannel-heading-section">
          {heading && <div className="wf-youtubechannel-heading">{heading}</div>}
          {subheading && <p className="wf-youtubechannel-subheading">{subheading}</p>}
        </div>
      )}

      <div className="wf-youtubechannel-channel-header">
        <div className="wf-youtubechannel-channel-info">
          {showChannelAvatar && channelData.avatarUrl && (
            <img
              src={channelData.avatarUrl}
              alt={channelData.title}
              className="wf-youtubechannel-channel-avatar"
            />
          )}
          <div className="wf-youtubechannel-channel-text">
            {showChannelName && <h3 className="wf-youtubechannel-channel-name">{channelData.title}</h3>}
            {showSubscriberPill && (
              <div className="wf-youtubechannel-subscriber-pill">
                {formatSubscriberCount(channelData.subscriberCount)} {subscriberSuffix}
              </div>
            )}
          </div>
        </div>
        {showSubscribeButton && (
          <a
            href={`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`}
            target={linkTarget}
            rel={linkRel}
            className="wf-youtubechannel-subscribe-button"
          >
            {subscribeButtonText}
          </a>
        )}
      </div>

      <div
        className={`wf-youtubechannel-videos wf-youtubechannel-videos--${layout} wf-youtubechannel-videos--cols-${columns} wf-youtubechannel-videos--${cardStyle}`}
      >
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target={linkTarget}
            rel={linkRel}
            className="wf-youtubechannel-video-card"
          >
            <div className="wf-youtubechannel-video-thumbnail-wrapper">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="wf-youtubechannel-video-thumbnail"
              />
              {showDurationBadge && video.duration && (
                <div className="wf-youtubechannel-duration-badge">{video.duration}</div>
              )}
            </div>
            <div className="wf-youtubechannel-video-content">
              {showVideoTitle && <h4 className="wf-youtubechannel-video-title">{video.title}</h4>}
              {(showPublishDate || showViewCount) && (
                <div className="wf-youtubechannel-video-meta">
                  {showViewCount && (
                    <span className="wf-youtubechannel-video-views">
                      {formatViewCount(video.viewCount)} views
                    </span>
                  )}
                  {showPublishDate && showViewCount && (
                    <span className="wf-youtubechannel-meta-separator">•</span>
                  )}
                  {showPublishDate && (
                    <span className="wf-youtubechannel-video-date">{getRelativeTime(video.publishedAt)}</span>
                  )}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}