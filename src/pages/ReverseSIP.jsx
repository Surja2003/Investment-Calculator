import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { formatCompact, formatCurrency } from '../utils/calcEngine';
import { Link } from 'react-router-dom';

// ── XIRR Math ────────────────────────────────────────────────────────────────
/**
 * Reverse SIP: given monthly investment, years, and final corpus, find annual return rate.
 * Uses Newton-Raphson iteration on the FV of annuity formula.
 */
function reverseSIP(monthlyInvestment, years, finalCorpus) {
  const n = years * 12;
  // FV = P * ((1+r)^n - 1) / r * (1+r)
  // Solve for r by Newton-Raphson
  let r = 0.01; // initial guess: 1% monthly
  for (let i = 0; i < 200; i++) {
    const fv = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const dfv = monthlyInvestment * (
      ((n * Math.pow(1 + r, n - 1) * r - (Math.pow(1 + r, n) - 1)) / (r * r)) * (1 + r)
      + ((Math.pow(1 + r, n) - 1) / r)
    );
    const delta = (fv - finalCorpus) / dfv;
    r -= delta;
    if (Math.abs(delta) < 1e-10) break;
    if (r <= 0) r = 1e-6;
  }
  return r * 12 * 100; // annual %
}

/**
 * Reverse Lumpsum: given principal, years, and final value, find annual return rate.
 * FV = P * (1 + r)^n → r = (FV/P)^(1/n) - 1
 */
function reverseLumpsum(principal, years, finalValue) {
  if (principal <= 0 || finalValue <= 0 || years <= 0) return 0;
  return (Math.pow(finalValue / principal, 1 / years) - 1) * 100;
}

// ── Format helpers ────────────────────────────────────────────────────────────
const fmtINR = (v) => {
  if (v >= 1e7) return `₹${(v/1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v/1e5).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
};

// ── Subcomponents ─────────────────────────────────────────────────────────────
function InputRow({ label, value, onChange, prefix, suffix, min, max, step = 1 }) {
  const { isDarkMode } = useTheme();
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
        <div className={`flex items-center gap-1 rounded-xl px-3 py-1.5 border text-sm font-bold ${
          isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-50 border-slate-300 text-emerald-700'
        }`}>
          {prefix && <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            className="bg-transparent outline-none w-24 text-right"
            min={min} max={max} step={step}
          />
          {suffix && <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{suffix}</span>}
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-500"
        style={{ background: `linear-gradient(to right, #10B981 0%, #10B981 ${((value-min)/(max-min))*100}%, ${isDarkMode ? '#1f2937' : '#e2e8f0'} ${((value-min)/(max-min))*100}%, ${isDarkMode ? '#1f2937' : '#e2e8f0'} 100%)` }}
      />
      <div className={`flex justify-between text-[10px] mt-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max >= 1e5 ? fmtINR(max).replace('₹','') : max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, highlight, isDarkMode }) {
  return (
    <div className={`rounded-2xl p-4 border text-center ${
      highlight
        ? 'bg-emerald-500/10 border-emerald-500/40'
        : isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
      <p className={`text-xl font-black ${highlight ? 'text-emerald-400' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const ReverseSIP = () => {
  const { isDarkMode } = useTheme();
  const [mode, setMode] = useState('sip'); // 'sip' | 'lumpsum'

  // SIP reverse inputs
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [corpus, setCorpus] = useState(2500000);

  // Lumpsum reverse inputs
  const [principal, setPrincipal] = useState(500000);
  const [lYears, setLYears] = useState(10);
  const [fValue, setFValue] = useState(1500000);

  const sipRate = reverseSIP(monthly, years, corpus);
  const lumpsumRate = reverseLumpsum(principal, lYears, fValue);

  const sipInvested = monthly * years * 12;
  const sipGains = corpus - sipInvested;

  const lumpsumGains = fValue - principal;

  const waLink = (mode === 'sip')
    ? `https://wa.me/?text=${encodeURIComponent(`📊 My SIP XIRR Result!\n\nI invested ₹${(monthly).toLocaleString('en-IN')}/month for ${years} years.\nFinal Corpus: ${fmtINR(corpus)}\nMy XIRR: ${sipRate.toFixed(2)}% p.a.\n\nCalculate yours 👉 https://surja2003.github.io/Investment-Calculator/`)}`
    : `https://wa.me/?text=${encodeURIComponent(`📊 My Lumpsum CAGR Result!\n\nI invested ${fmtINR(principal)} for ${lYears} years.\nFinal Value: ${fmtINR(fValue)}\nMy CAGR: ${lumpsumRate.toFixed(2)}% p.a.\n\nCalculate yours 👉 https://surja2003.github.io/Investment-Calculator/`)}`;

  return (
    <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border ${
            isDarkMode ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Reverse Calculator
          </span>
          <h1 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Find Your XIRR / CAGR
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            "I already invested — what was my actual annual return rate?"
          </p>
        </div>

        {/* Mode Toggle */}
        <div className={`flex rounded-2xl p-1 mb-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {['sip', 'lumpsum'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                mode === m
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}>
              {m === 'sip' ? '📈 Reverse SIP (XIRR)' : '💰 Reverse Lumpsum (CAGR)'}
            </button>
          ))}
        </div>

        {/* Input Card */}
        <div className={`rounded-2xl border p-6 mb-6 ${isDarkMode ? 'bg-[#0c1222] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          {mode === 'sip' ? (
            <>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Enter your SIP details
              </p>
              <InputRow label="Monthly Investment" value={monthly} onChange={setMonthly} prefix="₹" min={500} max={200000} step={500} />
              <InputRow label="Investment Duration" value={years} onChange={setYears} suffix=" Yr" min={1} max={40} />
              <InputRow label="Final Corpus (Current Value)" value={corpus} onChange={setCorpus} prefix="₹" min={10000} max={50000000} step={10000} />
            </>
          ) : (
            <>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Enter your Lumpsum details
              </p>
              <InputRow label="Amount Invested" value={principal} onChange={setPrincipal} prefix="₹" min={10000} max={10000000} step={10000} />
              <InputRow label="Investment Duration" value={lYears} onChange={setLYears} suffix=" Yr" min={1} max={40} />
              <InputRow label="Current Value" value={fValue} onChange={setFValue} prefix="₹" min={10000} max={50000000} step={10000} />
            </>
          )}
        </div>

        {/* Results */}
        {mode === 'sip' ? (
          <>
            {/* XIRR highlight */}
            <div className={`rounded-2xl border p-6 mb-4 text-center ${
              sipRate > 0 && sipRate < 100
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : isDarkMode ? 'bg-red-950/20 border-red-900/40' : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Your XIRR (Annual Return Rate)
              </p>
              <p className={`text-5xl font-black mb-2 ${
                sipRate > 0 && sipRate < 100 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {sipRate > 0 && sipRate < 100 ? `${sipRate.toFixed(2)}%` : '—'}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>per annum</p>
              {sipRate > 12 && sipRate < 100 && (
                <p className="mt-2 text-xs font-semibold text-emerald-400">🎉 Excellent! Above market average (12%)</p>
              )}
              {sipRate > 0 && sipRate <= 8 && (
                <p className="mt-2 text-xs font-semibold text-amber-400">⚠️ Below average — consider reviewing your fund</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <ResultCard label="Total Invested" value={fmtINR(sipInvested)} isDarkMode={isDarkMode} />
              <ResultCard label="Total Gains" value={fmtINR(sipGains)} isDarkMode={isDarkMode} highlight={sipGains > 0} />
              <ResultCard label="Gain %" value={`${sipInvested > 0 ? ((sipGains/sipInvested)*100).toFixed(1) : 0}%`} isDarkMode={isDarkMode} />
            </div>
          </>
        ) : (
          <>
            <div className={`rounded-2xl border p-6 mb-4 text-center ${
              lumpsumRate > 0 && lumpsumRate < 100
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : isDarkMode ? 'bg-red-950/20 border-red-900/40' : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Your CAGR (Compound Annual Growth Rate)
              </p>
              <p className={`text-5xl font-black mb-2 ${
                lumpsumRate > 0 && lumpsumRate < 100 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {lumpsumRate > 0 && lumpsumRate < 100 ? `${lumpsumRate.toFixed(2)}%` : '—'}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>per annum</p>
              {lumpsumRate > 12 && lumpsumRate < 100 && (
                <p className="mt-2 text-xs font-semibold text-emerald-400">🎉 Excellent! Above market average</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <ResultCard label="Invested" value={fmtINR(principal)} isDarkMode={isDarkMode} />
              <ResultCard label="Gains" value={fmtINR(lumpsumGains)} isDarkMode={isDarkMode} highlight={lumpsumGains > 0} />
              <ResultCard label="Gain %" value={`${principal > 0 ? ((lumpsumGains/principal)*100).toFixed(1) : 0}%`} isDarkMode={isDarkMode} />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center no-print">
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.476 2 2 6.476 2 12c0 1.874.496 3.63 1.363 5.148L2 22l4.977-1.307A9.946 9.946 0 0 0 12 22c5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10zm0 18.182a8.165 8.165 0 0 1-4.154-1.133l-.298-.178-3.073.806.822-2.997-.193-.307A8.164 8.164 0 0 1 3.818 12c0-4.51 3.671-8.182 8.181-8.182 4.511 0 8.182 3.672 8.182 8.182 0 4.51-3.671 8.182-8.182 8.182z"/></svg>
            Share on WhatsApp
          </a>
          <button onClick={() => window.print()}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}>
            🖨️ Print / PDF
          </button>
          <Link to="/sip"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-colors">
            📈 Plan with SIP →
          </Link>
        </div>

        <p className={`text-center text-[10px] mt-6 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
          XIRR calculation uses Newton-Raphson iteration on FV of annuity formula. For informational purposes only.
        </p>
      </div>
    </div>
  );
};

export default ReverseSIP;
