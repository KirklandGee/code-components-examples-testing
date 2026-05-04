import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import InstagramFeed from "./components/InstagramFeed/InstagramFeed"
import "./components/InstagramFeed/InstagramFeed.css"

type ThemeType = 'light' | 'dark' | 'brand' | 'custom'

interface ThemeVars {
  '--background-primary': string
  '--background-secondary': string
  '--text-primary': string
  '--text-secondary': string
  '--border-color': string
  '--accent-color': string
  '--accent-text-color': string
  '--border-radius': string
}

const themes: Record<Exclude<ThemeType, 'custom'>, ThemeVars> = {
  light: {
    '--background-primary': '#ffffff',
    '--background-secondary': '#f5f5f5',
    '--text-primary': '#1a1a1a',
    '--text-secondary': '#737373',
    '--border-color': '#e5e5e5',
    '--accent-color': '#2563eb',
    '--accent-text-color': '#ffffff',
    '--border-radius': '8px'
  },
  dark: {
    '--background-primary': '#0a0a0a',
    '--background-secondary': '#1a1a1a',
    '--text-primary': '#fafafa',
    '--text-secondary': '#a3a3a3',
    '--border-color': '#2a2a2a',
    '--accent-color': '#3b82f6',
    '--accent-text-color': '#ffffff',
    '--border-radius': '8px'
  },
  brand: {
    '--background-primary': '#fef7f0',
    '--background-secondary': '#fde8d0',
    '--text-primary': '#1c1917',
    '--text-secondary': '#78716c',
    '--border-color': '#e7e5e4',
    '--accent-color': '#ea580c',
    '--accent-text-color': '#ffffff',
    '--border-radius': '12px'
  }
}

function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeType>('light')
  const [customVars, setCustomVars] = useState<ThemeVars>(themes.light)
  const [feedUrl, setFeedUrl] = useState('https://rss.app/feeds/json/example.json')
  const [profileUrl, setProfileUrl] = useState('https://www.instagram.com/yourhandle/')

  const currentVars = activeTheme === 'custom' ? customVars : themes[activeTheme]

  const handleThemeChange = (theme: ThemeType) => {
    setActiveTheme(theme)
    if (theme !== 'custom') {
      setCustomVars(themes[theme])
    }
  }

  const handleCustomVarChange = (key: keyof ThemeVars, value: string) => {
    setCustomVars(prev => ({ ...prev, [key]: value }))
  }

  const pageBackground = activeTheme === 'dark' ? '#000000' : activeTheme === 'brand' ? '#fef3e8' : '#fafafa'

  return (
    <div style={{
      minHeight: '100vh',
      background: pageBackground,
      transition: 'background 0.3s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        position: 'sticky',
        top: 0,
        background: currentVars['--background-primary'],
        borderBottom: `1px solid ${currentVars['--border-color']}`,
        padding: '20px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            margin: '0 0 16px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: currentVars['--text-primary']
          }}>
            InstagramFeed Component Preview
          </h1>

          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '12px'
            }}>
              {(['light', 'dark', 'brand', 'custom'] as ThemeType[]).map(theme => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  style={{
                    padding: '8px 16px',
                    border: `2px solid ${activeTheme === theme ? currentVars['--accent-color'] : currentVars['--border-color']}`,
                    background: activeTheme === theme ? currentVars['--accent-color'] : currentVars['--background-secondary'],
                    color: activeTheme === theme ? currentVars['--accent-text-color'] : currentVars['--text-primary'],
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {theme}
                </button>
              ))}
            </div>

            {activeTheme === 'custom' && (
              <div style={{
                background: currentVars['--background-secondary'],
                border: `1px solid ${currentVars['--border-color']}`,
                borderRadius: '8px',
                padding: '16px',
                marginTop: '12px'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentVars['--text-primary']
                }}>
                  Custom Theme Editor
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  {(Object.keys(customVars) as Array<keyof ThemeVars>).map(key => (
                    <div key={key}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: currentVars['--text-secondary'],
                        marginBottom: '4px'
                      }}>
                        {key}
                      </label>
                      <input
                        type="text"
                        value={customVars[key]}
                        onChange={(e) => handleCustomVarChange(key, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: `1px solid ${currentVars['--border-color']}`,
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          background: currentVars['--background-primary'],
                          color: currentVars['--text-primary']
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{
            background: currentVars['--background-secondary'],
            border: `1px solid ${currentVars['--border-color']}`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: currentVars['--text-primary']
            }}>
              API Configuration
            </h3>
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '12px',
              color: currentVars['--text-secondary'],
              lineHeight: '1.5'
            }}>
              Configure your JSON Feed URL and Instagram profile link. Generate a free JSON Feed at rss.app by pointing it at instagram.com/yourhandle and copying the JSON URL.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '12px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: currentVars['--text-secondary'],
                  marginBottom: '4px'
                }}>
                  JSON Feed URL
                </label>
                <input
                  type="text"
                  value={feedUrl}
                  onChange={(e) => setFeedUrl(e.target.value)}
                  placeholder="https://rss.app/feeds/json/example.json"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: `1px solid ${currentVars['--border-color']}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    background: currentVars['--background-primary'],
                    color: currentVars['--text-primary']
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: currentVars['--text-secondary'],
                  marginBottom: '4px'
                }}>
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://www.instagram.com/yourhandle/"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: `1px solid ${currentVars['--border-color']}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    background: currentVars['--background-primary'],
                    color: currentVars['--text-primary']
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{
              margin: '0 0 24px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary']
            }}>
              Default Configuration
            </h2>
            <InstagramFeed
              id="instagram-feed-default"
              feedUrl={feedUrl}
              profileUrl={{ href: profileUrl }}
              heading="Follow us on Instagram"
              subheading="@yourhandle"
              showHeading={true}
              followButtonText="Follow on Instagram"
              showFollowButton={true}
              maxPosts={9}
              refreshInterval={10}
              openInNewTab={true}
              columns="3"
              aspectRatio="square"
              gap={12}
              hoverEffect="overlay"
              borderRadius="medium"
              showCaption={false}
              captionLines={2}
              showDate={false}
              loadingText="Loading Instagram posts…"
              errorText="We couldn't reach Instagram right now. Please try again in a moment."
              retryButtonText="Retry"
              emptyStateText="No posts to show yet."
            />
          </section>

          <section style={{ marginBottom: '60px' }}>
            <h2 style={{
              margin: '0 0 24px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary']
            }}>
              Compact Grid with Captions
            </h2>
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '14px',
              color: currentVars['--text-secondary'],
              lineHeight: '1.6'
            }}>
              4-column layout with portrait aspect ratio, showing captions and dates below each post. Zoom hover effect for subtle interaction.
            </p>
            <InstagramFeed
              id="instagram-feed-compact"
              feedUrl={feedUrl}
              profileUrl={{ href: profileUrl }}
              heading="Latest Updates"
              subheading="@yourhandle"
              showHeading={true}
              followButtonText="Follow"
              showFollowButton={true}
              maxPosts={12}
              refreshInterval={10}
              openInNewTab={true}
              columns="4"
              aspectRatio="portrait"
              gap={8}
              hoverEffect="zoom"
              borderRadius="small"
              showCaption={true}
              captionLines={3}
              showDate={true}
              loadingText="Loading posts…"
              errorText="Unable to load feed. Please check your connection."
              retryButtonText="Try Again"
              emptyStateText="No posts available."
            />
          </section>

          <section style={{ marginBottom: '60px' }}>
            <h2 style={{
              margin: '0 0 24px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary']
            }}>
              Minimal 2-Column Layout
            </h2>
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '14px',
              color: currentVars['--text-secondary'],
              lineHeight: '1.6'
            }}>
              Wide 2-column grid with original aspect ratios preserved, large border radius, and fade hover effect. No header or captions for a clean gallery look.
            </p>
            <InstagramFeed
              id="instagram-feed-minimal"
              feedUrl={feedUrl}
              profileUrl={{ href: profileUrl }}
              heading=""
              subheading=""
              showHeading={false}
              followButtonText=""
              showFollowButton={false}
              maxPosts={6}
              refreshInterval={15}
              openInNewTab={true}
              columns="2"
              aspectRatio="original"
              gap={20}
              hoverEffect="fade"
              borderRadius="large"
              showCaption={false}
              captionLines={1}
              showDate={false}
              loadingText="Loading…"
              errorText="Feed unavailable"
              retryButtonText="Reload"
              emptyStateText="Nothing to show"
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