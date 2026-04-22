import { useState, useEffect, useRef } from "react";

export interface GithubRepoCardProps {
  id?: string;
  owner?: string;
  repo?: string;
  layout?: "compact" | "full";
  theme?: "light" | "dark";
  cardStyle?: "elevated" | "outlined" | "minimal";
  showDescription?: boolean;
  showLanguage?: boolean;
  showStars?: boolean;
  showForks?: boolean;
  showWatchers?: boolean;
  showOpenIssues?: boolean;
  showLatestRelease?: boolean;
  showLastCommit?: boolean;
  showContributors?: boolean;
  maxContributors?: number;
  animateCounts?: boolean;
  refreshInterval?: number;
  openInNewTab?: boolean;
  showCta?: boolean;
  ctaText?: string;
  loadingText?: string;
  errorText?: string;
  notFoundText?: string;
  rateLimitText?: string;
  retryButtonText?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string; html_url: string };
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license?: { key: string; name: string; spdx_id: string } | null;
  default_branch: string;
  topics?: string[];
}

interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: "User" | "Bot";
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body?: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
}

type ErrorType = "generic" | "notFound" | "rateLimit";

interface CachedData {
  repo: GitHubRepo;
  contributors: GitHubContributor[];
  release: GitHubRelease | null;
  timestamp: number;
}

const cache = new Map<string, CachedData>();

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Rust: "#dea584",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function useAnimatedCount(target: number, enabled: boolean, duration: number = 1000): number {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled || hasAnimated.current) {
      setCount(target);
      return;
    }

    hasAnimated.current = true;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target - startValue) * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, enabled, duration]);

  return count;
}

export default function GithubRepoCard({
  id,
  owner = "facebook",
  repo = "react",
  layout = "full",
  theme = "light",
  cardStyle = "outlined",
  showDescription = true,
  showLanguage = true,
  showStars = true,
  showForks = true,
  showWatchers = false,
  showOpenIssues = false,
  showLatestRelease = true,
  showLastCommit = true,
  showContributors = true,
  maxContributors = 5,
  animateCounts = true,
  refreshInterval = 10,
  openInNewTab = true,
  showCta = true,
  ctaText = "View on GitHub",
  loadingText = "Loading repository…",
  errorText = "Couldn't load this repository right now. Please try again shortly.",
  notFoundText = "Repository not found. Check the owner and repo names.",
  rateLimitText = "GitHub rate limit reached. Please wait a few minutes before trying again.",
  retryButtonText = "Retry",
}: GithubRepoCardProps) {
  const [repoData, setRepoData] = useState<GitHubRepo | null>(null);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);

  const cacheKey = `${owner}/${repo}`;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && refreshInterval > 0 && now - cached.timestamp < refreshInterval * 60 * 1000) {
      setRepoData(cached.repo);
      setContributors(cached.contributors);
      setRelease(cached.release);
      setLoading(false);
      return;
    }

    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

      if (repoResponse.status === 404) {
        setError("notFound");
        setLoading(false);
        return;
      }

      if (repoResponse.status === 403) {
        const remaining = repoResponse.headers.get("X-RateLimit-Remaining");
        if (remaining === "0") {
          setError("rateLimit");
          setLoading(false);
          return;
        }
      }

      if (!repoResponse.ok) {
        setError("generic");
        setLoading(false);
        return;
      }

      const repoJson: GitHubRepo = await repoResponse.json();
      setRepoData(repoJson);

      let contributorsData: GitHubContributor[] = [];
      if (showContributors) {
        try {
          const contributorsResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${maxContributors + 5}`
          );
          if (contributorsResponse.ok) {
            const contributorsJson: GitHubContributor[] = await contributorsResponse.json();
            contributorsData = contributorsJson.filter((c) => c.type !== "Bot").slice(0, maxContributors);
          } else if (contributorsResponse.status === 204) {
            contributorsData = [];
          }
        } catch (e) {
          contributorsData = [];
        }
      }
      setContributors(contributorsData);

      let releaseData: GitHubRelease | null = null;
      if (showLatestRelease) {
        try {
          const releaseResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
          if (releaseResponse.ok) {
            releaseData = await releaseResponse.json();
          }
        } catch (e) {
          releaseData = null;
        }
      }
      setRelease(releaseData);

      cache.set(cacheKey, {
        repo: repoJson,
        contributors: contributorsData,
        release: releaseData,
        timestamp: now,
      });

      setLoading(false);
    } catch (e) {
      setError("generic");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [owner, repo, showContributors, showLatestRelease, maxContributors, refreshInterval]);

  const animatedStars = useAnimatedCount(repoData?.stargazers_count ?? 0, animateCounts && !loading);
  const animatedForks = useAnimatedCount(repoData?.forks_count ?? 0, animateCounts && !loading);
  const animatedWatchers = useAnimatedCount(repoData?.watchers_count ?? 0, animateCounts && !loading);

  const linkTarget = openInNewTab ? "_blank" : undefined;
  const linkRel = openInNewTab ? "noopener noreferrer" : undefined;

  const rootClasses = [
    "wf-githubrepocard",
    `wf-githubrepocard--${layout}`,
    `wf-githubrepocard--${theme}`,
    `wf-githubrepocard--${cardStyle}`,
  ].join(" ");

  if (loading) {
    return (
      <div id={id} className={rootClasses}>
        <div className="wf-githubrepocard-loading">
          <div className="wf-githubrepocard-spinner"></div>
          <p className="wf-githubrepocard-loading-text">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error === "notFound" ? notFoundText : error === "rateLimit" ? rateLimitText : errorText;

    return (
      <div id={id} className={rootClasses}>
        <div className="wf-githubrepocard-error">
          <p className="wf-githubrepocard-error-text">{errorMessage}</p>
          <button className="wf-githubrepocard-retry" onClick={fetchData}>
            {retryButtonText}
          </button>
        </div>
      </div>
    );
  }

  if (!repoData) {
    return null;
  }

  const languageColor = repoData.language ? languageColors[repoData.language] ?? "#858585" : "#858585";

  return (
    <div id={id} className={rootClasses}>
      <div className="wf-githubrepocard-header">
        <a
          href={repoData.html_url}
          target={linkTarget}
          rel={linkRel}
          className="wf-githubrepocard-name"
        >
          {repoData.name}
        </a>
        {repoData.fork && <span className="wf-githubrepocard-fork-badge">Fork</span>}
      </div>

      {showDescription && repoData.description && (
        <p className="wf-githubrepocard-description">{repoData.description}</p>
      )}

      <div className="wf-githubrepocard-metadata">
        {showLanguage && repoData.language && (
          <div className="wf-githubrepocard-language">
            <span
              className="wf-githubrepocard-language-dot"
              style={{ backgroundColor: languageColor }}
            ></span>
            <span className="wf-githubrepocard-language-name">{repoData.language}</span>
          </div>
        )}

        {showStars && (
          <div className="wf-githubrepocard-stat">
            <svg className="wf-githubrepocard-icon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            <span className="wf-githubrepocard-stat-value">{formatNumber(animatedStars)}</span>
          </div>
        )}

        {showForks && (
          <div className="wf-githubrepocard-stat">
            <svg className="wf-githubrepocard-icon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
            </svg>
            <span className="wf-githubrepocard-stat-value">{formatNumber(animatedForks)}</span>
          </div>
        )}

        {showWatchers && (
          <div className="wf-githubrepocard-stat">
            <svg className="wf-githubrepocard-icon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z" />
            </svg>
            <span className="wf-githubrepocard-stat-value">{formatNumber(animatedWatchers)}</span>
          </div>
        )}

        {showOpenIssues && (
          <div className="wf-githubrepocard-stat">
            <svg className="wf-githubrepocard-icon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
            </svg>
            <span className="wf-githubrepocard-stat-value">{formatNumber(repoData.open_issues_count)}</span>
          </div>
        )}
      </div>

      {layout === "full" && (
        <>
          {showLastCommit && repoData.pushed_at && (
            <div className="wf-githubrepocard-last-commit">
              <span className="wf-githubrepocard-last-commit-label">Last commit:</span>
              <span className="wf-githubrepocard-last-commit-date">{formatDate(repoData.pushed_at)}</span>
            </div>
          )}

          {showLatestRelease && release && (
            <div className="wf-githubrepocard-release">
              <a
                href={release.html_url}
                target={linkTarget}
                rel={linkRel}
                className="wf-githubrepocard-release-tag"
              >
                {release.tag_name}
              </a>
              <span className="wf-githubrepocard-release-date">
                released {formatDate(release.published_at)}
              </span>
            </div>
          )}

          {showContributors && contributors.length > 0 && (
            <div className="wf-githubrepocard-contributors">
              <span className="wf-githubrepocard-contributors-label">Contributors:</span>
              <div className="wf-githubrepocard-contributors-avatars">
                {contributors.map((contributor) => (
                  <a
                    key={contributor.id}
                    href={contributor.html_url}
                    target={linkTarget}
                    rel={linkRel}
                    className="wf-githubrepocard-contributor-avatar"
                    title={contributor.login}
                  >
                    <img src={contributor.avatar_url} alt={contributor.login} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showCta && (
        <a
          href={repoData.html_url}
          target={linkTarget}
          rel={linkRel}
          className="wf-githubrepocard-cta"
        >
          {ctaText}
          <svg className="wf-githubrepocard-cta-icon" viewBox="0 0 16 16" width="16" height="16">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
        </a>
      )}
    </div>
  );
}