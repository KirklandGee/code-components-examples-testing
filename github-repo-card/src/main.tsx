import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import GithubRepoCard from "./components/GithubRepoCard/GithubRepoCard"
import "./components/GithubRepoCard/GithubRepoCard.css"

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

  const pageBackground = activeTheme === 'dark' ? '#000000' : activeTheme === 'brand' ? '#fef3e8' : '#f9fafb'

  return (
    <div style={{
      minHeight: '100vh',
      background: pageBackground,
      transition: 'background 0.3s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <header style={{
          marginBottom: '48px',
          background: currentVars['--background-primary'],
          border: `1px solid ${currentVars['--border-color']}`,
          borderRadius: currentVars['--border-radius'],
          padding: '24px',
          transition: 'all 0.3s ease'
        }}>
          <h1 style={{
            margin: '0 0 24px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: currentVars['--text-primary']
          }}>
            GitHub Repo Card — Development Preview
          </h1>

          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: currentVars['--text-primary'],
              marginBottom: '12px'
            }}>
              Theme Preset
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['light', 'dark', 'brand', 'custom'] as ThemeType[]).map(theme => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: activeTheme === theme ? `2px solid ${currentVars['--accent-color']}` : `1px solid ${currentVars['--border-color']}`,
                    borderRadius: currentVars['--border-radius'],
                    background: activeTheme === theme ? currentVars['--accent-color'] : currentVars['--background-secondary'],
                    color: activeTheme === theme ? currentVars['--accent-text-color'] : currentVars['--text-primary'],
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize'
                  }}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {activeTheme === 'custom' && (
            <div style={{
              padding: '20px',
              background: currentVars['--background-secondary'],
              borderRadius: currentVars['--border-radius'],
              border: `1px solid ${currentVars['--border-color']}`
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: currentVars['--text-primary'],
                marginBottom: '16px'
              }}>
                Custom Theme Editor
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {Object.entries(customVars).map(([key, value]) => (
                  <div key={key}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: currentVars['--text-secondary'],
                      marginBottom: '6px'
                    }}>
                      {key}
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {key.includes('radius') ? (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: '14px',
                            border: `1px solid ${currentVars['--border-color']}`,
                            borderRadius: '6px',
                            background: currentVars['--background-primary'],
                            color: currentVars['--text-primary'],
                            fontFamily: 'monospace'
                          }}
                        />
                      ) : (
                        <>
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                            style={{
                              width: '48px',
                              height: '36px',
                              border: `1px solid ${currentVars['--border-color']}`,
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              fontSize: '14px',
                              border: `1px solid ${currentVars['--border-color']}`,
                              borderRadius: '6px',
                              background: currentVars['--background-primary'],
                              color: currentVars['--text-primary'],
                              fontFamily: 'monospace'
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: currentVars['--text-primary'],
              marginBottom: '24px'
            }}>
              Default Configuration
            </h2>
            <GithubRepoCard
              owner="facebook"
              repo="react"
              layout="full"
              theme="light"
              cardStyle="outlined"
              showDescription={true}
              showLanguage={true}
              showStars={true}
              showForks={true}
              showWatchers={false}
              showOpenIssues={false}
              showLatestRelease={true}
              showLastCommit={true}
              showContributors={true}
              maxContributors={5}
              animateCounts={true}
              refreshInterval={10}
              openInNewTab={true}
              showCta={true}
              ctaText="View on GitHub"
              loadingText="Loading repository…"
              errorText="Couldn't load this repository right now. Please try again shortly."
              notFoundText="Repository not found. Check the owner and repo names."
              rateLimitText="GitHub rate limit reached. Please wait a few minutes before trying again."
              retryButtonText="Retry"
            />
          </section>

          <section style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: currentVars['--text-primary'],
              marginBottom: '24px'
            }}>
              Compact Layout with Dark Theme
            </h2>
            <GithubRepoCard
              owner="vercel"
              repo="next.js"
              layout="compact"
              theme="dark"
              cardStyle="elevated"
              showDescription={true}
              showLanguage={true}
              showStars={true}
              showForks={true}
              showWatchers={false}
              showOpenIssues={false}
              showLatestRelease={false}
              showLastCommit={false}
              showContributors={false}
              maxContributors={5}
              animateCounts={true}
              refreshInterval={10}
              openInNewTab={true}
              showCta={true}
              ctaText="Explore Next.js"
              loadingText="Loading repository…"
              errorText="Couldn't load this repository right now. Please try again shortly."
              notFoundText="Repository not found. Check the owner and repo names."
              rateLimitText="GitHub rate limit reached. Please wait a few minutes before trying again."
              retryButtonText="Retry"
            />
          </section>

          <section style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: currentVars['--text-primary'],
              marginBottom: '24px'
            }}>
              Minimal Style with Extended Metadata
            </h2>
            <GithubRepoCard
              owner="microsoft"
              repo="vscode"
              layout="full"
              theme="light"
              cardStyle="minimal"
              showDescription={true}
              showLanguage={true}
              showStars={true}
              showForks={true}
              showWatchers={true}
              showOpenIssues={true}
              showLatestRelease={true}
              showLastCommit={true}
              showContributors={true}
              maxContributors={8}
              animateCounts={false}
              refreshInterval={15}
              openInNewTab={false}
              showCta={true}
              ctaText="Check it out"
              loadingText="Loading repository…"
              errorText="Couldn't load this repository right now. Please try again shortly."
              notFoundText="Repository not found. Check the owner and repo names."
              rateLimitText="GitHub rate limit reached. Please wait a few minutes before trying again."
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