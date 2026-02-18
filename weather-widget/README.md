# WeatherWidget

A clean card-style weather widget that fetches and displays current weather data from the OpenWeatherMap API.

## Getting Started

Install dependencies:
```bash
npm install
```

Share the component to your Webflow workspace:
```bash
npx webflow library share
```

For local development:
```bash
npm run dev
```

## Designer Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| ID | Id | — | HTML ID for targeting |
| API Key | Text | — | OpenWeatherMap API key for authentication |
| City Name | Text | London | City name to fetch weather data for |
| Default Unit | Variant | fahrenheit | Default temperature unit on load (fahrenheit, celsius) |
| Heading | TextNode | Current Weather | Widget heading text |
| Temperature Label | Text | Temperature | Label for temperature display |
| Condition Label | Text | Condition | Label for weather condition |
| Humidity Label | Text | Humidity | Label for humidity percentage |
| Wind Speed Label | Text | Wind Speed | Label for wind speed |
| Last Updated Label | Text | Last updated: | Label prefix for last updated timestamp |
| Refresh Button Text | Text | Refresh | Text for the refresh button |
| Loading Text | Text | Loading weather data... | Text displayed during data fetch |
| Error Invalid Key Text | Text | Invalid API key. Please check your credentials. | Error message for invalid API key |
| Error City Not Found Text | Text | City not found. Please check the city name. | Error message when city is not found |
| Error Generic Text | Text | Unable to fetch weather data. Please try again. | Generic error message for other failures |
| Fahrenheit Symbol | Text | °F | Symbol for Fahrenheit temperature |
| Celsius Symbol | Text | °C | Symbol for Celsius temperature |
| Show Unit Toggle | Boolean | true | Show or hide the temperature unit toggle |
| Show Refresh Button | Boolean | true | Show or hide the refresh button |
| Show Last Updated | Boolean | true | Show or hide the last updated timestamp |
| Show Labels | Boolean | true | Show or hide labels for weather data fields |
| Auto Refresh Interval | Number | 0 | Auto-refresh interval in minutes (0 to disable) |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Widget background color | #ffffff |
| --background-secondary | Hover states and detail item backgrounds | #f5f5f5 |
| --text-primary | Main text color (heading, values) | #1a1a1a |
| --text-secondary | Labels and muted text (timestamps, units) | #737373 |
| --border-color | Widget border and dividers | #e5e5e5 |
| --accent-color | Button backgrounds and active states | #1a1a1a |
| --accent-text-color | Text color on accent backgrounds | #ffffff |
| --border-radius | Corner rounding for widget and buttons | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Adding Custom Weather Icons

Replace the OpenWeatherMap icon with your own custom icon set:

```javascript
// Access the weather icon element and replace with custom SVG
const iconElement = document.querySelector('.wf-weatherwidget-icon');
const weatherCode = iconElement.dataset.weatherCode; // Store code in data attribute

// Map weather codes to custom icons
const customIcons = {
  '01d': '/icons/sun.svg',
  '01n': '/icons/moon.svg',
  '02d': '/icons/partly-cloudy.svg',
  // ... more mappings
};

iconElement.src = customIcons[weatherCode] || '/icons/default.svg';
```

### Formatting Temperature Display

Customize the temperature display format:

```javascript
// Round to nearest integer instead of showing decimals
const tempValue = document.querySelector('.wf-weatherwidget-temperature-value');
tempValue.textContent = Math.round(parseFloat(tempValue.textContent));

// Add "feels like" temperature
const tempSection = document.querySelector('.wf-weatherwidget-temperature-section');
const feelsLike = document.createElement('div');
feelsLike.className = 'wf-weatherwidget-feels-like';
feelsLike.textContent = `Feels like ${Math.round(feelsLikeTemp)}°`;
tempSection.appendChild(feelsLike);
```

## Dependencies

No external dependencies.