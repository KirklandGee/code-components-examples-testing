import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import JobBoard from "./components/JobBoard/JobBoard";
import "./components/JobBoard/JobBoard.css";

type ThemeVars = {
  "--background-primary": string;
  "--background-secondary": string;
  "--text-primary": string;
  "--text-secondary": string;
  "--border-color": string;
  "--accent-color": string;
  "--accent-text-color": string;
  "--border-radius": string;
};

const themes: Record<string, ThemeVars> = {
  light: {
    "--background-primary": "#ffffff",
    "--background-secondary": "#f5f5f5",
    "--text-primary": "#1a1a1a",
    "--text-secondary": "#737373",
    "--border-color": "#e5e5e5",
    "--accent-color": "#2563eb",
    "--accent-text-color": "#ffffff",
    "--border-radius": "8px",
  },
  dark: {
    "--background-primary": "#0a0a0a",
    "--background-secondary": "#1a1a1a",
    "--text-primary": "#fafafa",
    "--text-secondary": "#a3a3a3",
    "--border-color": "#2a2a2a",
    "--accent-color": "#3b82f6",
    "--accent-text-color": "#ffffff",
    "--border-radius": "8px",
  },
  brand: {
    "--background-primary": "#fef7f0",
    "--background-secondary": "#fde8d0",
    "--text-primary": "#1c1917",
    "--text-secondary": "#78716c",
    "--border-color": "#e7e5e4",
    "--accent-color": "#ea580c",
    "--accent-text-color": "#ffffff",
    "--border-radius": "12px",
  },
};

function App() {
  const [activeTheme, setActiveTheme] = useState<string>("light");
  const [customVars, setCustomVars] = useState<ThemeVars>(themes.light);
  const [boardToken, setBoardToken] = useState("");

  const handleThemeChange = (themeName: string) => {
    setActiveTheme(themeName);
    if (themeName !== "custom") {
      setCustomVars(themes[themeName]);
    }
  };

  const handleCustomVarChange = (varName: keyof ThemeVars, value: string) => {
    setCustomVars((prev) => ({
      ...prev,
      [varName]: value,
    }));
  };

  const currentVars = activeTheme === "custom" ? customVars : themes[activeTheme];
  const pageBackground = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef2e8" : "#f9fafb";

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: pageBackground,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ 
          background: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ 
            margin: "0 0 8px 0", 
            fontSize: "24px", 
            fontWeight: "600",
            color: "#111827"
          }}>
            JobBoard Component Preview
          </h1>
          <p style={{ 
            margin: "0 0 24px 0", 
            fontSize: "14px", 
            color: "#6b7280"
          }}>
            Local development environment with theme preview system
          </p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: activeTheme === "custom" ? "20px" : "0" }}>
            {["light", "dark", "brand", "custom"].map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                style={{
                  padding: "10px 20px",
                  border: activeTheme === theme ? "2px solid #2563eb" : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  background: activeTheme === theme ? "#eff6ff" : "white",
                  color: activeTheme === theme ? "#2563eb" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.2s"
                }}
              >
                {theme}
              </button>
            ))}
          </div>

          {activeTheme === "custom" && (
            <div style={{ 
              marginTop: "20px",
              padding: "20px",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ 
                margin: "0 0 16px 0", 
                fontSize: "16px", 
                fontWeight: "600",
                color: "#111827"
              }}>
                Custom Theme Editor
              </h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "16px" 
              }}>
                {Object.entries(customVars).map(([key, value]) => (
                  <div key={key}>
                    <label style={{ 
                      display: "block", 
                      fontSize: "12px", 
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px"
                    }}>
                      {key}
                    </label>
                    <input
                      type={key === "--border-radius" ? "text" : "color"}
                      value={value}
                      onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                      style={{
                        width: "100%",
                        padding: key === "--border-radius" ? "8px" : "4px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <h3 style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "600",
              color: "#111827"
            }}>
              API Configuration
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#374151"
              }}>
                Greenhouse Board Token
              </label>
              <input
                type="text"
                value={boardToken}
                onChange={(e) => setBoardToken(e.target.value)}
                placeholder="Enter your Greenhouse board token (e.g. acme)"
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "400px"
                }}
              />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>
                This is the public board token from your Greenhouse account URL
              </span>
            </div>
          </div>
        </div>

        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: "64px" }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "24px",
              color: currentVars["--text-primary"]
            }}>
              Default Configuration
            </h2>
            <JobBoard
              id="default-job-board"
              boardToken={boardToken}
              heading="Open Positions"
              subheading="Join our team and help us build the future"
              layout="3-column"
              cardStyle="elevated"
              showFilters={true}
              departmentFilterLabel="Department"
              departmentFilterPlaceholder="All Departments"
              locationFilterLabel="Location"
              locationFilterPlaceholder="All Locations"
              applyButtonText="Apply Now"
              loadingText="Loading positions..."
              showLoadingSpinner={true}
              errorHeading="Unable to Load Positions"
              errorMessage="We're having trouble loading our open positions. Please try again later or contact us directly."
              errorRetryButtonText="Try Again"
              showErrorRetryButton={true}
              emptyStateHeading="No Positions Found"
              emptyStateMessage="There are no open positions matching your criteria. Try adjusting your filters or check back later."
              emptyStateResetButtonText="Clear Filters"
              showEmptyStateResetButton={true}
              enablePagination={true}
              initialJobsPerPage={9}
              jobsPerPageIncrement={9}
              loadMoreButtonText="Load More Positions"
              showJobCount={true}
              jobCountText="{count} open positions"
              showDepartmentOnCard={true}
              showLocationOnCard={true}
              openLinksInNewTab={true}
              departmentLabel="Department:"
              locationLabel="Location:"
            />
          </section>

          <section style={{ marginBottom: "64px" }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "24px",
              color: currentVars["--text-primary"]
            }}>
              Variation: 2-Column Minimal Style
            </h2>
            <JobBoard
              id="minimal-job-board"
              boardToken={boardToken}
              heading="Career Opportunities"
              subheading="Discover your next role with us"
              layout="2-column"
              cardStyle="minimal"
              showFilters={true}
              departmentFilterLabel="Team"
              departmentFilterPlaceholder="All Teams"
              locationFilterLabel="Office"
              locationFilterPlaceholder="All Offices"
              applyButtonText="View Position"
              loadingText="Fetching opportunities..."
              showLoadingSpinner={true}
              errorHeading="Oops! Something went wrong"
              errorMessage="Unable to retrieve job listings at this time."
              errorRetryButtonText="Reload"
              showErrorRetryButton={true}
              emptyStateHeading="No Matches"
              emptyStateMessage="Try different filter options to see more positions."
              emptyStateResetButtonText="Reset"
              showEmptyStateResetButton={true}
              enablePagination={true}
              initialJobsPerPage={6}
              jobsPerPageIncrement={6}
              loadMoreButtonText="Show More"
              showJobCount={true}
              jobCountText="Showing {count} positions"
              showDepartmentOnCard={true}
              showLocationOnCard={true}
              openLinksInNewTab={true}
              departmentLabel="Team:"
              locationLabel="Office:"
            />
          </section>

          <section style={{ marginBottom: "64px" }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "24px",
              color: currentVars["--text-primary"]
            }}>
              Variation: 4-Column Bordered with Custom Labels
            </h2>
            <JobBoard
              id="compact-job-board"
              boardToken={boardToken}
              heading="Join Our Team"
              subheading="We're hiring across multiple departments"
              layout="4-column"
              cardStyle="bordered"
              showFilters={false}
              departmentFilterLabel="Department"
              departmentFilterPlaceholder="All Departments"
              locationFilterLabel="Location"
              locationFilterPlaceholder="All Locations"
              applyButtonText="Submit Application"
              loadingText="Please wait..."
              showLoadingSpinner={false}
              errorHeading="Error Loading Jobs"
              errorMessage="Please refresh the page or contact support."
              errorRetryButtonText="Refresh"
              showErrorRetryButton={false}
              emptyStateHeading="Check Back Soon"
              emptyStateMessage="We don't have any openings right now, but we're always growing."
              emptyStateResetButtonText="View All"
              showEmptyStateResetButton={false}
              enablePagination={false}
              initialJobsPerPage={12}
              jobsPerPageIncrement={12}
              loadMoreButtonText="Load More"
              showJobCount={false}
              jobCountText="{count} roles available"
              showDepartmentOnCard={false}
              showLocationOnCard={true}
              openLinksInNewTab={false}
              departmentLabel="Dept:"
              locationLabel="📍"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);