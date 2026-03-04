import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import Badge from "./components/Badge/Badge"
import "./components/Badge/Badge.css"

const themes = {
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
  const [customVars, setCustomVars] = useState(themes.light)

  const currentVars = activeTheme === "custom" ? customVars : themes[activeTheme]

  const handleThemeChange = (theme: "light" | "dark" | "brand" | "custom") => {
    setActiveTheme(theme)
    if (theme !== "custom") {
      setCustomVars(themes[theme])
    }
  }

  const handleCustomVarChange = (varName: string, value: string) => {
    setCustomVars((prev) => ({
      ...prev,
      [varName]: value,
    }))
  }

  const pageBackgroundColor = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef7f0" : "#f9fafb"

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: pageBackgroundColor,
      transition: "background-color 0.3s ease"
    }}>
      <div style={{
        position: "sticky",
        top: 0,
        backgroundColor: currentVars["--background-primary"],
        borderBottom: `1px solid ${currentVars["--border-color"]}`,
        padding: "20px",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <h2 style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            fontWeight: "600",
            color: currentVars["--text-primary"],
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Theme Preview
          </h2>
          <div style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap"
          }}>
            {(["light", "dark", "brand", "custom"] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                style={{
                  padding: "8px 16px",
                  border: `2px solid ${activeTheme === theme ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                  borderRadius: currentVars["--border-radius"],
                  backgroundColor: activeTheme === theme ? currentVars["--accent-color"] : currentVars["--background-secondary"],
                  color: activeTheme === theme ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                  cursor: "pointer",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "capitalize",
                  transition: "all 0.2s ease"
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
              backgroundColor: currentVars["--background-secondary"],
              borderRadius: currentVars["--border-radius"],
              border: `1px solid ${currentVars["--border-color"]}`
            }}>
              <h3 style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: currentVars["--text-primary"],
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}>
                Custom Theme Editor
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px"
              }}>
                {Object.entries(customVars).map(([varName, value]) => (
                  <div key={varName}>
                    <label style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: currentVars["--text-secondary"],
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }}>
                      {varName}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleCustomVarChange(varName, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: `1px solid ${currentVars["--border-color"]}`,
                        borderRadius: currentVars["--border-radius"],
                        backgroundColor: currentVars["--background-primary"],
                        color: currentVars["--text-primary"],
                        fontFamily: "monospace",
                        fontSize: "13px"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={currentVars as React.CSSProperties}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "12px",
            color: currentVars["--text-primary"]
          }}>
            Badge Component
          </h1>
          <p style={{
            fontSize: "16px",
            color: currentVars["--text-secondary"],
            marginBottom: "40px",
            lineHeight: "1.6"
          }}>
            A compact badge component that displays a label with visual styling variants for different semantic meanings.
          </p>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "20px",
              color: currentVars["--text-primary"]
            }}>
              Default Badge
            </h2>
            <div style={{
              padding: "32px",
              backgroundColor: currentVars["--background-secondary"],
              borderRadius: currentVars["--border-radius"],
              border: `1px solid ${currentVars["--border-color"]}`
            }}>
              <Badge
                id="default-badge"
                label="Badge"
                variant="info"
                size="md"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
            </div>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "20px",
              color: currentVars["--text-primary"]
            }}>
              Variant Examples
            </h2>
            <div style={{
              padding: "32px",
              backgroundColor: currentVars["--background-secondary"],
              borderRadius: currentVars["--border-radius"],
              border: `1px solid ${currentVars["--border-color"]}`,
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center"
            }}>
              <Badge
                id="success-badge"
                label="Success"
                variant="success"
                size="md"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
              <Badge
                id="warning-badge"
                label="Warning"
                variant="warning"
                size="md"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
              <Badge
                id="error-badge"
                label="Error"
                variant="error"
                size="md"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
              <Badge
                id="info-badge"
                label="Info"
                variant="info"
                size="md"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
            </div>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "20px",
              color: currentVars["--text-primary"]
            }}>
              Size Variations
            </h2>
            <div style={{
              padding: "32px",
              backgroundColor: currentVars["--background-secondary"],
              borderRadius: currentVars["--border-radius"],
              border: `1px solid ${currentVars["--border-color"]}`,
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center"
            }}>
              <Badge
                id="small-badge"
                label="Small"
                variant="info"
                size="sm"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
              <Badge
                id="medium-badge"
                label="Medium"
                variant="info"
                size="md"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
              <Badge
                id="large-badge"
                label="Large"
                variant="info"
                size="lg"
                showCloseButton={false}
                closeButtonAriaLabel="Remove badge"
              />
            </div>
          </section>

          <section>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "20px",
              color: currentVars["--text-primary"]
            }}>
              With Close Button
            </h2>
            <div style={{
              padding: "32px",
              backgroundColor: currentVars["--background-secondary"],
              borderRadius: currentVars["--border-radius"],
              border: `1px solid ${currentVars["--border-color"]}`,
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center"
            }}>
              <Badge
                id="closeable-success"
                label="Closeable Success"
                variant="success"
                size="md"
                showCloseButton={true}
                closeButtonAriaLabel="Remove success badge"
              />
              <Badge
                id="closeable-warning"
                label="Closeable Warning"
                variant="warning"
                size="md"
                showCloseButton={true}
                closeButtonAriaLabel="Remove warning badge"
              />
              <Badge
                id="closeable-error"
                label="Closeable Error"
                variant="error"
                size="lg"
                showCloseButton={true}
                closeButtonAriaLabel="Remove error badge"
              />
            </div>
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