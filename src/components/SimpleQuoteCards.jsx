import { useEffect, useState } from 'react';
import { fetchYahooQuotes } from '../utils/quoteData';
import { useTheme } from '../hooks/useTheme';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

const CryptoCard = ({ name, price, changePercent, currency, isDarkMode }) => {
  const positive = (changePercent ?? 0) >= 0;
  const fmt = currency === 'INR' ? inr : usd;
  return (
    <div className="text-center">
      <div className={isDarkMode ? "text-xs text-gray-400 mb-1" : "text-xs text-gray-600 mb-1"}>{name}</div>
      <div className={isDarkMode ? "text-sm font-semibold text-white mb-1" : "text-sm font-semibold text-gray-900 mb-1"}>
        {price != null ? fmt.format(price) : '—'}
      </div>
      <div className={`text-xs px-2 py-0.5 rounded ${positive ? (isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : (isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')}`}>
        {changePercent != null ? `${positive ? '+' : ''}${changePercent.toFixed(2)}%` : '—'}
      </div>
    </div>
  );
};

const SimpleQuoteCards = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const c = await fetchYahooQuotes(['BTC-USD', 'ETH-USD', 'DOGE-USD', 'USDT-USD']);
        if (!mounted) return;
        const cryptoItems = c.map((q) => ({
          key: q.symbol,
          name: q.shortName,
          price: q.price,
          changePercent: q.changePercent,
          currency: 'USD',
          group: 'Crypto',
        }));
        setItems(cryptoItems);
      } catch {
        if (!mounted) return;
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {loading && <div className={isDarkMode ? "py-6 text-sm text-gray-400" : "py-6 text-sm text-gray-600"}>Loading…</div>}
      {!loading && (
        <div className="flex justify-center gap-4 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory">
          {items.map((it) => (
            <div key={it.key} className={`flex-shrink-0 snap-center ${isDarkMode ? "rounded-lg border border-gray-600 bg-gray-800/60 shadow-lg p-4" : "rounded-lg border border-gray-300 bg-white shadow-lg p-4"}`}>
              <CryptoCard name={it.name} price={it.price} changePercent={it.changePercent} currency={it.currency} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleQuoteCards;
