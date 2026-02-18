import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import WeatherWidget from "./components/WeatherWidget/WeatherWidget"
import "./components/WeatherWidget/WeatherWidget.css"

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

  const handleThemeChange = (theme: ThemeType) => {
    setActiveTheme(theme)
    if (theme !== 'custom') {
      setCustomVars(themes[theme])
    }
  }

  const handleCustomVarChange = (varName: keyof ThemeVars, value: string) => {
    setCustomVars(prev => ({
      ...prev,
      [varName]: value
    }))
  }

  const currentVars = activeTheme === 'custom' ? customVars : themes[activeTheme as Exclude<ThemeType, 'custom'>]

  const pageBackground = activeTheme === 'dark' ? '#000000' : activeTheme === 'brand' ? '#fef3e8' : '#f9fafb'

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: pageBackground,
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{
          marginBottom: '40px',
          padding: '24px',
          backgroundColor: currentVars['--background-primary'],
          borderRadius: '12px',
          border: `1px solid ${currentVars['--border-color']}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            margin: '0 0 20px 0',
            fontSize: '28px',
            fontWeight: '600',
            color: currentVars['--text-primary']
          }}>
            Weather Widget Preview
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: activeTheme === 'custom' ? '24px' : '0'
          }}>
            {(['light', 'dark', 'brand', 'custom'] as ThemeType[]).map(theme => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: `2px solid ${activeTheme === theme ? currentVars['--accent-color'] : currentVars['--border-color']}`,
                  borderRadius: '8px',
                  backgroundColor: activeTheme === theme ? currentVars['--accent-color'] : currentVars['--background-secondary'],
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

          {activeTheme === 'custom' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '20px',
              backgroundColor: currentVars['--background-secondary'],
              borderRadius: '8px',
              border: `1px solid ${currentVars['--border-color']}`
            }}>
              {(Object.keys(customVars) as Array<keyof ThemeVars>).map(varName => (
                <div key={varName} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: currentVars['--text-secondary'],
                    textTransform: 'capitalize'
                  }}>
                    {varName.replace('--', '').replace(/-/g, ' ')}
                  </label>
                  <input
                    type={varName === '--border-radius' ? 'text' : 'color'}
                    value={customVars[varName]}
                    onChange={(e) => handleCustomVarChange(varName, e.target.value)}
                    style={{
                      padding: '8px',
                      border: `1px solid ${currentVars['--border-color']}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: currentVars['--background-primary'],
                      color: currentVars['--text-primary'],
                      cursor: 'pointer'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </header>

        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary'],
              marginBottom: '20px'
            }}>
              Default Configuration
            </h2>
            <WeatherWidget
              id="weather-widget-default"
              apiKey=""
              cityName="London"
              defaultUnit="fahrenheit"
              heading="Current Weather"
              temperatureLabel="Temperature"
              conditionLabel="Condition"
              humidityLabel="Humidity"
              windSpeedLabel="Wind Speed"
              lastUpdatedLabel="Last updated:"
              refreshButtonText="Refresh"
              loadingText="Loading weather data..."
              errorInvalidKeyText="Invalid API key. Please check your credentials."
              errorCityNotFoundText="City not found. Please check the city name."
              errorGenericText="Unable to fetch weather data. Please try again."
              fahrenheitSymbol="°F"
              celsiusSymbol="°C"
              showUnitToggle={true}
              showRefreshButton={true}
              showLastUpdated={true}
              showLabels={true}
              autoRefreshInterval={0}
            />
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary'],
              marginBottom: '20px'
            }}>
              Minimal Display (No Labels, No Timestamp)
            </h2>
            <WeatherWidget
              id="weather-widget-minimal"
              apiKey=""
              cityName="Tokyo"
              defaultUnit="celsius"
              heading="Tokyo Weather"
              temperatureLabel="Temperature"
              conditionLabel="Condition"
              humidityLabel="Humidity"
              windSpeedLabel="Wind Speed"
              lastUpdatedLabel="Last updated:"
              refreshButtonText="Refresh"
              loadingText="Loading..."
              errorInvalidKeyText="Invalid API key. Please check your credentials."
              errorCityNotFoundText="City not found. Please check the city name."
              errorGenericText="Unable to fetch weather data. Please try again."
              fahrenheitSymbol="°F"
              celsiusSymbol="°C"
              showUnitToggle={true}
              showRefreshButton={true}
              showLastUpdated={false}
              showLabels={false}
              autoRefreshInterval={0}
            />
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: currentVars['--text-primary'],
              marginBottom: '20px'
            }}>
              Auto-Refresh Enabled (Every 5 Minutes)
            </h2>
            <WeatherWidget
              id="weather-widget-auto-refresh"
              apiKey=""
              cityName="New York"
              defaultUnit="fahrenheit"
              heading="NYC Weather - Auto Updates"
              temperatureLabel="Temp"
              conditionLabel="Current"
              humidityLabel="Humidity %"
              windSpeedLabel="Wind"
              lastUpdatedLabel="Updated:"
              refreshButtonText="Update Now"
              loadingText="Fetching latest data..."
              errorInvalidKeyText="Invalid API key. Please check your credentials."
              errorCityNotFoundText="City not found. Please check the city name."
              errorGenericText="Unable to fetch weather data. Please try again."
              fahrenheitSymbol="°F"
              celsiusSymbol="°C"
              showUnitToggle={false}
              showRefreshButton={true}
              showLastUpdated={true}
              showLabels={true}
              autoRefreshInterval={5}
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