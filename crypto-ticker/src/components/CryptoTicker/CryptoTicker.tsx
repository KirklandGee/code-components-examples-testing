import { useState, useEffect, useRef } from "react";

export interface CryptoTickerProps {
  id?: string;
  coinIds?: string;
  vsCurrency?: string;
  heading?: React.ReactNode;
  subheading?: string;
  showHeading?: boolean;
  layout?: "row" | "grid" | "ticker";
  columns?: "2" | "3" | "4";
  cardStyle?: "elevated" | "outlined" | "minimal";
  showIcon?: boolean;
  showSymbol?: boolean;
  showName?: boolean;
  show24hChange?: boolean;
  decimals?: number;
  refreshInterval?: number;
  animateOnUpdate?: boolean;
  pauseWhenHidden?: boolean;
  loadingText?: string;
  errorText?: string;
  rateLimitText?: string;
  retryButtonText?: string;
}

interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number | null;
  last_updated: string;
}

type FlashState = "up" | "down" | null;

export default function CryptoTicker({
  id,
  coinIds = "bitcoin,ethereum,solana,cardano,dogecoin",
  vsCurrency = "usd",
  heading,
  subheading = "Auto-refreshed from CoinGecko",
  showHeading = true,
  layout = "grid",
  columns = "4",
  cardStyle = "outlined",
  showIcon = true,
  showSymbol = true,
  showName = true,
  show24hChange = true,
  decimals = 2,
  refreshInterval = 60,
  animateOnUpdate = true,
  pauseWhenHidden = true,
  loadingText = "Loading prices…",
  errorText = "Couldn't fetch crypto prices right now. Please try again shortly.",
  rateLimitText = "Too many requests. We'll back off and retry in a moment.",
  retryButtonText = "Retry",
}: CryptoTickerProps) {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsRateLimited] = useState(false);
  const [flashStates, setFlashStates] = useState<Map<string, FlashState>>(new Map());
  
  const previousPricesRef = useRef<Map<string, number>>(new Map());
  const intervalRef = useRef<number | null>(null);
  const currentIntervalRef = useRef(refreshInterval);
  const flashTimeoutsRef = useRef<Map<string, number>>(new Map());

  const fetchCoins = async () => {
    try {
      const idsArray = coinIds.split(",").map((id) => id.trim()).filter(Boolean);
      if (idsArray.length === 0) {
        setError("No coin IDs provided");
        setLoading(false);
        return;
      }

      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vsCurrency)}&ids=${encodeURIComponent(idsArray.join(","))}&price_change_percentage=24h`;
      const response = await fetch(url);

      if (response.status === 429) {
        setIsRateLimited(true);
        setError(rateLimitText);
        currentIntervalRef.current = Math.min(currentIntervalRef.current * 2, 300);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: CoinMarket[] = await response.json();

      const sortedData = idsArray
        .map((id) => data.find((coin) => coin.id === id))
        .filter((coin): coin is CoinMarket => coin !== undefined);

      if (animateOnUpdate && previousPricesRef.current.size > 0) {
        const newFlashStates = new Map<string, FlashState>();
        sortedData.forEach((coin) => {
          const prevPrice = previousPricesRef.current.get(coin.id);
          if (prevPrice !== undefined && prevPrice !== coin.current_price) {
            const flash: FlashState = coin.current_price > prevPrice ? "up" : "down";
            newFlashStates.set(coin.id, flash);

            const existingTimeout = flashTimeoutsRef.current.get(coin.id);
            if (existingTimeout) {
              clearTimeout(existingTimeout);
            }

            const timeout = window.setTimeout(() => {
              setFlashStates((prev) => {
                const next = new Map(prev);
                next.delete(coin.id);
                return next;
              });
              flashTimeoutsRef.current.delete(coin.id);
            }, 500);

            flashTimeoutsRef.current.set(coin.id, timeout);
          }
        });
        setFlashStates(newFlashStates);
      }

      sortedData.forEach((coin) => {
        previousPricesRef.current.set(coin.id, coin.current_price);
      });

      setCoins(sortedData);
      setError(null);
      setIsRateLimited(false);
      currentIntervalRef.current = refreshInterval;
    } catch (err) {
      setError(errorText);
      console.error("CryptoTicker fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();

    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        if (!pauseWhenHidden || document.visibilityState === "visible") {
          fetchCoins();
        }
      }, currentIntervalRef.current * 1000);
    };

    startInterval();

    const handleVisibilityChange = () => {
      if (pauseWhenHidden) {
        if (document.visibilityState === "visible") {
          startInterval();
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    };

    if (pauseWhenHidden) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (pauseWhenHidden) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      flashTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, [coinIds, vsCurrency, refreshInterval, pauseWhenHidden]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else if (price >= 1) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } else if (price >= 0.01) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      });
    } else {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      });
    }
  };

  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      usd: "$",
      eur: "€",
      gbp: "£",
      jpy: "¥",
      cad: "C$",
      aud: "A$",
      inr: "₹",
      brl: "R$",
      btc: "₿",
      eth: "Ξ",
    };
    return symbols[currency.toLowerCase()] || currency.toUpperCase() + " ";
  };

  const renderCoinCard = (coin: CoinMarket) => {
    const flash = flashStates.get(coin.id);
    const changePercent = coin.price_change_percentage_24h ?? 0;
    const isPositive = changePercent >= 0;

    return (
      <div
        key={coin.id}
        className={`wf-cryptoticker-card wf-cryptoticker-card--${cardStyle}${
          flash ? ` wf-cryptoticker-card--flash-${flash}` : ""
        }`}
      >
        {showIcon && (
          <img
            src={coin.image}
            alt={`${coin.name} icon`}
            className="wf-cryptoticker-icon"
          />
        )}
        <div className="wf-cryptoticker-info">
          {showName && <div className="wf-cryptoticker-name">{coin.name}</div>}
          {showSymbol && (
            <div className="wf-cryptoticker-symbol">{coin.symbol.toUpperCase()}</div>
          )}
        </div>
        <div className="wf-cryptoticker-price">
          {getCurrencySymbol(vsCurrency)}
          {formatPrice(coin.current_price)}
        </div>
        {show24hChange && coin.price_change_percentage_24h !== null && (
          <div
            className={`wf-cryptoticker-change wf-cryptoticker-change--${
              isPositive ? "positive" : "negative"
            }`}
          >
            {isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="wf-cryptoticker-loading">{loadingText}</div>;
    }

    if (error) {
      return (
        <div className="wf-cryptoticker-error">
          <p className="wf-cryptoticker-error-message">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchCoins();
            }}
            className="wf-cryptoticker-retry"
          >
            {retryButtonText}
          </button>
        </div>
      );
    }

    if (coins.length === 0) {
      return <div className="wf-cryptoticker-empty">No coins found</div>;
    }

    if (layout === "ticker") {
      return (
        <div className="wf-cryptoticker-ticker-wrapper">
          <div className="wf-cryptoticker-ticker-track">
            {coins.map(renderCoinCard)}
            {coins.map((coin) => {
              const duplicatedCoin = { ...coin, id: `${coin.id}-duplicate` };
              const flash = flashStates.get(coin.id);
              const changePercent = coin.price_change_percentage_24h ?? 0;
              const isPositive = changePercent >= 0;

              return (
                <div
                  key={duplicatedCoin.id}
                  className={`wf-cryptoticker-card wf-cryptoticker-card--${cardStyle}${
                    flash ? ` wf-cryptoticker-card--flash-${flash}` : ""
                  }`}
                >
                  {showIcon && (
                    <img
                      src={coin.image}
                      alt={`${coin.name} icon`}
                      className="wf-cryptoticker-icon"
                    />
                  )}
                  <div className="wf-cryptoticker-info">
                    {showName && <div className="wf-cryptoticker-name">{coin.name}</div>}
                    {showSymbol && (
                      <div className="wf-cryptoticker-symbol">{coin.symbol.toUpperCase()}</div>
                    )}
                  </div>
                  <div className="wf-cryptoticker-price">
                    {getCurrencySymbol(vsCurrency)}
                    {formatPrice(coin.current_price)}
                  </div>
                  {show24hChange && coin.price_change_percentage_24h !== null && (
                    <div
                      className={`wf-cryptoticker-change wf-cryptoticker-change--${
                        isPositive ? "positive" : "negative"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {changePercent.toFixed(2)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`wf-cryptoticker-cards wf-cryptoticker-cards--${layout}${
          layout === "grid" ? ` wf-cryptoticker-cards--cols-${columns}` : ""
        }`}
      >
        {coins.map(renderCoinCard)}
      </div>
    );
  };

  return (
    <div id={id} className="wf-cryptoticker">
      {showHeading && (heading || subheading) && (
        <div className="wf-cryptoticker-header">
          {heading && <h2 className="wf-cryptoticker-heading">{heading}</h2>}
          {subheading && <p className="wf-cryptoticker-subheading">{subheading}</p>}
        </div>
      )}
      {renderContent()}
    </div>
  );
}