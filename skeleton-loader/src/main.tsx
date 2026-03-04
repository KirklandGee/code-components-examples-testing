import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import SkeletonLoader from "./components/SkeletonLoader/SkeletonLoader"
import "./components/SkeletonLoader/SkeletonLoader.css"

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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '0',
      margin: '0',
      transition: 'background 0.3s ease'
    }}>
      <div style={{
        position: 'sticky',
        top: 0,
        background: currentVars['--background-primary'],
        borderBottom: `1px solid ${currentVars['--border-color']}`,
        padding: '24px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            margin: '0 0 20px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: currentVars['--text-primary']
          }}>
            SkeletonLoader Preview
          </h1>

          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {(['light', 'dark', 'brand', 'custom'] as ThemeType[]).map(theme => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  style={{
                    padding: '8px 16px',
                    border: `2px solid ${activeTheme === theme ? currentVars['--accent-color'] : currentVars['--border-color']}`,
                    borderRadius: currentVars['--border-radius'],
                    background: activeTheme === theme ? currentVars['--accent-color'] : currentVars['--background-secondary'],
                    color: activeTheme === theme ? currentVars['--accent-text-color'] : currentVars['--text-primary'],
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
          </div>

          {activeTheme === 'custom' && (
            <div style={{
              background: currentVars['--background-secondary'],
              border: `1px solid ${currentVars['--border-color']}`,
              borderRadius: currentVars['--border-radius'],
              padding: '20px',
              marginTop: '16px'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: currentVars['--text-primary']
              }}>
                Custom Theme Editor
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {(Object.keys(customVars) as Array<keyof ThemeVars>).map(key => (
                  <div key={key}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: currentVars['--text-secondary'],
                      marginBottom: '6px',
                      textTransform: 'capitalize'
                    }}>
                      {key.replace('--', '').replace(/-/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={customVars[key]}
                      onChange={(e) => handleCustomVarChange(key, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: `1px solid ${currentVars['--border-color']}`,
                        borderRadius: currentVars['--border-radius'],
                        background: currentVars['--background-primary'],
                        color: currentVars['--text-primary'],
                        fontSize: '14px',
                        fontFamily: 'monospace'
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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary'],
              marginBottom: '24px'
            }}>
              Default Configuration
            </h2>
            <div style={{
              background: currentVars['--background-primary'],
              border: `1px solid ${currentVars['--border-color']}`,
              borderRadius: currentVars['--border-radius'],
              padding: '32px'
            }}>
              <SkeletonLoader
                id="default-skeleton"
                variant="text"
                textLineCount={3}
                width="100%"
                height="200px"
                circleSize="64px"
                showCircle={false}
                showRectangle={false}
                showTextLines={true}
                enableAnimation={true}
              />
            </div>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary'],
              marginBottom: '24px'
            }}>
              Prop Variations
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: currentVars['--text-secondary'],
                  marginBottom: '12px'
                }}>
                  Card Layout (Avatar + Text)
                </h3>
                <div style={{
                  background: currentVars['--background-primary'],
                  border: `1px solid ${currentVars['--border-color']}`,
                  borderRadius: currentVars['--border-radius'],
                  padding: '24px'
                }}>
                  <SkeletonLoader
                    id="card-skeleton"
                    variant="text"
                    textLineCount={4}
                    width="100%"
                    height="200px"
                    circleSize="48px"
                    showCircle={true}
                    showRectangle={false}
                    showTextLines={true}
                    enableAnimation={true}
                  />
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: currentVars['--text-secondary'],
                  marginBottom: '12px'
                }}>
                  Image Card (Rectangle + Text)
                </h3>
                <div style={{
                  background: currentVars['--background-primary'],
                  border: `1px solid ${currentVars['--border-color']}`,
                  borderRadius: currentVars['--border-radius'],
                  padding: '24px'
                }}>
                  <SkeletonLoader
                    id="image-card-skeleton"
                    variant="rectangular"
                    textLineCount={2}
                    width="100%"
                    height="180px"
                    circleSize="64px"
                    showCircle={false}
                    showRectangle={true}
                    showTextLines={true}
                    enableAnimation={true}
                  />
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: currentVars['--text-secondary'],
                  marginBottom: '12px'
                }}>
                  Profile Layout (Circle Only)
                </h3>
                <div style={{
                  background: currentVars['--background-primary'],
                  border: `1px solid ${currentVars['--border-color']}`,
                  borderRadius: currentVars['--border-radius'],
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <SkeletonLoader
                    id="profile-skeleton"
                    variant="circular"
                    textLineCount={1}
                    width="100%"
                    height="200px"
                    circleSize="120px"
                    showCircle={true}
                    showRectangle={false}
                    showTextLines={false}
                    enableAnimation={true}
                  />
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: currentVars['--text-secondary'],
                  marginBottom: '12px'
                }}>
                  Full Composite (All Elements)
                </h3>
                <div style={{
                  background: currentVars['--background-primary'],
                  border: `1px solid ${currentVars['--border-color']}`,
                  borderRadius: currentVars['--border-radius'],
                  padding: '24px'
                }}>
                  <SkeletonLoader
                    id="composite-skeleton"
                    variant="text"
                    textLineCount={5}
                    width="100%"
                    height="160px"
                    circleSize="56px"
                    showCircle={true}
                    showRectangle={true}
                    showTextLines={true}
                    enableAnimation={true}
                  />
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: currentVars['--text-secondary'],
                  marginBottom: '12px'
                }}>
                  Static (No Animation)
                </h3>
                <div style={{
                  background: currentVars['--background-primary'],
                  border: `1px solid ${currentVars['--border-color']}`,
                  borderRadius: currentVars['--border-radius'],
                  padding: '24px'
                }}>
                  <SkeletonLoader
                    id="static-skeleton"
                    variant="text"
                    textLineCount={3}
                    width="100%"
                    height="200px"
                    circleSize="64px"
                    showCircle={false}
                    showRectangle={true}
                    showTextLines={true}
                    enableAnimation={false}
                  />
                </div>
              </div>
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