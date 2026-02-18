import { useState, useEffect, useRef } from "react";

export interface WeatherWidgetProps {
  id?: string;
  apiKey?: string;
  cityName?: string;
  defaultUnit?: "fahrenheit" | "celsius";
  heading?: string;
  temperatureLabel?: string;
  conditionLabel?: string;
  humidityLabel?: string;
  windSpeedLabel?: string;
  lastUpdatedLabel?: string;
  refreshButtonText?: string;
  loadingText?: string;
  errorInvalidKeyText?: string;
  errorCityNotFoundText?: string;
  errorGenericText?: string;
  fahrenheitSymbol?: string;
  celsiusSymbol?: string;
  showUnitToggle?: boolean;
  showRefreshButton?: boolean;
  showLastUpdated?: boolean;
  showLabels?: boolean;
  autoRefreshInterval?: number;
}

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  timestamp: number;
}

export default function WeatherWidget({
  id,
  apiKey = "",
  cityName = "London",
  defaultUnit = "fahrenheit",
  heading = "Current Weather",
  temperatureLabel = "Temperature",
  conditionLabel = "Condition",
  humidityLabel = "Humidity",
  windSpeedLabel = "Wind Speed",
  lastUpdatedLabel = "Last updated:",
  refreshButtonText = "Refresh",
  loadingText = "Loading weather data...",
  errorInvalidKeyText = "Invalid API key. Please check your credentials.",
  errorCityNotFoundText = "City not found. Please check the city name.",
  errorGenericText = "Unable to fetch weather data. Please try again.",
  fahrenheitSymbol = "°F",
  celsiusSymbol = "°C",
  showUnitToggle = true,
  showRefreshButton = true,
  showLastUpdated = true,
  showLabels = true,
  autoRefreshInterval = 0,
}: WeatherWidgetProps) {
  const [unit, setUnit] = useState<"fahrenheit" | "celsius">(defaultUnit);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchWeatherData = async () => {
    if (!apiKey) {
      setError(errorInvalidKeyText);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const units = unit === "celsius" ? "metric" : "imperial";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&units=${units}&appid=${apiKey}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError(errorInvalidKeyText);
        } else if (response.status === 404) {
          setError(errorCityNotFoundText);
        } else {
          setError(errorGenericText);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      setWeatherData({
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        timestamp: Date.now(),
      });
      setLoading(false);
    } catch (err) {
      setError(errorGenericText);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [apiKey, cityName, unit]);

  useEffect(() => {
    if (autoRefreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchWeatherData();
      }, autoRefreshInterval * 60 * 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefreshInterval, apiKey, cityName, unit]);

  const handleRefresh = () => {
    fetchWeatherData();
  };

  const handleUnitToggle = () => {
    setUnit((prev) => (prev === "fahrenheit" ? "celsius" : "fahrenheit"));
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentSymbol = unit === "celsius" ? celsiusSymbol : fahrenheitSymbol;

  return (
    <div id={id} className="wf-weatherwidget">
      <div className="wf-weatherwidget-header">
        <h2 className="wf-weatherwidget-heading">{heading}</h2>
        <div className="wf-weatherwidget-controls">
          {showUnitToggle && (
            <button
              className="wf-weatherwidget-unit-toggle"
              onClick={handleUnitToggle}
              type="button"
              aria-label={`Switch to ${
                unit === "fahrenheit" ? "Celsius" : "Fahrenheit"
              }`}
            >
              {unit === "fahrenheit" ? celsiusSymbol : fahrenheitSymbol}
            </button>
          )}
          {showRefreshButton && (
            <button
              className="wf-weatherwidget-refresh-button"
              onClick={handleRefresh}
              type="button"
              disabled={loading}
              aria-label="Refresh weather data"
            >
              {refreshButtonText}
            </button>
          )}
        </div>
      </div>

      <div className="wf-weatherwidget-content">
        {loading && (
          <div className="wf-weatherwidget-loading">
            <div className="wf-weatherwidget-spinner" aria-hidden="true"></div>
            <p className="wf-weatherwidget-loading-text">{loadingText}</p>
          </div>
        )}

        {error && !loading && (
          <div className="wf-weatherwidget-error" role="alert">
            <p className="wf-weatherwidget-error-text">{error}</p>
          </div>
        )}

        {weatherData && !loading && !error && (
          <>
            <div className="wf-weatherwidget-main">
              <div className="wf-weatherwidget-temperature-section">
                {showLabels && (
                  <span className="wf-weatherwidget-label">
                    {temperatureLabel}
                  </span>
                )}
                <div className="wf-weatherwidget-temperature">
                  <span className="wf-weatherwidget-temperature-value">
                    {weatherData.temperature}
                  </span>
                  <span className="wf-weatherwidget-temperature-unit">
                    {currentSymbol}
                  </span>
                </div>
              </div>

              <div className="wf-weatherwidget-condition-section">
                {showLabels && (
                  <span className="wf-weatherwidget-label">
                    {conditionLabel}
                  </span>
                )}
                <div className="wf-weatherwidget-condition">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                    alt={weatherData.condition}
                    className="wf-weatherwidget-icon"
                  />
                  <span className="wf-weatherwidget-condition-text">
                    {weatherData.condition}
                  </span>
                </div>
              </div>
            </div>

            <div className="wf-weatherwidget-details">
              <div className="wf-weatherwidget-detail-item">
                {showLabels && (
                  <span className="wf-weatherwidget-label">
                    {humidityLabel}
                  </span>
                )}
                <span className="wf-weatherwidget-detail-value">
                  {weatherData.humidity}%
                </span>
              </div>

              <div className="wf-weatherwidget-detail-item">
                {showLabels && (
                  <span className="wf-weatherwidget-label">
                    {windSpeedLabel}
                  </span>
                )}
                <span className="wf-weatherwidget-detail-value">
                  {weatherData.windSpeed} {unit === "celsius" ? "m/s" : "mph"}
                </span>
              </div>
            </div>

            {showLastUpdated && (
              <div className="wf-weatherwidget-footer">
                <span className="wf-weatherwidget-timestamp">
                  {lastUpdatedLabel} {formatTimestamp(weatherData.timestamp)}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}