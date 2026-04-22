import CryptoTicker from "./CryptoTicker";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import "./CryptoTicker.css";

export default declareComponent(CryptoTicker, {
  name: "CryptoTicker",
  description: "A live crypto price ticker that pulls real-time prices and 24-hour change percentages from CoinGecko's free public API (no auth required). Supports 1 to 8 configurable coins by CoinGecko ID (bitcoin, ethereum, solana, cardano, etc.). Displays each coin as a card with the official coin icon, symbol, current price in the selected fiat currency, and a 24-hour percent change badge that is green for positive and red for negative moves. Auto-refreshes on a configurable interval; when a price changes the card briefly flashes green (up) or red (down) to draw attention. Three layout modes: row (horizontal cards), grid (responsive multi-column), and ticker (horizontal scrolling marquee style). Configurable decimal precision, optional 24-hour change display, and optional animated price update flash. Graceful loading, error (with retry), and rate-limit-awareness. Inherits typography from the site and uses site color variables for background and text with sensible fallbacks. Perfect for fintech, DeFi, and crypto-native marketing sites.",
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
    coinIds: props.Text({
      name: "Coin IDs",
      defaultValue: "bitcoin,ethereum,solana,cardano,dogecoin",
      group: "Settings",
      tooltip: "Comma-separated list of CoinGecko coin IDs (find them at coingecko.com/en/coins — the ID is the slug in the URL, not the symbol)"
    }),
    vsCurrency: props.Text({
      name: "Currency",
      defaultValue: "usd",
      group: "Settings",
      tooltip: "Fiat currency to price the coins in (usd, eur, gbp, jpy, cad, aud, inr, brl, btc, eth, etc.)"
    }),
    heading: props.TextNode({
      name: "Heading",
      defaultValue: "Live crypto prices",
      group: "Content",
      tooltip: "Optional heading above the ticker"
    }),
    subheading: props.Text({
      name: "Subheading",
      defaultValue: "Auto-refreshed from CoinGecko",
      group: "Content",
      tooltip: "Optional subheading below the main heading"
    }),
    showHeading: props.Boolean({
      name: "Show Heading",
      defaultValue: true,
      group: "Display",
      tooltip: "Show or hide the heading block"
    }),
    layout: props.Variant({
      name: "Layout",
      options: ["row", "grid", "ticker"],
      defaultValue: "grid",
      group: "Style",
      tooltip: "Arrangement of coin cards (row: horizontal, grid: multi-column, ticker: scrolling marquee)"
    }),
    columns: props.Variant({
      name: "Grid Columns",
      options: ["2", "3", "4"],
      defaultValue: "4",
      group: "Style",
      tooltip: "Number of columns on desktop (grid layout only)"
    }),
    cardStyle: props.Variant({
      name: "Card Style",
      options: ["elevated", "outlined", "minimal"],
      defaultValue: "outlined",
      group: "Style",
      tooltip: "Card surface treatment (elevated: shadow, outlined: border, minimal: flat)"
    }),
    showIcon: props.Boolean({
      name: "Show Icon",
      defaultValue: true,
      group: "Style",
      tooltip: "Show each coin's official icon on its card"
    }),
    showSymbol: props.Boolean({
      name: "Show Symbol",
      defaultValue: true,
      group: "Style",
      tooltip: "Show the ticker symbol (e.g. BTC, ETH)"
    }),
    showName: props.Boolean({
      name: "Show Name",
      defaultValue: true,
      group: "Style",
      tooltip: "Show the full coin name (e.g. Bitcoin)"
    }),
    show24hChange: props.Boolean({
      name: "Show 24h Change",
      defaultValue: true,
      group: "Style",
      tooltip: "Show the 24-hour percent change badge (green up, red down)"
    }),
    decimals: props.Number({
      name: "Price Decimals",
      defaultValue: 2,
      group: "Style",
      tooltip: "Number of decimals to show on the price (auto-adjusts for high-value coins)"
    }),
    refreshInterval: props.Number({
      name: "Refresh Interval",
      defaultValue: 60,
      group: "Behavior",
      tooltip: "Auto-refresh interval in seconds (use 30+ to respect CoinGecko's free tier rate limits)"
    }),
    animateOnUpdate: props.Boolean({
      name: "Animate Updates",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Briefly flash cards green or red when prices tick up or down"
    }),
    pauseWhenHidden: props.Boolean({
      name: "Pause When Hidden",
      defaultValue: true,
      group: "Behavior",
      tooltip: "Pause the refresh loop when the tab is in the background (saves quota and battery)"
    }),
    loadingText: props.Text({
      name: "Loading Text",
      defaultValue: "Loading prices…",
      group: "Content",
      tooltip: "Text shown during the initial load"
    }),
    errorText: props.Text({
      name: "Error Text",
      defaultValue: "Couldn't fetch crypto prices right now. Please try again shortly.",
      group: "Content",
      tooltip: "Message shown when the API call fails"
    }),
    rateLimitText: props.Text({
      name: "Rate Limit Text",
      defaultValue: "Too many requests. We'll back off and retry in a moment.",
      group: "Content",
      tooltip: "Message shown when CoinGecko returns 429 (rate limited)"
    }),
    retryButtonText: props.Text({
      name: "Retry Button Text",
      defaultValue: "Retry",
      group: "Content",
      tooltip: "Text on the retry button"
    })
  }
});