import { useState, useEffect } from "react";

export interface JobBoardProps {
  id?: string;
  boardToken?: string;
  heading?: React.ReactNode;
  subheading?: string;
  layout?: "2-column" | "3-column" | "4-column";
  cardStyle?: "minimal" | "bordered" | "elevated";
  showFilters?: boolean;
  departmentFilterLabel?: string;
  departmentFilterPlaceholder?: string;
  locationFilterLabel?: string;
  locationFilterPlaceholder?: string;
  applyButtonText?: string;
  loadingText?: string;
  showLoadingSpinner?: boolean;
  errorHeading?: string;
  errorMessage?: string;
  errorRetryButtonText?: string;
  showErrorRetryButton?: boolean;
  emptyStateHeading?: string;
  emptyStateMessage?: string;
  emptyStateResetButtonText?: string;
  showEmptyStateResetButton?: boolean;
  enablePagination?: boolean;
  initialJobsPerPage?: number;
  jobsPerPageIncrement?: number;
  loadMoreButtonText?: string;
  showJobCount?: boolean;
  jobCountText?: string;
  showDepartmentOnCard?: boolean;
  showLocationOnCard?: boolean;
  openLinksInNewTab?: boolean;
  departmentLabel?: string;
  locationLabel?: string;
}

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location?: {
    name: string;
  };
  departments?: Array<{
    id: number;
    name: string;
  }>;
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
}

export default function JobBoard({
  id,
  boardToken = "figma",
  heading = "Open Positions",
  subheading = "Join our team and help us build the future",
  layout = "3-column",
  cardStyle = "elevated",
  showFilters = true,
  departmentFilterLabel = "Department",
  departmentFilterPlaceholder = "All Departments",
  locationFilterLabel = "Location",
  locationFilterPlaceholder = "All Locations",
  applyButtonText = "Apply Now",
  loadingText = "Loading positions...",
  showLoadingSpinner = true,
  errorHeading = "Unable to Load Positions",
  errorMessage = "We're having trouble loading our open positions. Please try again later or contact us directly.",
  errorRetryButtonText = "Try Again",
  showErrorRetryButton = true,
  emptyStateHeading = "No Positions Found",
  emptyStateMessage = "There are no open positions matching your criteria. Try adjusting your filters or check back later.",
  emptyStateResetButtonText = "Clear Filters",
  showEmptyStateResetButton = true,
  enablePagination = true,
  initialJobsPerPage = 9,
  jobsPerPageIncrement = 9,
  loadMoreButtonText = "Load More Positions",
  showJobCount = true,
  jobCountText = "{count} open positions",
  showDepartmentOnCard = true,
  showLocationOnCard = true,
  openLinksInNewTab = true,
  departmentLabel = "Department:",
  locationLabel = "Location:",
}: JobBoardProps) {
  const [jobs, setJobs] = useState<GreenhouseJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<GreenhouseJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [visibleCount, setVisibleCount] = useState(initialJobsPerPage);

  useEffect(() => {
    if (!boardToken) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(
      `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch jobs");
        return response.json();
      })
      .then((data: GreenhouseResponse) => {
        if (!cancelled) {
          setJobs(data.jobs || []);
          setFilteredJobs(data.jobs || []);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [boardToken, retryCount]);

  useEffect(() => {
    let filtered = jobs;

    if (selectedDepartment) {
      filtered = filtered.filter((job) =>
        (job.departments || []).some((dept) => dept.name === selectedDepartment)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((job) => job.location?.name === selectedLocation);
    }

    setFilteredJobs(filtered);
    setVisibleCount(initialJobsPerPage);
  }, [selectedDepartment, selectedLocation, jobs, initialJobsPerPage]);

  const departments = Array.from(
    new Set(jobs.flatMap((job) => (job.departments || []).map((dept) => dept.name)))
  ).sort();

  const locations = Array.from(
    new Set(jobs.map((job) => job.location?.name).filter(Boolean))
  ).sort();

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedLocation("");
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + jobsPerPageIncrement);
  };

  const visibleJobs = enablePagination
    ? filteredJobs.slice(0, visibleCount)
    : filteredJobs;

  const hasMoreJobs = filteredJobs.length > visibleCount;

  const columnMap = {
    "2-column": "2",
    "3-column": "3",
    "4-column": "4",
  };

  const columns = columnMap[layout];

  if (loading) {
    return (
      <div id={id} className="wf-jobboard">
        <div className="wf-jobboard-loading">
          {showLoadingSpinner && (
            <div className="wf-jobboard-spinner" aria-hidden="true"></div>
          )}
          <p className="wf-jobboard-loading-text">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id={id} className="wf-jobboard">
        <div className="wf-jobboard-error">
          <h2 className="wf-jobboard-error-heading">{errorHeading}</h2>
          <p className="wf-jobboard-error-message">{errorMessage}</p>
          {showErrorRetryButton && (
            <button
              className="wf-jobboard-error-button"
              onClick={handleRetry}
              type="button"
            >
              {errorRetryButtonText}
            </button>
          )}
        </div>
      </div>
    );
  }

  const isEmpty = filteredJobs.length === 0;

  return (
    <div
      id={id}
      className="wf-jobboard"
      style={{ "--wf-jobboard-columns": columns } as React.CSSProperties}
    >
      <header className="wf-jobboard-header">
        <h2 className="wf-jobboard-heading">{heading}</h2>
        {subheading && <p className="wf-jobboard-subheading">{subheading}</p>}
      </header>

      {showFilters && (departments.length > 0 || locations.length > 0) && (
        <div className="wf-jobboard-filters">
          {departments.length > 0 && (
            <div className="wf-jobboard-filter-group">
              <label htmlFor="department-filter" className="wf-jobboard-filter-label">
                {departmentFilterLabel}
              </label>
              <select
                id="department-filter"
                className="wf-jobboard-filter-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">{departmentFilterPlaceholder}</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          {locations.length > 0 && (
            <div className="wf-jobboard-filter-group">
              <label htmlFor="location-filter" className="wf-jobboard-filter-label">
                {locationFilterLabel}
              </label>
              <select
                id="location-filter"
                className="wf-jobboard-filter-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">{locationFilterPlaceholder}</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {showJobCount && !isEmpty && (
        <div className="wf-jobboard-count">
          {jobCountText.replace("{count}", String(filteredJobs.length))}
        </div>
      )}

      {isEmpty ? (
        <div className="wf-jobboard-empty">
          <h3 className="wf-jobboard-empty-heading">{emptyStateHeading}</h3>
          <p className="wf-jobboard-empty-message">{emptyStateMessage}</p>
          {showEmptyStateResetButton &&
            (selectedDepartment || selectedLocation) && (
              <button
                className="wf-jobboard-empty-button"
                onClick={handleResetFilters}
                type="button"
              >
                {emptyStateResetButtonText}
              </button>
            )}
        </div>
      ) : (
        <>
          <div className={`wf-jobboard-grid wf-jobboard-grid-${layout}`}>
            {visibleJobs.map((job) => (
              <article
                key={job.id}
                className={`wf-jobboard-card wf-jobboard-card-${cardStyle}`}
              >
                <h3 className="wf-jobboard-card-title">{job.title}</h3>

                <div className="wf-jobboard-card-meta">
                  {showDepartmentOnCard && (job.departments || []).length > 0 && (
                    <div className="wf-jobboard-card-department">
                      <span className="wf-jobboard-card-label">
                        {departmentLabel}
                      </span>{" "}
                      {(job.departments || [])[0]?.name}
                    </div>
                  )}

                  {showLocationOnCard && (
                    <div className="wf-jobboard-card-location">
                      <span className="wf-jobboard-card-label">
                        {locationLabel}
                      </span>{" "}
                      {job.location?.name}
                    </div>
                  )}
                </div>

                <a
                  href={job.absolute_url}
                  className="wf-jobboard-card-button"
                  target={openLinksInNewTab ? "_blank" : undefined}
                  rel={openLinksInNewTab ? "noopener noreferrer" : undefined}
                >
                  {applyButtonText}
                </a>
              </article>
            ))}
          </div>

          {enablePagination && hasMoreJobs && (
            <div className="wf-jobboard-pagination">
              <button
                className="wf-jobboard-load-more"
                onClick={handleLoadMore}
                type="button"
              >
                {loadMoreButtonText}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}