import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import CryptoTicker from "./components/CryptoTicker/CryptoTicker"
import "./components/CryptoTicker/CryptoTicker.css"

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
  "--border-radius": "8px"
}

const darkTheme: ThemeVars = {
  "--background-primary": "#0a0a0a",
  "--background-secondary": "#1a1a1a",
  "--text-primary": "#fafafa",
  "--text-secondary": "#a3a3a3",
  "--border-color": "#2a2a2a",
  "--accent-color": "#3b82f6",
  "--accent-text-color": "#ffffff",
  "--border-radius": "8px"
}

const brandTheme: ThemeVars = {
  "--background-primary": "#fef7f0",
  "--background-secondary": "#fde8d0",
  "--text-primary": "#1c1917",
  "--text-secondary": "#78716c",
  "--border-color": "#e7e5e4",
  "--accent-color": "#ea580c",
  "--accent-text-color": "#ffffff",
  "--border-radius": "12px"
}

function App() {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "brand" | "custom">("light")
  const [customVars, setCustomVars] = useState<ThemeVars>(lightTheme)

  const getThemeVars = (): ThemeVars => {
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
    setCustomVars(prev => ({ ...prev, [key]: value }))
  }

  const currentTheme = getThemeVars()

  const pageBackgroundColor = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef3e8" : "#f9fafb"

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: pageBackgroundColor,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      padding: "0",
      margin: "0",
      transition: "background-color 0.3s ease"
    }}>
      <div style={{
        position: "sticky",
        top: 0,
        backgroundColor: currentTheme["--background-primary"],
        borderBottom: `1px solid ${currentTheme["--border-color"]}`,
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
            fontSize: "20px",
            fontWeight: "600",
            color: currentTheme["--text-primary"]
          }}>
            CryptoTicker Preview
          </h2>

          <div style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => handleThemeChange("light")}
              style={{
                padding: "8px 16px",
                border: `2px solid ${activeTheme === "light" ? currentTheme["--accent-color"] : currentTheme["--border-color"]}`,
                borderRadius: currentTheme["--border-radius"],
                backgroundColor: activeTheme === "light" ? currentTheme["--accent-color"] : currentTheme["--background-secondary"],
                color: activeTheme === "light" ? currentTheme["--accent-text-color"] : currentTheme["--text-primary"],
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              style={{
                padding: "8px 16px",
                border: `2px solid ${activeTheme === "dark" ? currentTheme["--accent-color"] : currentTheme["--border-color"]}`,
                borderRadius: currentTheme["--border-radius"],
                backgroundColor: activeTheme === "dark" ? currentTheme["--accent-color"] : currentTheme["--background-secondary"],
                color: activeTheme === "dark" ? currentTheme["--accent-text-color"] : currentTheme["--text-primary"],
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("brand")}
              style={{
                padding: "8px 16px",
                border: `2px solid ${activeTheme === "brand" ? currentTheme["--accent-color"] : currentTheme["--border-color"]}`,
                borderRadius: currentTheme["--border-radius"],
                backgroundColor: activeTheme === "brand" ? currentTheme["--accent-color"] : currentTheme["--background-secondary"],
                color: activeTheme === "brand" ? currentTheme["--accent-text-color"] : currentTheme["--text-primary"],
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              Brand
            </button>
            <button
              onClick={() => handleThemeChange("custom")}
              style={{
                padding: "8px 16px",
                border: `2px solid ${activeTheme === "custom" ? currentTheme["--accent-color"] : currentTheme["--border-color"]}`,
                borderRadius: currentTheme["--border-radius"],
                backgroundColor: activeTheme === "custom" ? currentTheme["--accent-color"] : currentTheme["--background-secondary"],
                color: activeTheme === "custom" ? currentTheme["--accent-text-color"] : currentTheme["--text-primary"],
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              Custom
            </button>
          </div>

          {activeTheme === "custom" && (
            <div style={{
              backgroundColor: currentTheme["--background-secondary"],
              border: `1px solid ${currentTheme["--border-color"]}`,
              borderRadius: currentTheme["--border-radius"],
              padding: "16px",
              marginBottom: "16px"
            }}>
              <h3 style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                fontWeight: "600",
                color: currentTheme["--text-primary"]
              }}>
                Custom Theme Editor
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px"
              }}>
                {Object.entries(customVars).map(([key, value]) => (
                  <div key={key}>
                    <label style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: currentTheme["--text-secondary"],
                      marginBottom: "4px"
                    }}>
                      {key}
                    </label>
                    <input
                      type={key === "--border-radius" ? "text" : "color"}
                      value={value}
                      onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                      style={{
                        width: "100%",
                        padding: key === "--border-radius" ? "6px 8px" : "4px",
                        border: `1px solid ${currentTheme["--border-color"]}`,
                        borderRadius: "4px",
                        backgroundColor: currentTheme["--background-primary"],
                        color: currentTheme["--text-primary"],
                        fontSize: "13px",
                        height: key === "--border-radius" ? "32px" : "36px"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        <div style={currentTheme as React.CSSProperties}>
          <section style={{ marginBottom: "60px" }}>
            <h3 style={{
              margin: "0 0 24px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: currentTheme["--text-primary"]
            }}>
              Default Configuration
            </h3>
            <CryptoTicker
              id="crypto-ticker-default"
              coinIds="bitcoin,ethereum,solana,cardano,dogecoin"
              vsCurrency="usd"
              heading="Live crypto prices"
              subheading="Auto-refreshed from CoinGecko"
              showHeading={true}
              layout="grid"
              columns="4"
              cardStyle="outlined"
              showIcon={true}
              showSymbol={true}
              showName={true}
              show24hChange={true}
              decimals={2}
              refreshInterval={60}
              animateOnUpdate={true}
              pauseWhenHidden={true}
              loadingText="Loading prices…"
              errorText="Couldn't fetch crypto prices right now. Please try again shortly."
              rateLimitText="Too many requests. We'll back off and retry in a moment."
              retryButtonText="Retry"
            />
          </section>

          <section style={{ marginBottom: "60px" }}>
            <h3 style={{
              margin: "0 0 24px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: currentTheme["--text-primary"]
            }}>
              Ticker Layout (Horizontal Scrolling)
            </h3>
            <CryptoTicker
              id="crypto-ticker-marquee"
              coinIds="bitcoin,ethereum,binancecoin,ripple,solana,polkadot,dogecoin,avalanche-2"
              vsCurrency="usd"
              heading="Top 8 Cryptos"
              subheading="Live prices scrolling"
              showHeading={true}
              layout="ticker"
              columns="4"
              cardStyle="minimal"
              showIcon={true}
              showSymbol={true}
              showName={false}
              show24hChange={true}
              decimals={2}
              refreshInterval={60}
              animateOnUpdate={true}
              pauseWhenHidden={true}
              loadingText="Loading prices…"
              errorText="Couldn't fetch crypto prices right now. Please try again shortly."
              rateLimitText="Too many requests. We'll back off and retry in a moment."
              retryButtonText="Retry"
            />
          </section>

          <section style={{ marginBottom: "60px" }}>
            <h3 style={{
              margin: "0 0 24px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: currentTheme["--text-primary"]
            }}>
              Row Layout with Elevated Cards
            </h3>
            <CryptoTicker
              id="crypto-ticker-row"
              coinIds="bitcoin,ethereum,solana"
              vsCurrency="eur"
              heading="Top 3 in EUR"
              subheading="Premium selection"
              showHeading={true}
              layout="row"
              columns="3"
              cardStyle="elevated"
              showIcon={true}
              showSymbol={true}
              showName={true}
              show24hChange={true}
              decimals={2}
              refreshInterval={60}
              animateOnUpdate={true}
              pauseWhenHidden={true}
              loadingText="Loading prices…"
              errorText="Couldn't fetch crypto prices right now. Please try again shortly."
              rateLimitText="Too many requests. We'll back off and retry in a moment."
              retryButtonText="Retry"
            />
          </section>

          <section>
            <h3 style={{
              margin: "0 0 24px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: currentTheme["--text-primary"]
            }}>
              Minimal Grid (2 Columns, No Heading)
            </h3>
            <CryptoTicker
              id="crypto-ticker-minimal"
              coinIds="bitcoin,ethereum,cardano,polkadot"
              vsCurrency="gbp"
              heading=""
              subheading=""
              showHeading={false}
              layout="grid"
              columns="2"
              cardStyle="minimal"
              showIcon={false}
              showSymbol={true}
              showName={true}
              show24hChange={false}
              decimals={4}
              refreshInterval={60}
              animateOnUpdate={false}
              pauseWhenHidden={true}
              loadingText="Loading prices…"
              errorText="Couldn't fetch crypto prices right now. Please try again shortly."
              rateLimitText="Too many requests. We'll back off and retry in a moment."
              retryButtonText="Retry"
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