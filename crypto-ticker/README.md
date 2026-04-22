# CryptoTicker

A live crypto price ticker that pulls real-time prices and 24-hour change percentages from CoinGecko's free public API.

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
| ID | Id | — | HTML ID for targeting with CSS or JavaScript |
| Coin IDs | Text | bitcoin,ethereum,solana,cardano,dogecoin | Comma-separated list of CoinGecko coin IDs (find them at coingecko.com/en/coins — the ID is the slug in the URL, not the symbol) |
| VS Currency | Text | usd | Fiat currency to price the coins in, as a CoinGecko currency code (usd, eur, gbp, jpy, cad, aud, inr, brl, btc, eth, etc.) |
| Heading | TextNode | Live crypto prices | Optional heading above the ticker |
| Subheading | Text | Auto-refreshed from CoinGecko | Optional subheading below the main heading |
| Show Heading | Boolean | true | Show or hide the heading block |
| Layout | Variant | grid | Arrangement of coin cards (row, grid, or ticker) |
| Columns | Variant | 4 | Grid columns on desktop (2, 3, or 4 — grid layout only) |
| Card Style | Variant | outlined | Card surface treatment (elevated, outlined, or minimal) |
| Show Icon | Boolean | true | Show each coin's official icon on its card |
| Show Symbol | Boolean | true | Show the ticker symbol (e.g. BTC, ETH) |
| Show Name | Boolean | true | Show the full coin name (e.g. Bitcoin) |
| Show 24h Change | Boolean | true | Show the 24-hour percent change badge (green up, red down) |
| Decimals | Number | 2 | Number of decimals to show on the price |
| Refresh Interval | Number | 60 | Auto-refresh interval in seconds (CoinGecko free tier allows ~30 req/min — use 30+ here) |
| Animate On Update | Boolean | true | Briefly flash cards green or red when prices tick up or down |
| Pause When Hidden | Boolean | true | Pause the refresh loop when the tab is in the background (saves quota and battery) |
| Loading Text | Text | Loading prices… | Text shown during the initial load |
| Error Text | Text | Couldn't fetch crypto prices right now. Please try again shortly. | Message shown when the API call fails |
| Rate Limit Text | Text | Too many requests. We'll back off and retry in a moment. | Message shown when CoinGecko returns 429 (rate limited) |
| Retry Button Text | Text | Retry | Text on the retry button |

## Styling

This component automatically adapts to your Webflow site's design system through site variables and inherited properties.

### Site Variables

To match your site's design system, define these CSS variables in your Webflow project settings. The component will use the fallback values shown below until you configure them.

| Site Variable | What It Controls | Fallback |
|---------------|------------------|----------|
| --background-primary | Card backgrounds and main container | #ffffff |
| --background-secondary | Hover states and loading background | #f5f5f5 |
| --text-primary | Coin names, prices, and main text | #1a1a1a |
| --text-secondary | Symbols, subheading, and muted text | #737373 |
| --border-color | Card borders and dividers | #e5e5e5 |
| --accent-color | Retry button background | #1a1a1a |
| --accent-text-color | Retry button text | #ffffff |
| --border-radius | Card and button rounding | 8px |

### Inherited Properties

The component inherits these CSS properties from its parent element:
- `font-family` — Typography style
- `color` — Text color
- `line-height` — Text spacing

## Extending in Code

### Custom Coin Selection

To track specific coins, find their CoinGecko IDs at [coingecko.com/en/coins](https://www.coingecko.com/en/coins). The ID is the URL slug, not the ticker symbol:

```
bitcoin → bitcoin
Ethereum → ethereum
Cardano → cardano
Polkadot → polkadot
```

Set the **Coin IDs** property to a comma-separated list: `bitcoin,ethereum,polkadot,chainlink`

### Adjusting Refresh Rate

The **Refresh Interval** property controls how often prices update. CoinGecko's free tier allows approximately 30 requests per minute. For a ticker with 5 coins refreshing every 60 seconds, you'll use 5 requests per minute — well within limits. If you experience rate limiting (429 errors), increase the interval to 90 or 120 seconds.

## Dependencies

No external dependencies.