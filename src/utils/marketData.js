// Simple market data fetcher with caching and retries
// Note: This uses a public Binance endpoint for demo (no key). For Alpha Vantage/Polygon, pass your API key.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getCacheKey = (source, symbol, interval, limit) => `md:${source}:${symbol}:${interval}:${limit}`;

export async function fetchMarketSeries({
  source = 'binance',
  symbol = 'BTCUSDT',
  interval = '1d',
  limit = 100,
  apiKey,
  cacheMs = 5 * 60 * 1000,
  retries = 2,
}) {
  const cacheKey = getCacheKey(source, symbol, interval, limit);
  try {
    const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < cacheMs) {
        return data;
      }
    }
  } catch {}

  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let series = [];
      if (source === 'binance') {
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        series = json.map((kline) => ({
          time: new Date(kline[0]).toISOString().slice(0, 10),
          value: parseFloat(kline[4]),
        }));
        // INR conversion removed - using static rate for demo
        if (/INR$/.test(symbol)) {
          // Use static conversion rate (in production, use your preferred FX API)
          const staticUSDINR = 83.0; // Approximate rate
          series = series.map((p) => ({ ...p, value: p.value * staticUSDINR }));
        }
      } else if (source === 'alphavantage') {
        const fn = interval === '1d' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_DAILY';
        const url = `https://www.alphavantage.co/query?function=${fn}&symbol=${symbol}&apikey=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const key = 'Time Series (Daily)';
        const entries = Object.entries(json[key] || {});
        series = entries
          .map(([date, values]) => ({ time: date, value: parseFloat(values['4. close']) }))
          .sort((a, b) => (a.time > b.time ? 1 : -1))
          .slice(-limit);
      } else if (source === 'yahoo') {
        // Yahoo source removed - return mock data
        const baseValue = 1000 + Math.random() * 500;
        series = Array.from({ length: limit }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (limit - i));
          return {
            time: date.toISOString().slice(0, 10),
            value: baseValue + (Math.random() - 0.5) * 100
          };
        });
      } else {
        throw new Error('Unsupported source');
      }

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: series }));
        }
      } catch {}
      return series;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await sleep(500 * (attempt + 1));
    }
  }
  throw lastErr;
}
