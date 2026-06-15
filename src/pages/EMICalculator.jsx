import React, { useState, useMemo, useRef } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { formatCurrency, formatCompact } from '../utils/calcEngine';
import { useTheme } from '../hooks/useTheme';

/* ─── constants ─────────────────────────────────────────────────────────────── */
const EMERALD   = '#10B981';
const VIOLET    = '#8B5CF6';
const AMBER     = '#F59E0B';
const DARK_BG   = '#090d16';
const CARD_DARK = 'rgba(255,255,255,0.04)';
const CARD_LIT  = 'rgba(0,0,0,0.04)';
const INFLATION_RATE = 0.06; // 6 % annual assumed inflation

/* ─── helpers ───────────────────────────────────────────────────────────────── */
function calcEMI(principal, annualRate, tenureYears) {
  const n = tenureYears * 12;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcMaxLoan(emi, annualRate, tenureYears) {
  const n = tenureYears * 12;
  const r = annualRate / 100 / 12;
  if (r === 0) return emi * n;
  return (emi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

function buildAmortization(principal, annualRate, tenureYears) {
  const n = tenureYears * 12;
  const r = annualRate / 100 / 12;
  const emi = calcEMI(principal, annualRate, tenureYears);
  let balance = principal;
  const yearly = [];

  for (let yr = 1; yr <= tenureYears; yr++) {
    let prinPaid = 0, intPaid = 0;
    for (let m = 1; m <= 12; m++) {
      const intForMonth = balance * r;
      const prinForMonth = Math.min(emi - intForMonth, balance);
      intPaid  += intForMonth;
      prinPaid += prinForMonth;
      balance  -= prinForMonth;
      if (balance < 0.01) balance = 0;
    }
    yearly.push({
      year     : yr,
      principal: Math.round(prinPaid),
      interest : Math.round(intPaid),
      balance  : Math.round(Math.max(balance, 0)),
    });
    if (balance === 0) break;
  }
  return yearly;
}

function todaysMoney(futureValue, years, inflation = INFLATION_RATE) {
  return futureValue / Math.pow(1 + inflation, years);
}

/* ─── sub-components ─────────────────────────────────────────────────────────── */

function SliderInput({ label, value, rawValue, min, max, step, prefix, suffix,
                       onChange, onRawChange, onBlur, isDark, accent = EMERALD }) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackBg = isDark
    ? `linear-gradient(to right, ${accent} ${pct}%, rgba(255,255,255,0.12) ${pct}%)`
    : `linear-gradient(to right, ${accent} ${pct}%, rgba(0,0,0,0.10) ${pct}%)`;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4,
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          borderRadius: 10, padding: '4px 12px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
          {prefix && <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={rawValue}
            onChange={e => onRawChange(e.target.value)}
            onBlur={onBlur}
            style={{ background: 'transparent', border: 'none', outline: 'none', width: 90,
              textAlign: 'right', fontSize: 15, fontWeight: 700,
              color: isDark ? '#fff' : '#111', fontFamily: 'inherit' }}
          />
          {suffix && <span style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', height: 4, borderRadius: 4, outline: 'none',
          appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
          background: trackBg, accentColor: accent }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
        <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, accent, isDark, icon }) {
  return (
    <div style={{
      background: isDark ? CARD_DARK : CARD_LIT,
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 20, padding: '22px 24px',
      backdropFilter: 'blur(12px)', flex: 1, minWidth: 0,
      boxShadow: isDark ? `0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)` : '0 2px 16px rgba(0,0,0,0.06)',
      transition: 'transform 0.2s', cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>{title}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: accent, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, marginTop: 6, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>{subtitle}</div>}
    </div>
  );
}

const CUSTOM_TOOLTIP_STYLE = (isDark) => ({
  background: isDark ? '#1a2235' : '#fff',
  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
  borderRadius: 12, padding: '10px 16px',
  fontSize: 13, color: isDark ? '#fff' : '#111',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
});

function AreaTooltip({ active, payload, label, isDark, locale }) {
  if (!active || !payload?.length) return null;
  const sym = locale === 'IN' ? '₹' : '$';
  return (
    <div style={CUSTOM_TOOLTIP_STYLE(isDark)}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Year {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {sym}{Number(p.value).toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload, isDark, locale }) {
  if (!active || !payload?.length) return null;
  const sym = locale === 'IN' ? '₹' : '$';
  const p = payload[0];
  return (
    <div style={CUSTOM_TOOLTIP_STYLE(isDark)}>
      <div style={{ color: p.payload.fill, fontWeight: 700 }}>{p.name}</div>
      <div>{sym}{Number(p.value).toLocaleString('en-IN')}</div>
      <div style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
        {p.payload.pct}%
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────────── */
export default function EMICalculator() {
  const { isDarkMode: isDark } = useTheme();
  const [locale, setLocale] = useState('IN'); // 'IN' | 'US'
  const sym = locale === 'IN' ? '₹' : '$';

  /* sliders */
  const [loan,     setLoan]     = useState(2500000);
  const [rate,     setRate]     = useState(8.5);
  const [tenure,   setTenure]   = useState(20);

  /* raw input strings */
  const [rawLoan,   setRawLoan]   = useState('2500000');
  const [rawRate,   setRawRate]   = useState('8.5');
  const [rawTenure, setRawTenure] = useState('20');

  /* reverse EMI */
  const [reverseMode, setReverseMode]     = useState(false);
  const [affordEMI,   setAffordEMI]       = useState(25000);
  const [rawAffordEMI, setRawAffordEMI]   = useState('25000');

  const bg  = isDark ? DARK_BG : '#f4f7fb';
  const txt = isDark ? '#e8eaf0' : '#0f172a';
  const sub = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const cardBg = isDark ? CARD_DARK : CARD_LIT;
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  /* ── calculations ── */
  const emi           = useMemo(() => calcEMI(loan, rate, tenure),           [loan, rate, tenure]);
  const totalPayment  = useMemo(() => emi * tenure * 12,                     [emi, tenure]);
  const totalInterest = useMemo(() => totalPayment - loan,                   [totalPayment, loan]);
  const amortization  = useMemo(() => buildAmortization(loan, rate, tenure), [loan, rate, tenure]);

  const todayInterest = useMemo(() => todaysMoney(totalInterest, tenure / 2), [totalInterest, tenure]);
  const maxLoan       = useMemo(() => calcMaxLoan(affordEMI, rate, tenure),   [affordEMI, rate, tenure]);

  const principalPct = useMemo(() => Math.round((loan / totalPayment) * 100), [loan, totalPayment]);
  const interestPct  = 100 - principalPct;

  const pieData = useMemo(() => [
    { name: 'Principal', value: Math.round(loan),          fill: EMERALD, pct: principalPct },
    { name: 'Interest',  value: Math.round(totalInterest), fill: VIOLET,  pct: interestPct  },
  ], [loan, totalInterest, principalPct, interestPct]);

  const chartData = useMemo(() => amortization.map(r => ({
    year    : r.year,
    Balance : r.balance,
    Principal: r.principal,
    Interest : r.interest,
  })), [amortization]);

  /* ── blur handlers ── */
  const handleLoanBlur = () => {
    const v = parseFloat(rawLoan.replace(/,/g, '')) || loan;
    const c = Math.max(100000, Math.min(100000000, v));
    setLoan(c); setRawLoan(String(c));
  };
  const handleRateBlur = () => {
    const v = parseFloat(rawRate) || rate;
    const c = Math.max(0.1, Math.min(30, v));
    setRate(c); setRawRate(String(c));
  };
  const handleTenureBlur = () => {
    const v = parseInt(rawTenure, 10) || tenure;
    const c = Math.max(1, Math.min(30, v));
    setTenure(c); setRawTenure(String(c));
  };
  const handleAffordEMIBlur = () => {
    const v = parseFloat(rawAffordEMI.replace(/,/g, '')) || affordEMI;
    const c = Math.max(1000, Math.min(10000000, v));
    setAffordEMI(c); setRawAffordEMI(String(c));
  };

  /* ── share ── */
  const handleShare = () => {
    const msg = `📊 EMI Calculation\n\nLoan: ${sym}${loan.toLocaleString('en-IN')}\nRate: ${rate}% p.a.\nTenure: ${tenure} yrs\n\n💳 Monthly EMI: ${sym}${Math.round(emi).toLocaleString('en-IN')}\n💰 Total Payment: ${sym}${Math.round(totalPayment).toLocaleString('en-IN')}\n📈 Total Interest: ${sym}${Math.round(totalInterest).toLocaleString('en-IN')}\n\nCalculated via Investment Calculator`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => window.print();

  /* ── styles ── */
  const sectionCard = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 24, padding: '28px 28px',
    backdropFilter: 'blur(16px)',
    boxShadow: isDark ? '0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 4px 24px rgba(0,0,0,0.06)',
  };

  const btnBase = {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 12, border: 'none',
    cursor: 'pointer', fontSize: 13, fontWeight: 700,
    fontFamily: 'inherit', transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, color: txt, fontFamily: "'Inter', 'Outfit', system-ui, sans-serif", padding: '32px 20px' }}>

      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .print-section { page-break-inside: avoid; }
        }
        input[type=range]::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: ${EMERALD}; cursor: pointer; box-shadow: 0 0 0 3px rgba(16,185,129,0.25); }
        input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: ${EMERALD}; cursor: pointer; border: none; }
        input[type=range]:focus::-webkit-slider-thumb { box-shadow: 0 0 0 5px rgba(16,185,129,0.35); }
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ animation: 'fadeUp 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${EMERALD}, #059669)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏦</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: '-0.03em', background: `linear-gradient(135deg, ${EMERALD} 0%, #34d399 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                EMI Calculator
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: sub }}>Plan your loan repayment with detailed amortization & insights</p>
          </div>

          {/* controls */}
          <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* locale toggle */}
            <div style={{ display: 'flex', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 3, border: `1px solid ${cardBorder}` }}>
              {['IN', 'US'].map(l => (
                <button key={l} onClick={() => setLocale(l)}
                  style={{ ...btnBase, padding: '7px 16px', fontSize: 12,
                    background: locale === l ? EMERALD : 'transparent',
                    color: locale === l ? '#fff' : sub, borderRadius: 10 }}>
                  {l === 'IN' ? '🇮🇳 ₹' : '🌐 $'}
                </button>
              ))}
            </div>
            <button onClick={handleShare}
              style={{ ...btnBase, background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff',
                boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
              <span>📱</span> WhatsApp
            </button>
            <button onClick={handlePrint}
              style={{ ...btnBase, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                color: txt, border: `1px solid ${cardBorder}` }}>
              <span>🖨️</span> Print / PDF
            </button>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* LEFT: Inputs */}
          <div style={{ ...sectionCard, animation: 'fadeUp 0.5s ease 0.1s both' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: txt }}>Loan Parameters</h2>

            <SliderInput
              label="Loan Amount" value={loan} rawValue={rawLoan} min={100000} max={100000000} step={50000}
              prefix={sym} onChange={v => { setLoan(v); setRawLoan(String(v)); }}
              onRawChange={setRawLoan} onBlur={handleLoanBlur} isDark={isDark} />

            <SliderInput
              label="Annual Interest Rate" value={rate} rawValue={rawRate} min={0.1} max={30} step={0.05}
              suffix="%" onChange={v => { setRate(v); setRawRate(String(v)); }}
              onRawChange={setRawRate} onBlur={handleRateBlur} isDark={isDark} accent={VIOLET} />

            <SliderInput
              label="Loan Tenure" value={tenure} rawValue={rawTenure} min={1} max={30} step={1}
              suffix=" yr" onChange={v => { setTenure(v); setRawTenure(String(v)); }}
              onRawChange={setRawTenure} onBlur={handleTenureBlur} isDark={isDark} accent={AMBER} />

            {/* Reverse EMI section */}
            <div style={{ marginTop: 8, padding: '20px', borderRadius: 16,
              background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)',
              border: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.15)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: VIOLET }}>🔄 Reverse EMI</span>
                <button onClick={() => setReverseMode(!reverseMode)}
                  style={{ ...btnBase, padding: '5px 12px', fontSize: 11, background: reverseMode ? VIOLET : 'transparent',
                    color: reverseMode ? '#fff' : VIOLET, border: `1px solid ${VIOLET}`, borderRadius: 8 }}>
                  {reverseMode ? 'ON' : 'OFF'}
                </button>
              </div>
              {reverseMode && (
                <div>
                  <label style={{ fontSize: 12, color: sub, display: 'block', marginBottom: 8 }}>EMI you can afford per month</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                    borderRadius: 10, padding: '8px 14px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                    <span style={{ color: VIOLET, fontWeight: 700 }}>{sym}</span>
                    <input type="text" inputMode="decimal" value={rawAffordEMI}
                      onChange={e => setRawAffordEMI(e.target.value)}
                      onBlur={handleAffordEMIBlur}
                      style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1,
                        fontSize: 16, fontWeight: 700, color: txt, fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ marginTop: 12, padding: '14px 16px', borderRadius: 12,
                    background: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)',
                    border: `1px solid ${isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)'}` }}>
                    <div style={{ fontSize: 12, color: sub, marginBottom: 4 }}>Max loan you can take</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: VIOLET }}>
                      {sym}{Math.round(maxLoan).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )}
              {!reverseMode && (
                <p style={{ margin: 0, fontSize: 12, color: sub }}>
                  Turn ON to calculate the maximum loan you can take based on an EMI you can afford.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: Summary Cards + Pie */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* 3 summary cards */}
            <div className="print-section" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fadeUp 0.5s ease 0.15s both' }}>
              <SummaryCard
                title="Monthly EMI" icon="💳"
                value={`${sym}${Math.round(emi).toLocaleString('en-IN')}`}
                subtitle={`${tenure * 12} payments`}
                accent={EMERALD} isDark={isDark} />
              <SummaryCard
                title="Total Interest" icon="📈"
                value={`${sym}${formatCompact(totalInterest)}`}
                subtitle={`In today's value ≈ ${sym}${formatCompact(todayInterest)}`}
                accent={VIOLET} isDark={isDark} />
              <SummaryCard
                title="Total Payment" icon="💰"
                value={`${sym}${formatCompact(totalPayment)}`}
                subtitle={`${interestPct}% interest burden`}
                accent={AMBER} isDark={isDark} />
            </div>

            {/* Pie chart */}
            <div className="print-section" style={{ ...sectionCard, flex: 1, animation: 'fadeUp 0.5s ease 0.2s both' }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: txt }}>Principal vs Interest</h2>
              <p style={{ margin: '0 0 16px', fontSize: 12, color: sub }}>Proportion of your total repayment</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    dataKey="value" strokeWidth={0} paddingAngle={3}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip isDark={isDark} locale={locale} />} />
                  <Legend formatter={(v, e) => (
                    <span style={{ fontSize: 13, color: txt }}>{v} — {e.payload.pct}%</span>
                  )} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Area Chart ── */}
        <div className="print-section" style={{ ...sectionCard, marginTop: 24, animation: 'fadeUp 0.5s ease 0.25s both' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: txt }}>Loan Balance Over Time</h2>
          <p style={{ margin: '0 0 20px', fontSize: 12, color: sub }}>Outstanding balance, yearly principal & interest paid</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={EMERALD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={EMERALD} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={VIOLET} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={VIOLET} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: sub, fontSize: 12 }} axisLine={false} tickLine={false}
                tickFormatter={v => `Yr ${v}`} />
              <YAxis tick={{ fill: sub, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${sym}${formatCompact(v)}`} />
              <Tooltip content={<AreaTooltip isDark={isDark} locale={locale} />} />
              <Area type="monotone" dataKey="Balance"  stroke={EMERALD} fill="url(#gBalance)"  strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Interest" stroke={VIOLET}  fill="url(#gInterest)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Amortization Table ── */}
        <div className="print-section" style={{ ...sectionCard, marginTop: 24, animation: 'fadeUp 0.5s ease 0.3s both' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: txt }}>Year-by-Year Amortization</h2>
          <p style={{ margin: '0 0 20px', fontSize: 12, color: sub }}>Breakdown of principal, interest, and remaining balance each year</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.07)' }}>
                  {['Year', 'Principal Paid', 'Interest Paid', 'Total Paid', 'Balance'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontWeight: 700,
                      fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: EMERALD, whiteSpace: 'nowrap',
                      textAlign: h === 'Year' ? 'center' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amortization.map((row, idx) => (
                  <tr key={row.year}
                    style={{ background: idx % 2 === 0
                      ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)')
                      : 'transparent',
                      transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(16,185,129,0.07)' : 'rgba(16,185,129,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0
                      ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)')
                      : 'transparent'}>
                    <td style={{ padding: '11px 16px', textAlign: 'center', fontWeight: 700, color: EMERALD }}>{row.year}</td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', color: txt }}>
                      {sym}{row.principal.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', color: VIOLET }}>
                      {sym}{row.interest.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', color: txt }}>
                      {sym}{(row.principal + row.interest).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right',
                      color: row.balance === 0 ? EMERALD : txt,
                      fontWeight: row.balance === 0 ? 700 : 400 }}>
                      {row.balance === 0 ? '✅ Paid Off' : `${sym}${row.balance.toLocaleString('en-IN')}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 12, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)', paddingBottom: 20 }}>
          EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1) &nbsp;·&nbsp; Inflation adjustment assumes {(INFLATION_RATE * 100).toFixed(0)}% p.a. &nbsp;·&nbsp; For illustrative purposes only.
        </div>

      </div>
    </div>
  );
}
