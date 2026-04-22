import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import YouTubeChannel from "./components/YouTubeChannel/YouTubeChannel"
import "./components/YouTubeChannel/YouTubeChannel.css"

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
  const [apiKey, setApiKey] = useState<string>("")

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
    setCustomVars((prev) => ({ ...prev, [key]: value }))
  }

  const currentVars = getThemeVars()
  const pageBackground = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef3e8" : "#f9fafb"

  return (
    <div style={{
      minHeight: "100vh",
      background: pageBackground,
      padding: "2rem 1rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      transition: "background 0.3s ease"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        <header style={{
          marginBottom: "3rem",
          padding: "2rem",
          background: currentVars["--background-primary"],
          border: `1px solid ${currentVars["--border-color"]}`,
          borderRadius: currentVars["--border-radius"]
        }}>
          <h1 style={{
            margin: "0 0 0.5rem 0",
            fontSize: "1.875rem",
            fontWeight: "700",
            color: currentVars["--text-primary"]
          }}>
            YouTubeChannel Component Preview
          </h1>
          <p style={{
            margin: "0 0 2rem 0",
            fontSize: "0.875rem",
            color: currentVars["--text-secondary"]
          }}>
            Test different themes and configurations
          </p>

          <div style={{
            marginBottom: "1.5rem"
          }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: currentVars["--text-primary"]
            }}>
              Theme Preset
            </label>
            <div style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap"
            }}>
              {(["light", "dark", "brand", "custom"] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    border: `2px solid ${activeTheme === theme ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                    borderRadius: currentVars["--border-radius"],
                    background: activeTheme === theme ? currentVars["--accent-color"] : currentVars["--background-primary"],
                    color: activeTheme === theme ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "capitalize"
                  }}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {activeTheme === "custom" && (
            <div style={{
              padding: "1.5rem",
              background: currentVars["--background-secondary"],
              border: `1px solid ${currentVars["--border-color"]}`,
              borderRadius: currentVars["--border-radius"],
              marginBottom: "1.5rem"
            }}>
              <h3 style={{
                margin: "0 0 1rem 0",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: currentVars["--text-primary"]
              }}>
                Custom Theme Editor
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem"
              }}>
                {(Object.keys(customVars) as Array<keyof ThemeVars>).map((key) => (
                  <div key={key}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.25rem",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: currentVars["--text-secondary"]
                    }}>
                      {key}
                    </label>
                    <input
                      type={key === "--border-radius" ? "text" : "color"}
                      value={customVars[key]}
                      onChange={(e) => handleCustomVarChange(key, e.target.value)}
                      style={{
                        width: "100%",
                        padding: key === "--border-radius" ? "0.5rem" : "0.25rem",
                        border: `1px solid ${currentVars["--border-color"]}`,
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        background: currentVars["--background-primary"],
                        color: currentVars["--text-primary"]
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            padding: "1.5rem",
            background: currentVars["--background-secondary"],
            border: `1px solid ${currentVars["--border-color"]}`,
            borderRadius: currentVars["--border-radius"]
          }}>
            <h3 style={{
              margin: "0 0 1rem 0",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: currentVars["--text-primary"]
            }}>
              API Configuration
            </h3>
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: currentVars["--text-secondary"]
              }}>
                YouTube Data API v3 Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (create at console.cloud.google.com)"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${currentVars["--border-color"]}`,
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  background: currentVars["--background-primary"],
                  color: currentVars["--text-primary"],
                  fontFamily: "monospace"
                }}
              />
              <p style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.75rem",
                color: currentVars["--text-secondary"]
              }}>
                Required for fetching channel and video data. The key is sent as a query parameter and only needs read access to the public YouTube Data API.
              </p>
            </div>
          </div>
        </header>

        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: "4rem" }}>
            <h2 style={{
              margin: "0 0 1.5rem 0",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: currentVars["--text-primary"]
            }}>
              Default Configuration
            </h2>
            <YouTubeChannel
              id="youtube-default"
              apiKey={apiKey}
              channelId="UCsBjURrPoezykLs9EqgamOA"
              heading="Latest from our channel"
              subheading="Subscribe to stay in the loop"
              showHeading={true}
              layout="grid"
              columns="3"
              cardStyle="minimal"
              maxVideos={6}
              refreshInterval={15}
              openInNewTab={true}
              showChannelAvatar={true}
              showChannelName={true}
              showSubscriberCount={true}
              subscriberSuffix="subscribers"
              showSubscribeButton={true}
              subscribeButtonText="Subscribe"
              showVideoTitle={true}
              showPublishDate={true}
              showViewCount={true}
              showDurationBadge={true}
              loadingText="Loading latest videos…"
              errorText="Couldn't load videos right now. Please try again shortly."
              retryButtonText="Retry"
              emptyStateText="No videos published yet — check back soon."
            />
          </section>

          <section style={{ marginBottom: "4rem" }}>
            <h2 style={{
              margin: "0 0 1.5rem 0",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: currentVars["--text-primary"]
            }}>
              Compact Row Layout (Elevated Cards)
            </h2>
            <YouTubeChannel
              id="youtube-row"
              apiKey={apiKey}
              channelId="UCsBjURrPoezykLs9EqgamOA"
              heading="Recent Uploads"
              subheading=""
              showHeading={true}
              layout="row"
              columns="3"
              cardStyle="elevated"
              maxVideos={4}
              refreshInterval={15}
              openInNewTab={true}
              showChannelAvatar={true}
              showChannelName={true}
              showSubscriberCount={false}
              subscriberSuffix="subscribers"
              showSubscribeButton={true}
              subscribeButtonText="Subscribe"
              showVideoTitle={true}
              showPublishDate={true}
              showViewCount={false}
              showDurationBadge={true}
              loadingText="Loading latest videos…"
              errorText="Couldn't load videos right now. Please try again shortly."
              retryButtonText="Retry"
              emptyStateText="No videos published yet — check back soon."
            />
          </section>

          <section style={{ marginBottom: "4rem" }}>
            <h2 style={{
              margin: "0 0 1.5rem 0",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: currentVars["--text-primary"]
            }}>
              Minimal List View (No Heading)
            </h2>
            <YouTubeChannel
              id="youtube-list"
              apiKey={apiKey}
              channelId="UCsBjURrPoezykLs9EqgamOA"
              heading=""
              subheading=""
              showHeading={false}
              layout="list"
              columns="3"
              cardStyle="outlined"
              maxVideos={8}
              refreshInterval={15}
              openInNewTab={true}
              showChannelAvatar={true}
              showChannelName={true}
              showSubscriberCount={true}
              subscriberSuffix="subs"
              showSubscribeButton={false}
              subscribeButtonText="Subscribe"
              showVideoTitle={true}
              showPublishDate={true}
              showViewCount={true}
              showDurationBadge={false}
              loadingText="Loading latest videos…"
              errorText="Couldn't load videos right now. Please try again shortly."
              retryButtonText="Retry"
              emptyStateText="No videos published yet — check back soon."
            />
          </section>

          <section>
            <h2 style={{
              margin: "0 0 1.5rem 0",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: currentVars["--text-primary"]
            }}>
              4-Column Grid (Elevated, Max Metadata)
            </h2>
            <YouTubeChannel
              id="youtube-grid-4"
              apiKey={apiKey}
              channelId="UCsBjURrPoezykLs9EqgamOA"
              heading="Video Archive"
              subheading="Explore our complete collection"
              showHeading={true}
              layout="grid"
              columns="4"
              cardStyle="elevated"
              maxVideos={12}
              refreshInterval={15}
              openInNewTab={false}
              showChannelAvatar={true}
              showChannelName={true}
              showSubscriberCount={true}
              subscriberSuffix="subscribers"
              showSubscribeButton={true}
              subscribeButtonText="Follow"
              showVideoTitle={true}
              showPublishDate={true}
              showViewCount={true}
              showDurationBadge={true}
              loadingText="Loading latest videos…"
              errorText="Couldn't load videos right now. Please try again shortly."
              retryButtonText="Retry"
              emptyStateText="No videos published yet — check back soon."
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