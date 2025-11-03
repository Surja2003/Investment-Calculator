// Mock function for quotes - replace with your preferred data source
export async function fetchYahooQuotes(symbols = []) {
  // Return mock data instead of calling external API
  return symbols.map(symbol => ({
    symbol,
    shortName: symbol,
    price: 100 + Math.random() * 50, // Random price
    change: (Math.random() - 0.5) * 10, // Random change
    changePercent: (Math.random() - 0.5) * 5, // Random percentage
    currency: 'USD',
    exchange: 'Mock Exchange',
  }));
}
