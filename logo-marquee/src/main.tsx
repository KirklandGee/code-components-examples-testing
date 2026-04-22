import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import LogoMarquee from "./components/LogoMarquee/LogoMarquee"
import "./components/LogoMarquee/LogoMarquee.css"

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

const lightTheme: ThemeVars = {
  "--background-primary": "#ffffff",
  "--background-secondary": "#f5f5f5",
  "--text-primary": "#1a1a1a",
  "--text-secondary": "#737373",
  "--border-color": "#e5e5e5",
  "--accent-color": "#2563eb",
  "--accent-text-color": "#ffffff",
  "--border-radius": "8px",
}

const darkTheme: ThemeVars = {
  "--background-primary": "#0a0a0a",
  "--background-secondary": "#1a1a1a",
  "--text-primary": "#fafafa",
  "--text-secondary": "#a3a3a3",
  "--border-color": "#2a2a2a",
  "--accent-color": "#3b82f6",
  "--accent-text-color": "#ffffff",
  "--border-radius": "8px",
}

const brandTheme: ThemeVars = {
  "--background-primary": "#fef7f0",
  "--background-secondary": "#fde8d0",
  "--text-primary": "#1c1917",
  "--text-secondary": "#78716c",
  "--border-color": "#e7e5e4",
  "--accent-color": "#ea580c",
  "--accent-text-color": "#ffffff",
  "--border-radius": "12px",
}

function App() {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "brand" | "custom">("light")
  const [customVars, setCustomVars] = useState<ThemeVars>(lightTheme)

  const getCurrentTheme = (): ThemeVars => {
    switch (activeTheme) {
      case "light":
        return lightTheme
      case "dark":
        return darkTheme
      case "brand":
        return brandTheme
      case "custom":
        return customVars
    }
  }

  const handleThemeChange = (theme: "light" | "dark" | "brand" | "custom") => {
    setActiveTheme(theme)
    if (theme !== "custom") {
      const newTheme = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : brandTheme
      setCustomVars(newTheme)
    }
  }

  const handleCustomVarChange = (key: keyof ThemeVars, value: string) => {
    setCustomVars((prev) => ({ ...prev, [key]: value }))
  }

  const currentTheme = getCurrentTheme()

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: currentTheme["--background-primary"],
    borderBottom: `1px solid ${currentTheme["--border-color"]}`,
    padding: "1.5rem",
    marginBottom: "2rem",
  }

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    border: `1px solid ${currentTheme["--border-color"]}`,
    borderRadius: currentTheme["--border-radius"],
    backgroundColor: isActive ? currentTheme["--accent-color"] : currentTheme["--background-secondary"],
    color: isActive ? currentTheme["--accent-text-color"] : currentTheme["--text-primary"],
    cursor: "pointer",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "all 0.2s",
  })

  const inputStyle: React.CSSProperties = {
    padding: "0.5rem",
    border: `1px solid ${currentTheme["--border-color"]}`,
    borderRadius: currentTheme["--border-radius"],
    backgroundColor: currentTheme["--background-secondary"],
    color: currentTheme["--text-primary"],
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "0.875rem",
    width: "120px",
  }

  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: currentTheme["--text-secondary"],
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: currentTheme["--background-secondary"] }}>
      <div style={headerStyle}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              margin: "0 0 1rem 0",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: currentTheme["--text-primary"],
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            LogoMarquee Preview
          </h1>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <button style={buttonStyle(activeTheme === "light")} onClick={() => handleThemeChange("light")}>
              Light
            </button>
            <button style={buttonStyle(activeTheme === "dark")} onClick={() => handleThemeChange("dark")}>
              Dark
            </button>
            <button style={buttonStyle(activeTheme === "brand")} onClick={() => handleThemeChange("brand")}>
              Brand
            </button>
            <button style={buttonStyle(activeTheme === "custom")} onClick={() => handleThemeChange("custom")}>
              Custom
            </button>
          </div>

          {activeTheme === "custom" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: currentTheme["--background-secondary"],
                border: `1px solid ${currentTheme["--border-color"]}`,
                borderRadius: currentTheme["--border-radius"],
              }}
            >
              <label style={labelStyle}>
                <span>Background Primary</span>
                <input
                  type="color"
                  value={customVars["--background-primary"]}
                  onChange={(e) => handleCustomVarChange("--background-primary", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                <span>Background Secondary</span>
                <input
                  type="color"
                  value={customVars["--background-secondary"]}
                  onChange={(e) => handleCustomVarChange("--background-secondary", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                <span>Text Primary</span>
                <input
                  type="color"
                  value={customVars["--text-primary"]}
                  onChange={(e) => handleCustomVarChange("--text-primary", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                <span>Text Secondary</span>
                <input
                  type="color"
                  value={customVars["--text-secondary"]}
                  onChange={(e) => handleCustomVarChange("--text-secondary", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                <span>Border Color</span>
                <input
                  type="color"
                  value={customVars["--border-color"]}
                  onChange={(e) => handleCustomVarChange("--border-color", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                <span>Accent Color</span>
                <input
                  type="color"
                  value={customVars["--accent-color"]}
                  onChange={(e) => handleCustomVarChange("--accent-color", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                <span>Accent Text Color</span>
                <input
                  type="color"
                  value={customVars["--accent-text-color"]}
                  onChange={(e) => handleCustomVarChange("--accent-text-color", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                <span>Border Radius</span>
                <input
                  type="text"
                  value={customVars["--border-radius"]}
                  onChange={(e) => handleCustomVarChange("--border-radius", e.target.value)}
                  style={inputStyle}
                  placeholder="8px"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div style={currentTheme as React.CSSProperties}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <section style={{ marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                color: currentTheme["--text-primary"],
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              Default Configuration
            </h2>
            <LogoMarquee
              heading="Trusted by teams at"
              showHeading={true}
              direction="left"
              speed={40}
              pauseOnHover={true}
              grayscale={true}
              fadeEdges={true}
              logoHeight={40}
              logoGap={64}
              ariaLabel="Partner and customer logos"
              logo1={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo1Visible={true}
              logo2={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo2Visible={true}
              logo3={{ src: "https://images.unsplash.com/photo-1614680376408-81e0b6e8c4c7?w=200&h=80&fit=crop" }}
              logo3Visible={true}
              logo4={{ src: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=80&fit=crop" }}
              logo4Visible={true}
              logo5={{ src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop" }}
              logo5Visible={true}
              logo6={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo6Visible={true}
              logo7={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo7Visible={true}
              logo8={{ src: "https://images.unsplash.com/photo-1614680376408-81e0b6e8c4c7?w=200&h=80&fit=crop" }}
              logo8Visible={true}
              logo9={{ src: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=80&fit=crop" }}
              logo9Visible={false}
              logo10={{ src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop" }}
              logo10Visible={false}
              logo11={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo11Visible={false}
              logo12={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo12Visible={false}
            />
          </section>

          <section style={{ marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                color: currentTheme["--text-primary"],
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              Fast Scroll, Right Direction, No Grayscale
            </h2>
            <LogoMarquee
              heading="Featured in"
              showHeading={true}
              direction="right"
              speed={20}
              pauseOnHover={false}
              grayscale={false}
              fadeEdges={true}
              logoHeight={50}
              logoGap={80}
              ariaLabel="Press and media logos"
              logo1={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo1Visible={true}
              logo2={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo2Visible={true}
              logo3={{ src: "https://images.unsplash.com/photo-1614680376408-81e0b6e8c4c7?w=200&h=80&fit=crop" }}
              logo3Visible={true}
              logo4={{ src: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=80&fit=crop" }}
              logo4Visible={true}
              logo5={{ src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop" }}
              logo5Visible={true}
              logo6={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo6Visible={true}
              logo7={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo7Visible={false}
              logo8={{ src: "https://images.unsplash.com/photo-1614680376408-81e0b6e8c4c7?w=200&h=80&fit=crop" }}
              logo8Visible={false}
              logo9={{ src: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=80&fit=crop" }}
              logo9Visible={false}
              logo10={{ src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop" }}
              logo10Visible={false}
              logo11={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo11Visible={false}
              logo12={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo12Visible={false}
            />
          </section>

          <section style={{ marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                color: currentTheme["--text-primary"],
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              Compact Style, No Heading, No Edge Fade
            </h2>
            <LogoMarquee
              showHeading={false}
              direction="left"
              speed={30}
              pauseOnHover={true}
              grayscale={true}
              fadeEdges={false}
              logoHeight={32}
              logoGap={48}
              ariaLabel="Client logos"
              logo1={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo1Link={{ href: "https://example.com/client1" }}
              logo1Visible={true}
              logo2={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo2Link={{ href: "https://example.com/client2" }}
              logo2Visible={true}
              logo3={{ src: "https://images.unsplash.com/photo-1614680376408-81e0b6e8c4c7?w=200&h=80&fit=crop" }}
              logo3Link={{ href: "https://example.com/client3" }}
              logo3Visible={true}
              logo4={{ src: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=80&fit=crop" }}
              logo4Link={{ href: "https://example.com/client4" }}
              logo4Visible={true}
              logo5={{ src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop" }}
              logo5Link={{ href: "https://example.com/client5" }}
              logo5Visible={true}
              logo6={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo6Link={{ href: "https://example.com/client6" }}
              logo6Visible={true}
              logo7={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo7Link={{ href: "https://example.com/client7" }}
              logo7Visible={true}
              logo8={{ src: "https://images.unsplash.com/photo-1614680376408-81e0b6e8c4c7?w=200&h=80&fit=crop" }}
              logo8Link={{ href: "https://example.com/client8" }}
              logo8Visible={true}
              logo9={{ src: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=80&fit=crop" }}
              logo9Link={{ href: "https://example.com/client9" }}
              logo9Visible={true}
              logo10={{ src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop" }}
              logo10Link={{ href: "https://example.com/client10" }}
              logo10Visible={true}
              logo11={{ src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop" }}
              logo11Visible={false}
              logo12={{ src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop" }}
              logo12Visible={false}
            />
          </section>
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Root element not found")

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)