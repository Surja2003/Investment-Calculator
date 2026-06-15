/**
 * quoteData.js — Real-time market data
 *
 * Crypto  : CoinGecko public API (no key, rate-limited to ~30 req/min)
 * Indices : Yahoo Finance v8 via allorigins CORS proxy (no key)
 *
 * 5-minute in-memory cache to avoid hammering free APIs.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = {};

function isFresh(key) {
  return cache[key] && Date.now() - cache[key].ts < CACHE_TTL_MS;
}

// ─── CoinGecko symbol → id map ───────────────────────────────────────────────
const COINGECKO_ID_MAP = {
  'BTC-USD': 'bitcoin',
  'ETH-USD': 'ethereum',
  'BNB-USD': 'binancecoin',
  'SOL-USD': 'solana',
  'DOGE-USD': 'dogecoin',
  'USDT-USD': 'tether',
  'XRP-USD': 'ripple',
  'ADA-USD': 'cardano',
};

/**
 * Fetch crypto quotes from CoinGecko.
 * @param {string[]} symbols  e.g. ['BTC-USD', 'ETH-USD']
 * @returns {Promise<Array>}
 */
export async function fetchCryptoQuotes(symbols = []) {
  const cacheKey = 'crypto_' + symbols.join(',');
  if (isFresh(cacheKey)) return cache[cacheKey].data;

  const ids = symbols
    .map((s) => COINGECKO_ID_MAP[s])
    .filter(Boolean)
    .join(',');

  if (!ids) return [];

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('CoinGecko error ' + res.status);
    const json = await res.json();

    const result = symbols
      .map((symbol) => {
        const id = COINGECKO_ID_MAP[symbol];
        if (!id || !json[id]) return null;
        const d = json[id];
        return {
          symbol,
          shortName: symbol.replace('-USD', ''),
          price: d.usd ?? null,
          changePercent: d.usd_24h_change ?? null,
          currency: 'USD',
        };
      })
      .filter(Boolean);

    cache[cacheKey] = { data: result, ts: Date.now() };
    return result;
  } catch (err) {
    console.warn('[quoteData] CoinGecko fetch failed:', err.message);
    return cache[cacheKey]?.data ?? [];
  }
}

// ─── Yahoo Finance market indices via allorigins proxy ───────────────────────
const YAHOO_SYMBOLS = [
  { symbol: '^NSEI',  shortName: 'NIFTY 50',  currency: 'INR' },
  { symbol: '^BSESN', shortName: 'SENSEX',     currency: 'INR' },
  { symbol: '^GSPC',  shortName: 'S&P 500',    currency: 'USD' },
  { symbol: '^DJI',   shortName: 'Dow Jones',  currency: 'USD' },
];

async function fetchOneYahoo(symbol) {
  const encoded = encodeURIComponent(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
  );
  const url = `https://api.allorigins.win/get?url=${encoded}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('proxy error ' + res.status);
  const wrapper = await res.json();
  const json = JSON.parse(wrapper.contents);
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error('no meta');
  return {
    price: meta.regularMarketPrice ?? null,
    prevClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
  };
}

/**
 * Fetch Indian and global market index quotes.
 * @returns {Promise<Array>}
 */
export async function fetchIndexQuotes() {
  const cacheKey = 'indices';
  if (isFresh(cacheKey)) return cache[cacheKey].data;

  const results = await Promise.allSettled(
    YAHOO_SYMBOLS.map((entry) =>
      fetchOneYahoo(entry.symbol).then((d) => ({
        symbol: entry.symbol,
        shortName: entry.shortName,
        currency: entry.currency,
        price: d.price,
        changePercent:
          d.prevClose && d.price
            ? ((d.price - d.prevClose) / d.prevClose) * 100
            : null,
      }))
    )
  );

  const data = results
    .map((r) => (r.status === 'fulfilled' ? r.value : null))
    .filter(Boolean);

  if (data.length > 0) {
    cache[cacheKey] = { data, ts: Date.now() };
  }
  return data.length > 0 ? data : (cache[cacheKey]?.data ?? []);
}

/**
 * Legacy shim — fetch crypto quotes using old symbol array API.
 * Kept for backward compatibility with SimpleQuoteCards.
 */
export async function fetchYahooQuotes(symbols = []) {
  return fetchCryptoQuotes(symbols);
}
