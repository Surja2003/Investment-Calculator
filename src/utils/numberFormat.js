// Compact Indian numbering formatter: K (thousand), L (lakh), Cr (crore)
// Examples: 12,500 -> 13K; 1,20,00,000 -> 1.2 Cr; 75,00,000 -> 75 L
export function formatINCompact(num) {
  const numVal = Number(num) || 0;
  const sign = numVal < 0 ? '-' : '';
  const n = Math.abs(numVal);

  const formatScaled = (value, divisor, unit) => {
    const scaled = value / divisor;
    const digits = scaled < 10 ? 1 : 0; // 1 decimal below 10, else integer
    return `${scaled.toFixed(digits)} ${unit}`;
  };

  if (n >= 1e7) return sign + formatScaled(n, 1e7, 'Cr');
  if (n >= 1e5) return sign + formatScaled(n, 1e5, 'L');
  if (n >= 1e3) return sign + `${Math.round(n / 1e3)}K`;
  return sign + String(Math.round(n));
}

export default formatINCompact;
