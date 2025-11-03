import React, { useMemo } from 'react';
import formatINCompact from '../utils/numberFormat';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const COLORS = {
  darkBg: '#0b1220',
  white: '#ffffff',
  gray: '#9ca3af',
  grayText: '#94a3b8',
  green: '#10b981',
  blue: '#6366f1',
};

function getSIPSeries(monthlySip, annualRate, years, startYear) {
  const i = annualRate / 100 / 12;
  const labels = [];
  const invested = [];
  const total = [];
  const returns = [];
  for (let n = 0; n <= years; n++) {
    const months = n * 12;
    labels.push(String(startYear + n));
    const inv = monthlySip * months;
    invested.push(inv);
    // End-of-period contributions: multiply by (1 + i)
    const fv = months === 0 ? 0 : monthlySip * (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
    total.push(Number(fv.toFixed(2)));
    returns.push(Number((fv - inv).toFixed(2)));
  }
  return { labels, invested, total, returns };
}

function getLumpsumSeries(principal, annualRate, years, startYear) {
  const r = annualRate / 100;
  const labels = [];
  const invested = [];
  const total = [];
  const returns = [];
  for (let n = 0; n <= years; n++) {
    labels.push(String(startYear + n));
    invested.push(principal);
    // Use monthly compounding to match calculator summaries
    const fv = principal * Math.pow(1 + r / 12, n * 12);
    total.push(Number(fv.toFixed(2)));
    returns.push(Number((fv - principal).toFixed(2)));
  }
  return { labels, invested, total, returns };
}

const LightweightChart = ({
  height = 420,
  mode = 'lumpsum', // 'sip' | 'lumpsum' | 'swp'
  principal = 100000,
  monthlySip = 5000,
  annualRate = 12,
  years = 5,
  startYear = new Date().getFullYear(),
  title = 'Investment Growth Projection',
  theme = 'dark',
  currency = 'INR',
  precision = 0,
  showFooter = false,
  data = null, // External data for SWP or custom projections
}) => {
  const { labels, invested, total, returns } = useMemo(() => {
    // If external data is provided (e.g., for SWP), use it
    if (data && Array.isArray(data) && data.length > 0) {
      const baseYear = startYear || 2025;
      const labels = data.map((point, index) => String(baseYear + index));
      const total = data.map((point) => point.value);
      // For SWP, we show corpus remaining (total) and no separate invested/returns breakdown
      const invested = data.map(() => 0);
      const returns = data.map(() => 0);
      return { labels, invested, total, returns };
    }
    
    // Otherwise use calculated series
    return mode === 'sip'
      ? getSIPSeries(monthlySip, annualRate, years, startYear)
      : getLumpsumSeries(principal, annualRate, years, startYear);
  }, [mode, principal, monthlySip, annualRate, years, startYear, data]);

  const nf = useMemo(() => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: precision,
  }), [currency, precision]);

  // Gradient helpers
  const growthGradient = (context) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return 'rgba(16,185,129,0.12)';
    const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    grad.addColorStop(0, 'rgba(16,185,129,0.28)');
    grad.addColorStop(0.6, 'rgba(16,185,129,0.08)');
    grad.addColorStop(1, 'rgba(16,185,129,0.01)');
    return grad;
  };
  const totalGradient = (context) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return 'rgba(99,102,241,0.12)';
    const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    grad.addColorStop(0, 'rgba(99,102,241,0.22)');
    grad.addColorStop(0.6, 'rgba(99,102,241,0.06)');
    grad.addColorStop(1, 'rgba(99,102,241,0.01)');
    return grad;
  };

  // Use shared compact formatter for axis ticks

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: theme === 'dark' ? '#cbd5e1' : '#374151', usePointStyle: true },
      },
      title: {
        display: !!title,
        text: title,
        color: theme === 'dark' ? '#e6eef8' : '#111827',
        font: { size: 16, weight: '600' },
        padding: { top: 8, bottom: 12 },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#0f1724' : '#ffffff',
        titleColor: theme === 'dark' ? '#cbd5e1' : '#374151',
        bodyColor: theme === 'dark' ? '#e6eef8' : '#111827',
        borderColor: 'rgba(15,23,42,0.06)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          title: (items) => (items[0] ? labels[items[0].dataIndex] : ''),
          label: (ctx) => {
            const idx = ctx.dataIndex;
            if (ctx.dataset.label === 'Invested') return `Invested: ${nf.format(invested[idx])}`;
            if (ctx.dataset.label === 'Returns') return `Returns: ${nf.format(returns[idx])}`;
            if (ctx.dataset.label === 'Total') return `Total: ${nf.format(total[idx])}`;
            if (ctx.dataset.label === 'Corpus') return `Corpus: ${nf.format(total[idx])}`;
            return nf.format(ctx.parsed.y);
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Year', color: theme === 'dark' ? '#cbd5e1' : '#374151' },
        ticks: { color: theme === 'dark' ? '#cbd5e1' : '#374151', padding: 8 },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'Value', color: theme === 'dark' ? '#cbd5e1' : '#374151' },
        ticks: {
          color: theme === 'dark' ? '#cbd5e1' : '#374151',
          callback: (v) => formatINCompact(v),
          maxTicksLimit: 6,
          padding: 8,
        },
        grid: { color: theme === 'dark' ? 'rgba(148,163,184,0.04)' : 'rgba(15,23,42,0.04)', borderDash: [4, 6] },
      },
    },
    animation: { duration: 900, easing: 'easeOutCubic' },
    elements: { line: { tension: 0.42, borderCapStyle: 'round' }, point: { radius: 4, hoverRadius: 7 } },
  };

  const dataObj = {
    labels,
    datasets: data && Array.isArray(data) && data.length > 0 ? [
      // For external data (SWP), show only corpus
      {
        label: 'Corpus',
        data: total,
        borderColor: COLORS.blue,
        backgroundColor: (context) => totalGradient(context),
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: COLORS.blue,
        pointBorderColor: COLORS.white,
        pointBorderWidth: 2,
        fill: true,
      },
    ] : [
      // For calculated data (SIP/Lumpsum), show all series
      {
        label: 'Invested',
        data: invested,
        borderColor: COLORS.gray,
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 3,
        pointBackgroundColor: COLORS.gray,
        pointBorderColor: COLORS.white,
        pointBorderWidth: 1,
        fill: false,
      },
      {
        label: 'Returns',
        data: returns,
        borderColor: COLORS.green,
        backgroundColor: (context) => growthGradient(context),
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.green,
        pointBorderColor: COLORS.white,
        pointBorderWidth: 2,
        fill: true,
      },
      {
        label: 'Total',
        data: total,
        borderColor: COLORS.blue,
        backgroundColor: (context) => totalGradient(context),
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: COLORS.blue,
        pointBorderColor: COLORS.white,
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const investedFinal = invested[invested.length - 1] ?? 0;
  const totalFinal = total[total.length - 1] ?? 0;

  return (
    <div
      style={{
        height,
        borderRadius: 14,
        padding: 18,
        boxShadow: theme === 'dark' ? '0 10px 36px rgba(2,6,23,0.7)' : '0 8px 20px rgba(15,23,42,0.08)',
        background: theme === 'dark' ? COLORS.darkBg : '#fff',
        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(15,23,42,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        <Line data={dataObj} options={options} />
      </div>

      {showFooter && (
        <div className="mt-4 grid grid-cols-4 gap-3" style={{ marginTop: 12 }}>
          <div className="p-3 rounded-md" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#fafafb' }}>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}>Duration</div>
            <div style={{ color: theme === 'dark' ? '#fff' : '#111827', fontWeight: 700, marginTop: 6 }}>{years} Years</div>
          </div>

          <div className="p-3 rounded-md" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#fafafb' }}>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}>{mode === 'lumpsum' ? 'Initial Amount' : 'Invested (final)'}</div>
            <div style={{ color: theme === 'dark' ? '#fff' : '#111827', fontWeight: 700, marginTop: 6 }}>
              {mode === 'lumpsum' ? nf.format(principal) : nf.format(investedFinal)}
            </div>
          </div>

          <div className="p-3 rounded-md" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#fafafb' }}>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}>Expected Return</div>
            <div style={{ color: theme === 'dark' ? '#fff' : '#111827', fontWeight: 700, marginTop: 6 }}>{annualRate}% p.a.</div>
          </div>

          <div className="p-3 rounded-md" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#fafafb' }}>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}>Maturity Amount</div>
            <div style={{ color: theme === 'dark' ? '#6366f1' : '#0f1724', fontWeight: 700, marginTop: 6 }}>{nf.format(totalFinal)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightweightChart;
