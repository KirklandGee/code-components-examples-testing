import WeatherWidget from "./WeatherWidget";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./WeatherWidget.css";

export default declareComponent(WeatherWidget, {
  name: "WeatherWidget",
  description: "A clean card-style weather widget that fetches and displays current weather data from the OpenWeatherMap API. Shows temperature, weather condition with icon, humidity percentage, and wind speed in a structured layout. Features a temperature unit toggle (Fahrenheit/Celsius), a refresh button to re-fetch data, and displays a 'last updated' timestamp. Includes loading state with spinner during data fetch and error message display for invalid API keys or unfound cities. Responsive design that maintains readability on all screen sizes.",
  group: "Data Display",
  options: {
    ssr: false,
    applyTagSelectors: true
  },
  props: {
    id: props.Id({
      name: "Element ID",
      group: "Settings",
      tooltip: "HTML ID attribute for targeting with CSS or JavaScript"
    }),
    apiKey: props.Text({
      name: "API Key",
      defaultValue: "",
      group: "Settings",
      tooltip: "OpenWeatherMap API key for authentication"
    }),
    cityName: props.Text({
      name: "City Name",
      defaultValue: "London",
      group: "Settings",
      tooltip: "City name to fetch weather data for"
    }),
    defaultUnit: props.Variant({
      name: "Default Unit",
      options: ["fahrenheit", "celsius"],
      defaultValue: "fahrenheit",
      group: "Settings",
      tooltip: "Default temperature unit on load"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Current Weather",
      group: "Content",
      tooltip: "Widget heading text"
    }),
    temperatureLabel: props.Text({
      name: "Temperature Label",
      defaultValue: "Temperature",
      group: "Content",
      tooltip: "Label for temperature display"
    }),
    conditionLabel: props.Text({
      name: "Condition Label",
      defaultValue: "Condition",
      group: "Content",
      tooltip: "Label for weather condition"
    }),
    humidityLabel: props.Text({
      name: "Humidity Label",
      defaultValue: "Humidity",
      group: "Content",
      tooltip: "Label for humidity percentage"
    }),
    windSpeedLabel: props.Text({
      name: "Wind Speed Label",
      defaultValue: "Wind Speed",
      group: "Content",
      tooltip: "Label for wind speed"
    }),
    lastUpdatedLabel: props.Text({
      name: "Last Updated Label",
      defaultValue: "Last updated:",
      group: "Content",
      tooltip: "Label prefix for last updated timestamp"
    }),
    refreshButtonText: props.Text({
      name: "Refresh Button Text",
      defaultValue: "Refresh",
      group: "Content",
      tooltip: "Text for the refresh button"
    }),
    loadingText: props.Text({
      name: "Loading Text",
      defaultValue: "Loading weather data...",
      group: "Content",
      tooltip: "Text displayed during data fetch"
    }),
    errorInvalidKeyText: props.Text({
      name: "Invalid Key Error",
      defaultValue: "Invalid API key. Please check your credentials.",
      group: "Content",
      tooltip: "Error message for invalid API key"
    }),
    errorCityNotFoundText: props.Text({
      name: "City Not Found Error",
      defaultValue: "City not found. Please check the city name.",
      group: "Content",
      tooltip: "Error message when city is not found"
    }),
    errorGenericText: props.Text({
      name: "Generic Error",
      defaultValue: "Unable to fetch weather data. Please try again.",
      group: "Content",
      tooltip: "Generic error message for other failures"
    }),
    fahrenheitSymbol: props.Text({
      name: "Fahrenheit Symbol",
      defaultValue: "°F",
      group: "Style",
      tooltip: "Symbol for Fahrenheit temperature"
    }),
    celsiusSymbol: props.Text({
      name: "Celsius Symbol",
      defaultValue: "°C",
      group: "Style",
      tooltip: "Symbol for Celsius temperature"
    }),
    showUnitToggle: props.Boolean({
      name: "Show Unit Toggle",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the temperature unit toggle"
    }),
    showRefreshButton: props.Boolean({
      name: "Show Refresh Button",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the refresh button"
    }),
    showLastUpdated: props.Boolean({
      name: "Show Last Updated",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the last updated timestamp"
    }),
    showLabels: props.Boolean({
      name: "Show Labels",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide labels for weather data fields"
    }),
    autoRefreshInterval: props.Number({
      name: "Auto Refresh Interval",
      defaultValue: 0,
      group: "Behavior",
      tooltip: "Auto-refresh interval in minutes (0 to disable)"
    })
  }
});