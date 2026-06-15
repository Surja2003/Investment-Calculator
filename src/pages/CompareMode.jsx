import { useState, useCallback, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  calculateSIP,
  calculateLumpsum,
  calculateSWP,
  calculateGoal,
  formatCurrency,
  formatCompact
} from '../utils/calcEngine';

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const CALC_TYPES = [
  { value: 'sip',     label: 'SIP',     icon: '📈' },
  { value: 'lumpsum', label: 'Lumpsum', icon: '💰' },
  { value: 'swp',     label: 'SWP',     icon: '💸' },
  { value: 'goal',    label: 'Goal',    icon: '🎯' },
];

const DEFAULT_INPUTS = {
  sip:     { monthly: '10000', rate: '12', years: '10', stepup: '10' },
  lumpsum: { principal: '100000', rate: '12', years: '10' },
  swp:     { corpus: '1000000', withdrawal: '8000', rate: '10', years: '10' },
  goal:    { target: '5000000', rate: '12', years: '10' },
};

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function runCalc(type, inputs) {
  const n = (k) => parseFloat(inputs[k]) || 0;
  try {
    switch (type) {
      case 'sip': {
        const res = calculateSIP(n('monthly'), n('rate'), n('years'), {
          isStepUpSIP: n('stepup') > 0,
          stepUpPercentage: n('stepup'),
        });
        return {
          invested: res.summary.totalInvested,
          returns:  res.summary.totalReturns,
          final:    res.summary.futureValue,
          amort:    res.amortization,
          isWithdrawal: false,
        };
      }
      case 'lumpsum': {
        const res = calculateLumpsum(n('principal'), n('rate'), n('years'));
        return {
          invested: res.summary.totalInvested,
          returns:  res.summary.totalReturns,
          final:    res.summary.futureValue,
          amort:    res.amortization,
          isWithdrawal: false,
        };
      }
      case 'swp': {
        const res = calculateSWP(n('corpus'), n('withdrawal'), n('rate'), n('years'));
        return {
          invested:     res.summary.initialInvestment,
          returns:      res.summary.totalWithdrawn,
          final:        res.summary.finalCorpus,
          amort:        res.amortization,
          isWithdrawal: true,
        };
      }
      case 'goal': {
        const res = calculateGoal(n('target'), n('years'), n('rate'));
        return {
          invested: res.summary.totalInvestment,
          returns:  res.summary.wealthGained,
          final:    res.summary.inflationAdjustedTarget,
          amort:    res.amortization,
          isWithdrawal: false,
        };
      }
      default: return null;
    }
  } catch {
    return null;
  }
}

function mergeAmortizations(amortA, amortB) {
  const maxLen = Math.max(amortA.length, amortB.length);
  const data = [];
  for (let i = 0; i < maxLen; i++) {
    const a = amortA[i];
    const b = amortB[i];
    data.push({
      year: i,
      A: a ? Math.round(a.currentValue ?? 0) : null,
      B: b ? Math.round(b.currentValue ?? 0) : null,
    });
  }
  return data;
}

/* ─────────────────────────────────────────────────────────────────────────────
   WINNER ANALYSIS
───────────────────────────────────────────────────────────────────────────── */
function buildAnalysis(typeA, typeB, resA, resB) {
  if (!resA || !resB) return null;
  const finalA = resA.final;
  const finalB = resB.final;
  const winner = finalA >= finalB ? 'A' : 'B';
  const winnerType = winner === 'A' ? typeA : typeB;
  const loserType  = winner === 'A' ? typeB : typeA;
  const winRes  = winner === 'A' ? resA : resB;
  const loseRes = winner === 'A' ? resB : resA;
  const diff = Math.abs(finalA - finalB);
  const pctDiff = loseRes.final > 0 ? ((diff / loseRes.final) * 100).toFixed(1) : '∞';

  const winnerLabel = CALC_TYPES.find(c => c.value === winnerType)?.label;
  const loserLabel  = CALC_TYPES.find(c => c.value === loserType)?.label;

  let reason = '';
  if (winnerType === 'sip' && loserType === 'lumpsum') {
    reason = `SIP's systematic investing discipline with rupee-cost averaging typically outperforms a one-time lumpsum when markets are volatile.`;
  } else if (winnerType === 'lumpsum' && loserType === 'sip') {
    reason = `Lumpsum investing benefits from full compounding from Day 1. With the given rate and tenure, it outpaces SIP which takes time to accumulate.`;
  } else if (winnerType === 'sip' && loserType === 'swp') {
    reason = `SIP grows your wealth consistently, while SWP depletes corpus over time. Accumulation via SIP yields a higher final value.`;
  } else if (winnerType === 'swp' && loserType === 'sip') {
    reason = `The high SWP corpus combined with growth rate preserves enough wealth to outpace the SIP accumulation in this scenario.`;
  } else {
    reason = `${winnerLabel} delivers ${pctDiff}% more wealth than ${loserLabel} under the selected parameters. Higher compounding, larger principal, or longer tenure drove this outcome.`;
  }

  return { winner, winnerLabel, loserLabel, diff, pctDiff, reason };
}

/* ─────────────────────────────────────────────────────────────────────────────
   STYLED SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
function TypeSelector({ selected, onChange, isDark, side }) {
  return (
    <div className="no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
      {CALC_TYPES.map(ct => {
        const active = selected === ct.value;
        return (
          <button
            key={ct.value}
            onClick={() => onChange(ct.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px',
              borderRadius: 30,
              border: active
                ? `2px solid ${side === 'A' ? '#10B981' : '#6366f1'}`
                : `2px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              background: active
                ? side === 'A'
                  ? 'rgba(16,185,129,0.15)'
                  : 'rgba(99,102,241,0.15)'
                : 'transparent',
              color: active
                ? side === 'A' ? '#10B981' : '#818cf8'
                : isDark ? '#9ca3af' : '#6b7280',
              fontWeight: active ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            <span>{ct.icon}</span> {ct.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldRow({ label, id, value, onChange, onBlur, placeholder, min = '0', step = '1', suffix }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
      <label htmlFor={id} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: suffix ? '10px 40px 10px 14px' : '10px 14px',
            borderRadius: 10,
            border: '1.5px solid var(--color-border)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 150ms',
          }}
          onFocus={e => { e.target.style.borderColor = '#10B981'; }}
          onBlurCapture={e => { e.target.style.borderColor = 'var(--color-border)'; }}
        />
        {suffix && (
          <span style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.78rem', color: 'var(--color-text-secondary)', pointerEvents: 'none',
          }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ParamForm({ type, rawInputs, setRaw, side }) {
  const update = (field) => (e) => setRaw(prev => ({ ...prev, [field]: e.target.value }));
  const commit = () => {}; // commit on blur — already synced via rawInputs

  const baseId = `${side}-${type}`;

  switch (type) {
    case 'sip': return (
      <>
        <FieldRow id={`${baseId}-monthly`}   label="Monthly Investment" value={rawInputs.monthly}   onChange={update('monthly')}   onBlur={commit} placeholder="10000" suffix="₹" />
        <FieldRow id={`${baseId}-rate`}      label="Expected Return"    value={rawInputs.rate}      onChange={update('rate')}      onBlur={commit} placeholder="12"    suffix="% p.a." step="0.1" />
        <FieldRow id={`${baseId}-years`}     label="Time Period"        value={rawInputs.years}     onChange={update('years')}     onBlur={commit} placeholder="10"    suffix="yrs" />
        <FieldRow id={`${baseId}-stepup`}    label="Annual Step-Up"     value={rawInputs.stepup}    onChange={update('stepup')}    onBlur={commit} placeholder="10"    suffix="%" step="0.5" />
      </>
    );
    case 'lumpsum': return (
      <>
        <FieldRow id={`${baseId}-principal`} label="Principal Amount"   value={rawInputs.principal} onChange={update('principal')} onBlur={commit} placeholder="100000" suffix="₹" />
        <FieldRow id={`${baseId}-rate`}      label="Expected Return"    value={rawInputs.rate}      onChange={update('rate')}      onBlur={commit} placeholder="12"     suffix="% p.a." step="0.1" />
        <FieldRow id={`${baseId}-years`}     label="Time Period"        value={rawInputs.years}     onChange={update('years')}     onBlur={commit} placeholder="10"     suffix="yrs" />
      </>
    );
    case 'swp': return (
      <>
        <FieldRow id={`${baseId}-corpus`}     label="Corpus Amount"       value={rawInputs.corpus}     onChange={update('corpus')}     onBlur={commit} placeholder="1000000" suffix="₹" />
        <FieldRow id={`${baseId}-withdrawal`} label="Monthly Withdrawal"  value={rawInputs.withdrawal} onChange={update('withdrawal')} onBlur={commit} placeholder="8000"    suffix="₹" />
        <FieldRow id={`${baseId}-rate`}       label="Expected Return"     value={rawInputs.rate}       onChange={update('rate')}       onBlur={commit} placeholder="10"      suffix="% p.a." step="0.1" />
        <FieldRow id={`${baseId}-years`}      label="Time Period"         value={rawInputs.years}      onChange={update('years')}      onBlur={commit} placeholder="10"      suffix="yrs" />
      </>
    );
    case 'goal': return (
      <>
        <FieldRow id={`${baseId}-target`}  label="Target Amount"   value={rawInputs.target}  onChange={update('target')}  onBlur={commit} placeholder="5000000" suffix="₹" />
        <FieldRow id={`${baseId}-rate`}    label="Expected Return" value={rawInputs.rate}    onChange={update('rate')}    onBlur={commit} placeholder="12"      suffix="% p.a." step="0.1" />
        <FieldRow id={`${baseId}-years`}   label="Time Period"     value={rawInputs.years}   onChange={update('years')}   onBlur={commit} placeholder="10"      suffix="yrs" />
      </>
    );
    default: return null;
  }
}

function SummaryCard({ label, value, highlight, isDark }) {
  return (
    <div style={{
      flex: 1,
      padding: '14px 12px',
      borderRadius: 12,
      background: highlight
        ? (isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)')
        : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
      border: highlight
        ? '1.5px solid rgba(16,185,129,0.35)'
        : `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: highlight ? '#10B981' : 'var(--color-text)', lineHeight: 1.2 }}>
        {value}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDark ? '#1a2035' : '#fff',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>Year {label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.stroke, display: 'inline-block' }} />
          <span style={{ color: p.stroke, fontWeight: 600 }}>{p.name}:</span>
          <span style={{ color: 'var(--color-text)' }}>{formatCompact(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PANEL COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function Panel({ side, type, setType, rawInputs, setRaw, result, isDark, labelA, labelB }) {
  const accentColor = side === 'A' ? '#10B981' : '#6366f1';
  const bgGradient  = side === 'A'
    ? (isDark ? 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(6,182,212,0.04) 100%)' : 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(255,255,255,0) 100%)')
    : (isDark ? 'linear-gradient(135deg, rgba(99,102,241,0.09) 0%, rgba(139,92,246,0.04) 100%)' : 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(255,255,255,0) 100%)');

  const ctLabel = CALC_TYPES.find(c => c.value === type)?.label ?? '';

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      background: isDark ? 'rgba(15,20,36,0.85)' : 'rgba(255,255,255,0.95)',
      borderRadius: 20,
      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)'}`,
      boxShadow: isDark
        ? `0 0 0 1px rgba(255,255,255,0.03), 0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`
        : '0 8px 32px rgba(0,0,0,0.08)',
      padding: '24px 22px',
      backgroundImage: bgGradient,
      backdropFilter: 'blur(16px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent top-bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${accentColor}bb, ${accentColor}44)`,
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Panel header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: `${accentColor}22`,
          border: `2px solid ${accentColor}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '0.9rem', color: accentColor,
        }}>
          {side}
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Strategy {side}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>
            {ctLabel} Calculator
          </div>
        </div>
      </div>

      <TypeSelector selected={type} onChange={setType} isDark={isDark} side={side} />

      <ParamForm type={type} rawInputs={rawInputs} setRaw={setRaw} side={side} />

      {/* Result Summary */}
      {result && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Summary
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {result.isWithdrawal ? (
              <>
                <SummaryCard label="Corpus"     value={formatCompact(result.invested)} isDark={isDark} />
                <SummaryCard label="Withdrawn"  value={formatCompact(result.returns)}  isDark={isDark} />
                <SummaryCard label="Remaining"  value={formatCompact(result.final)}    isDark={isDark} highlight />
              </>
            ) : (
              <>
                <SummaryCard label="Invested"   value={formatCompact(result.invested)} isDark={isDark} />
                <SummaryCard label="Returns"    value={formatCompact(result.returns)}  isDark={isDark} />
                <SummaryCard label="Final Value" value={formatCompact(result.final)}   isDark={isDark} highlight />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function CompareMode() {
  const { isDarkMode } = useTheme();

  const [typeA, setTypeA] = useState('sip');
  const [typeB, setTypeB] = useState('lumpsum');
  const [rawA, setRawA] = useState({ ...DEFAULT_INPUTS.sip });
  const [rawB, setRawB] = useState({ ...DEFAULT_INPUTS.lumpsum });

  // When type changes, reset raw inputs for that panel
  const handleTypeA = useCallback((t) => {
    setTypeA(t);
    setRawA({ ...DEFAULT_INPUTS[t] });
  }, []);

  const handleTypeB = useCallback((t) => {
    setTypeB(t);
    setRawB({ ...DEFAULT_INPUTS[t] });
  }, []);

  // Live calculation (runs on every render — inputs are small, fast)
  const resA = useMemo(() => runCalc(typeA, rawA), [typeA, rawA]);
  const resB = useMemo(() => runCalc(typeB, rawB), [typeB, rawB]);

  const chartData = useMemo(() => {
    if (!resA || !resB) return [];
    return mergeAmortizations(resA.amort, resB.amort);
  }, [resA, resB]);

  const analysis = useMemo(() => buildAnalysis(typeA, typeB, resA, resB), [typeA, typeB, resA, resB]);

  /* WhatsApp share */
  const handleWhatsAppShare = () => {
    if (!analysis) return;
    const labelA = CALC_TYPES.find(c => c.value === typeA)?.label;
    const labelB = CALC_TYPES.find(c => c.value === typeB)?.label;
    const text = [
      `📊 *Investment Strategy Comparison*`,
      ``,
      `*Strategy A — ${labelA}*`,
      resA ? `• Invested: ${formatCurrency(resA.invested)}\n• Returns: ${formatCurrency(resA.returns)}\n• Final Value: ${formatCurrency(resA.final)}` : '',
      ``,
      `*Strategy B — ${labelB}*`,
      resB ? `• Invested: ${formatCurrency(resB.invested)}\n• Returns: ${formatCurrency(resB.returns)}\n• Final Value: ${formatCurrency(resB.final)}` : '',
      ``,
      `🏆 *Winner: Strategy ${analysis.winner} (${analysis.winner === 'A' ? labelA : labelB})*`,
      `Difference: ${formatCompact(analysis.diff)} (${analysis.pctDiff}% more)`,
      ``,
      `${analysis.reason}`,
      ``,
      `Calculated with Investment Calculator 🚀`,
    ].join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  /* ── Styles (inline, no external deps) ── */
  const bg = isDarkMode ? '#090d16' : '#f0f4f8';

  const labelA = CALC_TYPES.find(c => c.value === typeA)?.label;
  const labelB = CALC_TYPES.find(c => c.value === typeB)?.label;

  return (
    <div style={{
      minHeight: '100vh',
      background: bg,
      fontFamily: 'var(--font-family-sans, Inter, system-ui, sans-serif)',
      paddingBottom: 60,
    }}>
      {/* ── Page Header ── */}
      <div style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #0d1b2a 0%, #0a1628 50%, #070f1c 100%)'
          : 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)',
        borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        padding: '36px 24px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 30, padding: '5px 16px', fontSize: '0.78rem',
          fontWeight: 600, color: '#10B981', marginBottom: 14, letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          ⚡ Side-by-Side Analysis
        </div>
        <h1 style={{
          margin: '0 0 10px', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 800,
          background: isDarkMode
            ? 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Investment Comparison
        </h1>
        <p style={{ margin: 0, color: isDarkMode ? '#64748b' : '#64748b', fontSize: '0.95rem', maxWidth: 520, marginInline: 'auto' }}>
          Compare two investment strategies head-to-head and discover which builds more wealth.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 0' }}>

        {/* ── Dual Panel Layout ── */}
        <div style={{
          display: 'flex',
          gap: 0,
          alignItems: 'stretch',
          flexWrap: 'wrap',
          position: 'relative',
        }}>
          {/* Panel A */}
          <div style={{ flex: 1, minWidth: 280, padding: '0 12px 24px 0' }}>
            <Panel
              side="A"
              type={typeA}
              setType={handleTypeA}
              rawInputs={rawA}
              setRaw={setRawA}
              result={resA}
              isDark={isDarkMode}
              labelA={labelA}
              labelB={labelB}
            />
          </div>

          {/* VS Badge (center) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            minWidth: 52,
            zIndex: 10,
            position: 'relative',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: isDarkMode
                ? 'linear-gradient(135deg, #10B981 0%, #6366f1 100%)'
                : 'linear-gradient(135deg, #10B981 0%, #6366f1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.9rem', color: '#fff',
              boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
              letterSpacing: '-0.02em',
              flexShrink: 0,
            }}>
              VS
            </div>
            {/* Vertical connector line on desktop */}
            <div style={{
              width: 2, flexGrow: 1, marginTop: 12, marginBottom: 12,
              background: 'linear-gradient(180deg, rgba(16,185,129,0.3), rgba(99,102,241,0.3))',
              borderRadius: 1,
            }} />
          </div>

          {/* Panel B */}
          <div style={{ flex: 1, minWidth: 280, padding: '0 0 24px 12px' }}>
            <Panel
              side="B"
              type={typeB}
              setType={handleTypeB}
              rawInputs={rawB}
              setRaw={setRawB}
              result={resB}
              isDark={isDarkMode}
              labelA={labelA}
              labelB={labelB}
            />
          </div>
        </div>

        {/* ── Results Section ── */}
        {resA && resB && analysis && (
          <div style={{ marginTop: 8 }}>

            {/* Winner Banner */}
            <div style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(99,102,241,0.10) 100%)'
                : 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(99,102,241,0.06) 100%)',
              border: `1.5px solid ${analysis.winner === 'A' ? 'rgba(16,185,129,0.35)' : 'rgba(99,102,241,0.35)'}`,
              borderRadius: 18,
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  fontSize: '2rem',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                }}>
                  🏆
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Winner
                  </div>
                  <div style={{
                    fontWeight: 800, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                    color: analysis.winner === 'A' ? '#10B981' : '#818cf8',
                  }}>
                    Strategy {analysis.winner} — {analysis.winner === 'A' ? labelA : labelB}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Ahead By
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#10B981' }}>
                  {formatCompact(analysis.diff)}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  ({analysis.pctDiff}% more)
                </div>
              </div>
            </div>

            {/* Comparison Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
              marginBottom: 28,
            }}>
              {[
                {
                  title: `Strategy A — ${labelA}`,
                  color: '#10B981',
                  invested: resA.invested,
                  returns:  resA.returns,
                  final:    resA.final,
                  isWithdrawal: resA.isWithdrawal,
                },
                {
                  title: `Strategy B — ${labelB}`,
                  color: '#6366f1',
                  invested: resB.invested,
                  returns:  resB.returns,
                  final:    resB.final,
                  isWithdrawal: resB.isWithdrawal,
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: isDarkMode ? 'rgba(15,20,36,0.85)' : 'rgba(255,255,255,0.95)',
                    border: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
                    borderRadius: 16,
                    padding: '20px 20px 16px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${s.color}cc, ${s.color}33)`,
                  }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: s.color, marginBottom: 14 }}>
                    {s.title}
                  </div>
                  {[
                    { label: s.isWithdrawal ? 'Corpus'    : 'Invested',   val: s.invested },
                    { label: s.isWithdrawal ? 'Withdrawn' : 'Returns',    val: s.returns  },
                    { label: s.isWithdrawal ? 'Remaining' : 'Final Value', val: s.final   },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 0',
                      borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.label}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        {formatCompact(row.val)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Overlapping Area Chart */}
            <div style={{
              background: isDarkMode ? 'rgba(15,20,36,0.85)' : 'rgba(255,255,255,0.95)',
              border: `1.5px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
              borderRadius: 20,
              padding: '24px 18px 18px',
              marginBottom: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)', marginBottom: 4 }}>
                Wealth Growth Over Time
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                Comparing portfolio value year by year
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: isDarkMode ? '#64748b' : '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 11, fill: isDarkMode ? '#64748b' : '#94a3b8' }}
                  />
                  <YAxis
                    tickFormatter={v => formatCompact(v).replace('₹', '')}
                    tick={{ fontSize: 11, fill: isDarkMode ? '#64748b' : '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                  />
                  <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: '0.8rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>{value}</span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="A"
                    name={`Strategy A (${labelA})`}
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#gradA)"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="B"
                    name={`Strategy B (${labelB})`}
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#gradB)"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Which is Better? */}
            <div style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(99,102,241,0.06) 100%)'
                : 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(99,102,241,0.04) 100%)',
              border: `1.5px solid ${isDarkMode ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.2)'}`,
              borderRadius: 18,
              padding: '22px 26px',
              marginBottom: 28,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: '1.3rem' }}>💡</span>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>
                  Which is Better?
                </div>
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: isDarkMode ? '#94a3b8' : '#475569',
                lineHeight: 1.7,
              }}>
                <strong style={{ color: analysis.winner === 'A' ? '#10B981' : '#818cf8' }}>
                  Strategy {analysis.winner} ({analysis.winner === 'A' ? labelA : labelB})
                </strong>
                {' '}wins by{' '}
                <strong style={{ color: '#10B981' }}>
                  {formatCompact(analysis.diff)} ({analysis.pctDiff}%)
                </strong>
                {' '}after the investment tenure.
              </p>
              <p style={{
                margin: '10px 0 0',
                fontSize: '0.875rem',
                color: isDarkMode ? '#64748b' : '#6b7280',
                lineHeight: 1.7,
              }}>
                {analysis.reason}
              </p>
              <p style={{
                margin: '10px 0 0',
                fontSize: '0.78rem',
                color: isDarkMode ? '#475569' : '#94a3b8',
                fontStyle: 'italic',
              }}>
                * Results are projections assuming constant returns. Actual returns may vary based on market conditions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="no-print" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 16 }}>
              <button
                onClick={handleWhatsAppShare}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '13px 30px',
                  borderRadius: 50,
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.35)',
                  transition: 'transform 150ms, box-shadow 150ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,211,102,0.45)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.35)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '13px 30px',
                  borderRadius: 50,
                  background: isDarkMode ? '#1f2937' : '#ffffff',
                  color: isDarkMode ? '#e2e8f0' : '#374151',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: `1.5px solid ${isDarkMode ? '#374151' : '#cbd5e1'}`,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  transition: 'transform 150ms, box-shadow 150ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🖨️ Print / PDF
              </button>
            </div>
          </div>
        )}

        {/* Empty state when no results yet */}
        {(!resA || !resB) && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: isDarkMode ? '#374151' : '#94a3b8',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚖️</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              Enter valid values in both panels to see the comparison
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
