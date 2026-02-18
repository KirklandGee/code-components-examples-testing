import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import HeroSection from "./components/HeroSection/HeroSection"
import "./components/HeroSection/HeroSection.css"

type ThemeVariables = {
  "--background-primary": string
  "--background-secondary": string
  "--text-primary": string
  "--text-secondary": string
  "--border-color": string
  "--accent-color": string
  "--accent-text-color": string
  "--border-radius": string
}

const themes: Record<string, ThemeVariables> = {
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
  const [customVars, setCustomVars] = useState<ThemeVariables>(themes.light)

  const currentVars = activeTheme === "custom" ? customVars : themes[activeTheme]

  const handleThemeChange = (theme: "light" | "dark" | "brand" | "custom") => {
    setActiveTheme(theme)
    if (theme !== "custom") {
      setCustomVars(themes[theme])
    }
  }

  const handleCustomVarChange = (key: keyof ThemeVariables, value: string) => {
    setCustomVars((prev) => ({ ...prev, [key]: value }))
  }

  const pageBackgroundColor = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef3e8" : "#f9fafb"

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: pageBackgroundColor,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      transition: "background-color 0.3s ease"
    }}>
      <div style={{ 
        position: "sticky", 
        top: 0, 
        backgroundColor: currentVars["--background-primary"],
        borderBottom: `1px solid ${currentVars["--border-color"]}`,
        padding: "1.5rem",
        zIndex: 1000,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ 
            margin: "0 0 1rem 0", 
            fontSize: "1.25rem", 
            fontWeight: 600,
            color: currentVars["--text-primary"]
          }}>
            Theme Preview
          </h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: activeTheme === "custom" ? "1.5rem" : "0" }}>
            <button
              onClick={() => handleThemeChange("light")}
              style={{
                padding: "0.5rem 1rem",
                border: `2px solid ${activeTheme === "light" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: currentVars["--border-radius"],
                backgroundColor: activeTheme === "light" ? currentVars["--accent-color"] : currentVars["--background-secondary"],
                color: activeTheme === "light" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.875rem",
                transition: "all 0.2s ease"
              }}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              style={{
                padding: "0.5rem 1rem",
                border: `2px solid ${activeTheme === "dark" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: currentVars["--border-radius"],
                backgroundColor: activeTheme === "dark" ? currentVars["--accent-color"] : currentVars["--background-secondary"],
                color: activeTheme === "dark" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.875rem",
                transition: "all 0.2s ease"
              }}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("brand")}
              style={{
                padding: "0.5rem 1rem",
                border: `2px solid ${activeTheme === "brand" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: currentVars["--border-radius"],
                backgroundColor: activeTheme === "brand" ? currentVars["--accent-color"] : currentVars["--background-secondary"],
                color: activeTheme === "brand" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.875rem",
                transition: "all 0.2s ease"
              }}
            >
              Brand
            </button>
            <button
              onClick={() => handleThemeChange("custom")}
              style={{
                padding: "0.5rem 1rem",
                border: `2px solid ${activeTheme === "custom" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: currentVars["--border-radius"],
                backgroundColor: activeTheme === "custom" ? currentVars["--accent-color"] : currentVars["--background-secondary"],
                color: activeTheme === "custom" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.875rem",
                transition: "all 0.2s ease"
              }}
            >
              Custom
            </button>
          </div>

          {activeTheme === "custom" && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "1rem",
              padding: "1rem",
              backgroundColor: currentVars["--background-secondary"],
              borderRadius: currentVars["--border-radius"],
              border: `1px solid ${currentVars["--border-color"]}`
            }}>
              {Object.entries(customVars).map(([key, value]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <label style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: 500,
                    color: currentVars["--text-secondary"],
                    textTransform: "capitalize"
                  }}>
                    {key.replace("--", "").replace(/-/g, " ")}
                  </label>
                  <input
                    type={key === "--border-radius" ? "text" : "color"}
                    value={value}
                    onChange={(e) => handleCustomVarChange(key as keyof ThemeVariables, e.target.value)}
                    style={{
                      padding: "0.375rem",
                      border: `1px solid ${currentVars["--border-color"]}`,
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      backgroundColor: currentVars["--background-primary"],
                      color: currentVars["--text-primary"],
                      cursor: "pointer"
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={currentVars as React.CSSProperties}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1rem" }}>
          <section style={{ marginBottom: "4rem" }}>
            <h3 style={{ 
              fontSize: "1.5rem", 
              fontWeight: 600, 
              marginBottom: "1.5rem",
              color: currentVars["--text-primary"]
            }}>
              Default Configuration
            </h3>
            <HeroSection
              layout="centered"
              size="large"
              headline="Build Something Amazing"
              subheading="Create powerful experiences that drive results and delight your customers"
              ctaText="Get Started"
              ctaLink={{ href: "#get-started" }}
              showSecondaryCta={true}
              secondaryCtaText="Learn More"
              secondaryCtaLink={{ href: "#learn-more" }}
              showBackgroundImage={false}
              overlayOpacity="medium"
              showBadge={true}
              badgeText="New Release"
              contentMaxWidth="medium"
            />
          </section>

          <section style={{ marginBottom: "4rem" }}>
            <h3 style={{ 
              fontSize: "1.5rem", 
              fontWeight: 600, 
              marginBottom: "1.5rem",
              color: currentVars["--text-primary"]
            }}>
              Left-Aligned with Background Image
            </h3>
            <HeroSection
              layout="left"
              size="full"
              headline="Transform Your Digital Presence"
              subheading="Leverage cutting-edge technology to create unforgettable user experiences that convert"
              ctaText="Start Free Trial"
              ctaLink={{ href: "#trial" }}
              showSecondaryCta={true}
              secondaryCtaText="View Demo"
              secondaryCtaLink={{ href: "#demo" }}
              showBackgroundImage={true}
              backgroundImage={{ 
                src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",
                alt: "Technology background"
              }}
              overlayOpacity="dark"
              showBadge={false}
              contentMaxWidth="wide"
            />
          </section>

          <section style={{ marginBottom: "4rem" }}>
            <h3 style={{ 
              fontSize: "1.5rem", 
              fontWeight: 600, 
              marginBottom: "1.5rem",
              color: currentVars["--text-primary"]
            }}>
              Minimal Centered Layout
            </h3>
            <HeroSection
              layout="centered"
              size="medium"
              headline="Simple. Powerful. Effective."
              subheading="Everything you need to succeed, nothing you don't"
              ctaText="Explore Features"
              ctaLink={{ href: "#features" }}
              showSecondaryCta={false}
              showBackgroundImage={false}
              overlayOpacity="none"
              showBadge={true}
              badgeText="v2.0 Available"
              contentMaxWidth="narrow"
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