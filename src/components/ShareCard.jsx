import { useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { formatCompact } from '../utils/calcEngine';

/**
 * ShareCard — renders a beautiful fullscreen-overlay "result card" that users can screenshot.
 * No external canvas deps required. Works via CSS + native browser screenshot.
 *
 * Props:
 *   mode: 'sip'|'lumpsum'|'swp'|'goal'|'emi'
 *   summary: object with relevant calc results
 *   locale: 'IN'|'US'
 *   years: number
 *   rate: number
 */
const ShareCard = ({ mode, summary = {}, locale = 'IN', years = 0, rate = 0 }) => {
  const [open, setOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const cardRef = useRef(null);

  const sym = locale === 'IN' ? '₹' : '$';
  const fmt = (v) => {
    if (!v) return `${sym}0`;
    if (locale === 'IN') {
      if (v >= 1e7) return `${sym}${(v / 1e7).toFixed(2)} Cr`;
      if (v >= 1e5) return `${sym}${(v / 1e5).toFixed(2)} L`;
      return `${sym}${Math.round(v).toLocaleString('en-IN')}`;
    }
    if (v >= 1e9) return `${sym}${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `${sym}${(v / 1e6).toFixed(2)}M`;
    return `${sym}${Math.round(v).toLocaleString('en-US')}`;
  };

  // Build card data based on mode
  const getCardData = () => {
    switch (mode) {
      case 'sip':
        return {
          emoji: '📈', title: 'SIP Projection',
          badge: `${rate}% p.a. · ${years} Years`,
          rows: [
            { label: 'Monthly Investment', value: fmt(summary.monthlyInvestment), color: '#94a3b8' },
            { label: 'Total Invested', value: fmt(summary.totalInvested), color: '#94a3b8' },
            { label: 'Wealth Gained', value: fmt(summary.totalReturns || summary.wealthGained), color: '#10B981' },
          ],
          highlight: { label: 'Future Value', value: fmt(summary.futureValue) },
        };
      case 'lumpsum':
        return {
          emoji: '💰', title: 'Lumpsum Projection',
          badge: `${rate}% p.a. · ${years} Years`,
          rows: [
            { label: 'Amount Invested', value: fmt(summary.totalInvested), color: '#94a3b8' },
            { label: 'Gains', value: fmt(summary.totalReturns || summary.wealthGained), color: '#10B981' },
          ],
          highlight: { label: 'Maturity Value', value: fmt(summary.futureValue) },
        };
      case 'swp':
        return {
          emoji: '🏦', title: 'SWP Plan',
          badge: `${rate}% p.a. · ${years} Years`,
          rows: [
            { label: 'Starting Corpus', value: fmt(summary.initialInvestment), color: '#94a3b8' },
            { label: 'Total Withdrawn', value: fmt(summary.totalWithdrawn), color: '#10B981' },
          ],
          highlight: { label: 'Remaining Corpus', value: fmt(summary.finalCorpus) },
        };
      case 'goal':
        return {
          emoji: '🎯', title: 'Goal Planner',
          badge: `${rate}% p.a. · ${years} Years`,
          rows: [
            { label: 'Target Amount', value: fmt(summary.target), color: '#94a3b8' },
            { label: 'Total Investment', value: fmt(summary.totalInvestment), color: '#94a3b8' },
          ],
          highlight: { label: 'Required Monthly SIP', value: fmt(summary.requiredMonthlyInvestment) },
        };
      case 'emi':
        return {
          emoji: '🏠', title: 'EMI Plan',
          badge: `${rate}% · ${years} Yrs`,
          rows: [
            { label: 'Principal', value: fmt(summary.principal || summary.totalInvested), color: '#94a3b8' },
            { label: 'Total Interest', value: fmt(summary.totalInterest), color: '#8B5CF6' },
          ],
          highlight: { label: 'Monthly EMI', value: fmt(summary.emi || summary.monthlyEMI) },
        };
      default:
        return { emoji: '📊', title: 'Investment Result', badge: '', rows: [], highlight: { label: 'Result', value: '—' } };
    }
  };

  const data = getCardData();
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Share result card"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(16,185,129,0.3)',
          background: 'rgba(16,185,129,0.08)', color: '#10B981',
          cursor: 'pointer', fontSize: 12, fontWeight: 700,
          fontFamily: 'inherit', transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.16)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.08)'}
      >
        📸 Share Card
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        {/* Card container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxWidth: 420, width: '100%' }}>

          {/* Instructions */}
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.5 }}>
            📸 <strong style={{ color: '#fff' }}>Screenshot this card</strong> to share your results
            <br />
            <span style={{ fontSize: 11, opacity: 0.6 }}>On mobile: hold press → Save Image. On desktop: Ctrl+Shift+S</span>
          </div>

          {/* The actual card to screenshot */}
          <div
            ref={cardRef}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0B0F19 0%, #0f1a2e 40%, #0d2018 100%)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 24, padding: '32px 28px',
              boxShadow: '0 0 60px rgba(16,185,129,0.15), 0 20px 60px rgba(0,0,0,0.6)',
              fontFamily: "'Inter', 'Outfit', system-ui, sans-serif",
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Background glow */}
            <div style={{
              position: 'absolute', top: '-30%', right: '-20%',
              width: 280, height: 280,
              background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-20%', left: '-10%',
              width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 24 }}>{data.emoji}</span>
                  <span style={{
                    fontSize: 19, fontWeight: 900, letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #10B981, #34d399)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{data.title}</span>
                </div>
                {data.badge && (
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 99,
                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                    color: '#10B981', letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>{data.badge}</span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Generated</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{today}</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)', marginBottom: 24 }} />

            {/* Data rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {data.rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Highlight box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
              border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: 16, padding: '18px 20px', marginBottom: 24,
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                {data.highlight.label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', color: '#10B981', lineHeight: 1 }}>
                {data.highlight.value}
              </div>
            </div>

            {/* Footer branding */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#10B981', letterSpacing: '-0.01em' }}>Investment Calculator</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>surja2003.github.io/Investment-Calculator</div>
              </div>
              <div style={{
                fontSize: 9, padding: '4px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em',
              }}>
                Informational only · Not SEBI advice
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${data.emoji} ${data.title} — ${data.highlight.label}: ${data.highlight.value}\n\nCalculate yours: https://surja2003.github.io/Investment-Calculator/`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 0', borderRadius: 12, textDecoration: 'none',
                background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff',
                fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.999 2C6.476 2 2 6.476 2 12c0 1.874.496 3.63 1.363 5.148L2 22l4.977-1.307A9.946 9.946 0 0 0 12 22c5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10z"/>
              </svg>
              Share on WhatsApp
            </a>
            <button
              onClick={() => setOpen(false)}
              style={{
                flex: 0.4, padding: '12px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareCard;
