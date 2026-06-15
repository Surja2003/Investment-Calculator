import { useEffect, useState, useCallback } from 'react';
import { fetchCryptoQuotes, fetchIndexQuotes } from '../utils/quoteData';
import { useTheme } from '../hooks/useTheme';

// Formatters
const fmtINR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const fmtUSD = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const fmtCrypto = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

function formatPrice(price, currency) {
  if (price == null) return '—';
  if (currency === 'INR') return '₹' + fmtINR.format(price);
  if (price >= 1000) return '$' + fmtCrypto.format(price);
  return '$' + fmtUSD.format(price);
}

// ── Single ticker card ────────────────────────────────────────────────────────
function QuoteCard({ name, price, changePercent, currency, isDarkMode, badge }) {
  const positive = (changePercent ?? 0) >= 0;
  const arrow = positive ? '▲' : '▼';
  const pct = changePercent != null ? `${arrow} ${Math.abs(changePercent).toFixed(2)}%` : '—';

  return (
    <div
      className={`flex-shrink-0 min-w-[130px] rounded-2xl p-4 border transition-all duration-300 ${
        isDarkMode
          ? 'bg-[#0c1222]/80 border-slate-800 hover:border-emerald-500/30'
          : 'bg-white border-slate-200 hover:border-emerald-400/50 shadow-sm'
      }`}
    >
      {badge && (
        <span
          className={`inline-block text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded mb-2 ${
            isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {badge}
        </span>
      )}
      <div className={`text-[11px] font-semibold mb-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {name}
      </div>
      <div className={`text-base font-black tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        {formatPrice(price, currency)}
      </div>
      <div
        className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
          positive
            ? isDarkMode ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            : isDarkMode ? 'bg-red-950/60 text-red-400' : 'bg-red-50 text-red-600'
        }`}
      >
        {pct}
      </div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function SkeletonCard({ isDarkMode }) {
  return (
    <div className={`flex-shrink-0 min-w-[130px] rounded-2xl p-4 border animate-pulse ${
      isDarkMode ? 'bg-[#0c1222]/80 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className={`h-2 w-12 rounded mb-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`h-3 w-20 rounded mb-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`h-5 w-24 rounded mb-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`h-3 w-16 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const CRYPTO_SYMBOLS = ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD'];

const SimpleQuoteCards = () => {
  const { isDarkMode } = useTheme();
  const [indices, setIndices] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [idx, cry] = await Promise.all([
        fetchIndexQuotes(),
        fetchCryptoQuotes(CRYPTO_SYMBOLS),
      ]);
      setIndices(idx);
      setCrypto(cry);
      setLastUpdated(new Date());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh every 5 minutes
    const id = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [loadData]);

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block" />
          <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Live Market Data
          </span>
          {!loading && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>LIVE</span>
            </span>
          )}
        </div>
        {timeStr && (
          <button
            onClick={loadData}
            className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
              isDarkMode
                ? 'border-slate-700 text-slate-500 hover:text-emerald-400 hover:border-emerald-600'
                : 'border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-400'
            }`}
          >
            ↻ Updated {timeStr}
          </button>
        )}
      </div>

      {error && !loading && (
        <p className={`text-xs text-center py-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          ⚠ Could not load live data. Check your connection.
        </p>
      )}

      {/* Market Indices */}
      {(loading || indices.length > 0) && (
        <div className="mb-4">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Indices
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} isDarkMode={isDarkMode} />)
              : indices.map((it) => (
                  <div key={it.symbol} className="snap-start">
                    <QuoteCard
                      name={it.shortName}
                      price={it.price}
                      changePercent={it.changePercent}
                      currency={it.currency}
                      isDarkMode={isDarkMode}
                      badge={it.currency === 'INR' ? 'NSE' : 'NYSE'}
                    />
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Crypto */}
      {(loading || crypto.length > 0) && (
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Crypto
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} isDarkMode={isDarkMode} />)
              : crypto.map((it) => (
                  <div key={it.symbol} className="snap-start">
                    <QuoteCard
                      name={it.shortName}
                      price={it.price}
                      changePercent={it.changePercent}
                      currency={it.currency}
                      isDarkMode={isDarkMode}
                      badge="Crypto"
                    />
                  </div>
                ))}
          </div>
        </div>
      )}

      <p className={`text-[9px] mt-3 text-center ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
        Prices from CoinGecko &amp; Yahoo Finance · Indicative only · Not investment advice
      </p>
    </div>
  );
};

export default SimpleQuoteCards;
