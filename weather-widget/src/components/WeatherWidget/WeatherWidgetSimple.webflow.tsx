import WeatherWidget from "./WeatherWidget";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./WeatherWidget.css";

export default declareComponent(WeatherWidget, {
  name: "WeatherWidget (Simple)",
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
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Current Weather",
      group: "Content",
      tooltip: "Widget heading text"
    }),
    refreshButtonText: props.Text({
      name: "Refresh Button Text",
      defaultValue: "Refresh",
      group: "Content",
      tooltip: "Text for the refresh button"
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
    })
  }
});