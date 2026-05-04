import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import StatsCounter from "./components/StatsCounter/StatsCounter"
import "./components/StatsCounter/StatsCounter.css"

type ThemeVars = {
  "--background-primary": string
  "--background-secondary": string
  "--text-primary": string
  "--text-secondary": string
  "--border-color": string
  "--accent-color": string
  "--accent-text-color": string
  "--border-radius": string
}

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
}

function App() {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "brand" | "custom">("light")
  const [customVars, setCustomVars] = useState<ThemeVars>(themes.light)

  const currentVars = activeTheme === "custom" ? customVars : themes[activeTheme]

  const handleThemeChange = (theme: "light" | "dark" | "brand" | "custom") => {
    setActiveTheme(theme)
    if (theme !== "custom") {
      setCustomVars(themes[theme])
    }
  }

  const handleCustomVarChange = (key: keyof ThemeVars, value: string) => {
    setCustomVars((prev) => ({ ...prev, [key]: value }))
  }

  const pageBackground = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef7f0" : "#f9fafb"

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: pageBackground,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      padding: "40px 20px",
      transition: "background 0.3s ease"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ marginBottom: "48px" }}>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            marginBottom: "8px",
            color: currentVars["--text-primary"]
          }}>
            StatsCounter Component Preview
          </h1>
          <p style={{ 
            fontSize: "16px", 
            color: currentVars["--text-secondary"],
            marginBottom: "24px"
          }}>
            A horizontal or grid bar of animated stat counters with scroll-triggered animations
          </p>

          <div style={{ 
            display: "flex", 
            gap: "8px", 
            marginBottom: "24px",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => handleThemeChange("light")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "light" ? "2px solid #2563eb" : "1px solid #e5e5e5",
                borderRadius: "6px",
                background: activeTheme === "light" ? "#eff6ff" : "#ffffff",
                color: "#1a1a1a",
                fontWeight: activeTheme === "light" ? "600" : "400",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "dark" ? "2px solid #3b82f6" : "1px solid #2a2a2a",
                borderRadius: "6px",
                background: activeTheme === "dark" ? "#1e293b" : "#1a1a1a",
                color: "#fafafa",
                fontWeight: activeTheme === "dark" ? "600" : "400",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("brand")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "brand" ? "2px solid #ea580c" : "1px solid #e7e5e4",
                borderRadius: "6px",
                background: activeTheme === "brand" ? "#fed7aa" : "#fef7f0",
                color: "#1c1917",
                fontWeight: activeTheme === "brand" ? "600" : "400",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Brand
            </button>
            <button
              onClick={() => handleThemeChange("custom")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "custom" ? "2px solid #7c3aed" : "1px solid #e5e5e5",
                borderRadius: "6px",
                background: activeTheme === "custom" ? "#f5f3ff" : "#ffffff",
                color: "#1a1a1a",
                fontWeight: activeTheme === "custom" ? "600" : "400",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Custom
            </button>
          </div>

          {activeTheme === "custom" && (
            <div style={{
              background: currentVars["--background-secondary"],
              border: `1px solid ${currentVars["--border-color"]}`,
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "24px"
            }}>
              <h3 style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                marginBottom: "16px",
                color: currentVars["--text-primary"]
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
                      marginBottom: "4px",
                      color: currentVars["--text-secondary"]
                    }}>
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: `1px solid ${currentVars["--border-color"]}`,
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        background: currentVars["--background-primary"],
                        color: currentVars["--text-primary"]
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: "600", 
              marginBottom: "24px",
              color: currentVars["--text-primary"]
            }}>
              Default Configuration
            </h2>
            <StatsCounter
              id="stats-default"
              layout="row"
              alignment="center"
              dividerStyle="line"
              numberSize="large"
              heading="By the Numbers"
              subheading="A snapshot of what we've built together"
              showHeading={true}
              animationDuration={2000}
              animateOnScroll={true}
              animateOnce={true}
              stat1Value={12000}
              stat1Prefix=""
              stat1Suffix="+"
              stat1Label="Happy customers"
              stat1Description="Across 40 countries"
              stat1Visible={true}
              stat2Value={98}
              stat2Prefix=""
              stat2Suffix="%"
              stat2Label="Customer satisfaction"
              stat2Description="Based on annual NPS survey"
              stat2Visible={true}
              stat3Value={250}
              stat3Prefix="$"
              stat3Suffix="M"
              stat3Label="Funding raised"
              stat3Description="Series C lead by Sequoia"
              stat3Visible={true}
              stat4Value={150}
              stat4Prefix=""
              stat4Suffix=""
              stat4Label="Team members"
              stat4Description="Remote-first across 12 time zones"
              stat4Visible={true}
              stat5Value={0}
              stat5Prefix=""
              stat5Suffix=""
              stat5Label="Awards won"
              stat5Description=""
              stat5Visible={false}
              stat6Value={0}
              stat6Prefix=""
              stat6Suffix=""
              stat6Label=""
              stat6Description=""
              stat6Visible={false}
            />
          </section>

          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: "600", 
              marginBottom: "24px",
              color: currentVars["--text-primary"]
            }}>
              Grid Layout with 6 Stats
            </h2>
            <StatsCounter
              id="stats-grid"
              layout="grid"
              alignment="left"
              dividerStyle="none"
              numberSize="xlarge"
              heading="Company Milestones"
              subheading="Our journey in numbers"
              showHeading={true}
              animationDuration={2500}
              animateOnScroll={true}
              animateOnce={false}
              stat1Value={5000}
              stat1Prefix=""
              stat1Suffix="+"
              stat1Label="Projects delivered"
              stat1Description="Since 2015"
              stat1Visible={true}
              stat2Value={99.9}
              stat2Prefix=""
              stat2Suffix="%"
              stat2Label="Uptime"
              stat2Description="Last 12 months"
              stat2Visible={true}
              stat3Value={45}
              stat3Prefix=""
              stat3Suffix=""
              stat3Label="Countries"
              stat3Description="Global presence"
              stat3Visible={true}
              stat4Value={200}
              stat4Prefix=""
              stat4Suffix="K"
              stat4Label="Active users"
              stat4Description="Monthly average"
              stat4Visible={true}
              stat5Value={15}
              stat5Prefix=""
              stat5Suffix=""
              stat5Label="Industry awards"
              stat5Description="2023 alone"
              stat5Visible={true}
              stat6Value={24}
              stat6Prefix=""
              stat6Suffix="/7"
              stat6Label="Support"
              stat6Description="Always here for you"
              stat6Visible={true}
            />
          </section>

          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: "600", 
              marginBottom: "24px",
              color: currentVars["--text-primary"]
            }}>
              Financial Stats with Dot Dividers
            </h2>
            <StatsCounter
              id="stats-financial"
              layout="row"
              alignment="center"
              dividerStyle="dot"
              numberSize="medium"
              heading=""
              subheading=""
              showHeading={false}
              animationDuration={1500}
              animateOnScroll={true}
              animateOnce={true}
              stat1Value={500}
              stat1Prefix="$"
              stat1Suffix="M"
              stat1Label="Annual revenue"
              stat1Description="FY 2023"
              stat1Visible={true}
              stat2Value={125}
              stat2Prefix="$"
              stat2Suffix="M"
              stat2Label="ARR"
              stat2Description="Recurring revenue"
              stat2Visible={true}
              stat3Value={3.5}
              stat3Prefix=""
              stat3Suffix="x"
              stat3Label="YoY growth"
              stat3Description="Year over year"
              stat3Visible={true}
              stat4Value={0}
              stat4Prefix=""
              stat4Suffix=""
              stat4Label=""
              stat4Description=""
              stat4Visible={false}
              stat5Value={0}
              stat5Prefix=""
              stat5Suffix=""
              stat5Label=""
              stat5Description=""
              stat5Visible={false}
              stat6Value={0}
              stat6Prefix=""
              stat6Suffix=""
              stat6Label=""
              stat6Description=""
              stat6Visible={false}
            />
          </section>

          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: "600", 
              marginBottom: "24px",
              color: currentVars["--text-primary"]
            }}>
              Right-Aligned with No Animation on Scroll
            </h2>
            <StatsCounter
              id="stats-right-aligned"
              layout="row"
              alignment="right"
              dividerStyle="line"
              numberSize="large"
              heading="Performance Metrics"
              subheading="Real-time dashboard"
              showHeading={true}
              animationDuration={3000}
              animateOnScroll={false}
              animateOnce={true}
              stat1Value={1250}
              stat1Prefix="~"
              stat1Suffix=""
              stat1Label="Requests/sec"
              stat1Description="Peak traffic"
              stat1Visible={true}
              stat2Value={42}
              stat2Prefix=""
              stat2Suffix="ms"
              stat2Label="Response time"
              stat2Description="P95 latency"
              stat2Visible={true}
              stat3Value={8}
              stat3Prefix=""
              stat3Suffix="TB"
              stat3Label="Data processed"
              stat3Description="Daily average"
              stat3Visible={true}
              stat4Value={99.99}
              stat4Prefix=""
              stat4Suffix="%"
              stat4Label="Availability"
              stat4Description="SLA guarantee"
              stat4Visible={true}
              stat5Value={0}
              stat5Prefix=""
              stat5Suffix=""
              stat5Label=""
              stat5Description=""
              stat5Visible={false}
              stat6Value={0}
              stat6Prefix=""
              stat6Suffix=""
              stat6Label=""
              stat6Description=""
              stat6Visible={false}
            />
          </section>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)