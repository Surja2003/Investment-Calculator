import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Box,
  Typography,
  Switch,
  Slider,
  IconButton,
  Button,
  Drawer,
  Collapse,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import TableViewIcon from '@mui/icons-material/TableView';
import StarsIcon from '@mui/icons-material/Stars';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimelineIcon from '@mui/icons-material/Timeline';
import FlagIcon from '@mui/icons-material/Flag';
import CalculateIcon from '@mui/icons-material/Calculate';

import {
  calculateSIP,
  calculateLumpsum,
  calculateSWP,
  calculateGoal,
  formatCurrency,
  formatCompact,
  calculateTaxImplications,
  saveToCache,
  loadFromCache,
  serializeState,
  deserializeState,
  todaysMoney,
  generateWhatsAppShare
} from '../utils/calcEngine';
import { updatePageSEO } from '../utils/SEOConfig';
import { CountUp } from './animations';
import { useTheme } from '../hooks/useTheme';

const MobileCalculator = ({ mode: initialMode = 'sip' }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile navigation and view states
  const [mode, setMode] = useState(initialMode);
  const [locale, setLocale] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLocale = params.get('locale');
    if (urlLocale === 'IN' || urlLocale === 'US') {
      return urlLocale;
    }
    try {
      const cachedLocale = localStorage.getItem('inv_calc_global_locale');
      if (cachedLocale === 'IN' || cachedLocale === 'US') {
        return cachedLocale;
      }
    } catch (e) {}
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && (tz.includes('Asia/Kolkata') || tz.includes('Asia/Calcutta'))) {
        return 'IN';
      }
      const langs = navigator.languages || [navigator.language];
      for (const lang of langs) {
        if (lang.toLowerCase().includes('-in') || lang.toLowerCase() === 'en-in') {
          return 'IN';
        }
      }
      if (tz) return 'US';
    } catch (e) {}
    return 'IN';
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale);
    try {
      localStorage.setItem('inv_calc_global_locale', newLocale);
    } catch (e) {}
  };
  
  // Default values
  const [inputs, setInputs] = useState(() => {
    const urlParams = deserializeState(location.search);
    const defaults = {
      sip: { amount: 15000, years: 10, rate: 12, includeInflation: false, inflation: 6, isStepUp: false, stepUpPercent: 10, stepUpFreq: 12 },
      lumpsum: { amount: 200000, years: 10, rate: 12, includeInflation: false, inflation: 6 },
      swp: { amount: 5000000, withdrawal: 25000, years: 10, rate: 8, includeInflation: false, inflation: 6 },
      goal: { target: 5000000, years: 10, rate: 12, includeInflation: false, inflation: 6 }
    };

    const cachedSip = loadFromCache('sip', defaults.sip);
    const cachedLump = loadFromCache('lumpsum', defaults.lumpsum);
    const cachedSwp = loadFromCache('swp', defaults.swp);
    const cachedGoal = loadFromCache('goal', defaults.goal);

    return {
      sip: { ...cachedSip, ...urlParams },
      lumpsum: { ...cachedLump, ...urlParams },
      swp: { ...cachedSwp, ...urlParams },
      goal: { ...cachedGoal, ...urlParams }
    };
  });

  const activeInputs = inputs[mode];

  // Sync mode if changed via routing
  useEffect(() => {
    if (initialMode && initialMode !== mode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // SEO & Scripts updates
  useEffect(() => {
    updatePageSEO(mode, locale);
  }, [mode, locale]);

  // URL Param updates on mount/popstate
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const urlLocale = params.get('locale');
      if (urlLocale === 'IN' || urlLocale === 'US') {
        setLocale(urlLocale);
      }
      const urlParams = deserializeState(location.search);
      if (Object.keys(urlParams).length > 0) {
        setInputs(prev => ({
          ...prev,
          [mode]: {
            ...prev[mode],
            ...urlParams
          }
        }));
      }
    }
  }, [location.search]);

  // Recalculate values in real-time
  const calcResults = useMemo(() => {
    let result = {};
    const options = {
      includeInflation: activeInputs.includeInflation,
      inflation: activeInputs.inflation,
      locale: locale
    };

    if (mode === 'sip') {
      result = calculateSIP(activeInputs.amount, activeInputs.rate, activeInputs.years, {
        ...options,
        isStepUpSIP: activeInputs.isStepUp,
        stepUpPercentage: activeInputs.stepUpPercent,
        stepUpFrequency: activeInputs.stepUpFreq
      });
    } else if (mode === 'lumpsum') {
      result = calculateLumpsum(activeInputs.amount, activeInputs.rate, activeInputs.years, options);
    } else if (mode === 'swp') {
      result = calculateSWP(activeInputs.amount, activeInputs.withdrawal, activeInputs.rate, activeInputs.years, options);
    } else if (mode === 'goal') {
      result = calculateGoal(activeInputs.target, activeInputs.years, activeInputs.rate, options);
    }

    return result;
  }, [mode, activeInputs, locale]);

  // Sync cache & URL parameters safely in useEffect
  useEffect(() => {
    saveToCache(mode, activeInputs);
    const queryString = serializeState(activeInputs);
    const queryParams = new URLSearchParams(queryString);
    queryParams.set('locale', locale);
    navigate(`?${queryParams.toString()}`, { replace: true });
  }, [mode, activeInputs, locale, navigate]);

  // Raw text inputs state for graceful mid-typing on mobile
  const [rawInputs, setRawInputs] = useState({});

  const clampValue = (field, val) => {
    const n = parseFloat(val);
    if (isNaN(n)) return activeInputs[field];
    if (field === 'amount') return Math.max(0, Math.round(n));
    if (field === 'target') return Math.max(0, Math.round(n));
    if (field === 'withdrawal') return Math.max(0, Math.round(n));
    if (field === 'rate') return Math.min(50, Math.max(0, n));
    if (field === 'years') return Math.min(50, Math.max(1, Math.round(n)));
    if (field === 'stepUpPercent') return Math.min(50, Math.max(1, Math.round(n)));
    if (field === 'inflation') return Math.min(20, Math.max(0.1, n));
    return n;
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [field]: value
      }
    }));
  };

  const handleRawChange = (field, strVal) => {
    setRawInputs(prev => ({ ...prev, [field]: strVal }));
  };

  const handleRawBlur = (field) => {
    const raw = rawInputs[field];
    if (raw !== undefined && raw !== '') {
      handleInputChange(field, clampValue(field, raw));
    }
    setRawInputs(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const getRawDisplay = (field) => {
    return rawInputs[field] !== undefined ? rawInputs[field] : activeInputs[field];
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  // Tax calculation helper
  const taxDetails = useMemo(() => {
    let gains = 0;
    if (mode === 'sip' || mode === 'lumpsum') {
      gains = calcResults.summary.totalReturns || 0;
    } else if (mode === 'swp') {
      const totalGrowth = calcResults.summary.finalCorpus + calcResults.summary.totalWithdrawn - calcResults.summary.initialInvestment;
      gains = Math.max(0, totalGrowth);
    } else if (mode === 'goal') {
      gains = calcResults.summary.wealthGained || 0;
    }
    return calculateTaxImplications(gains, locale);
  }, [calcResults, mode, locale]);

  // CSV Export
  const handleCSVExport = () => {
    const header = mode === 'swp' 
      ? 'Year,Initial Investment,Total Withdrawals,Remaining Corpus\n' 
      : 'Year,Invested Amount,Estimated Returns,Total Accumulation\n';
    
    const rows = calcResults.amortization.map(row => {
      if (mode === 'swp') {
        return `${row.year},${row.initialInvestment},${row.totalWithdrawn},${row.corpus}`;
      } else if (mode === 'goal') {
        return `${row.year},${row.invested},${row.projected - row.invested},${row.projected}`;
      } else {
        return `${row.year},${row.invested},${row.returns},${row.currentValue}`;
      }
    }).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${mode}_mobile_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart data formatting
  const areaData = useMemo(() => {
    return calcResults.amortization.map(row => {
      const label = `'${String(row.year)}`;
      if (mode === 'swp') {
        return { name: label, Portfolio: row.corpus };
      } else if (mode === 'goal') {
        return { name: label, Value: row.projected };
      } else {
        return { name: label, Value: row.currentValue };
      }
    });
  }, [calcResults, mode]);

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-24 transition-colors duration-200 ${isDarkMode ? 'text-slate-100 bg-[#090d16]' : 'text-slate-800 bg-slate-50'}`}>
      
      {/* 1. STICKY TOP HEADER - Floating Live Summary */}
      <div className={`sticky top-16 z-40 shadow-md backdrop-blur-md px-4 py-3 flex flex-col gap-2 transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/95 border-b border-slate-800' : 'bg-white/95 border-b border-slate-200 shadow-sm'}`}>
        <div className="flex justify-between items-center">
          <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'goal' ? 'Required Monthly Contribution' : mode === 'swp' ? 'Remaining Corpus' : 'Future Valuation'}
          </span>
          <div className="flex items-center gap-2">
            {/* Quick Share */}
            <IconButton 
              onClick={handleShare}
              className={`p-1.5 rounded-lg border text-xs min-h-[48px] min-w-[48px] transition-colors duration-200 ${shareCopied ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}
            >
              {shareCopied ? <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> : <ShareOutlinedIcon sx={{ fontSize: 18 }} />}
            </IconButton>

            {/* Locale Toggle */}
            <button
              onClick={() => handleLocaleChange(locale === 'IN' ? 'US' : 'IN')}
              className={`px-2 py-1 border rounded-lg text-[10px] font-bold min-h-[48px] px-3 transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              {locale === 'IN' ? '🇮🇳 ₹' : '🇺🇸 $'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-baseline">
          <h2 className={`text-2xl font-black flex items-center transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {locale === 'IN' ? '₹' : '$'}
            {mode === 'goal' ? (
              <CountUp to={calcResults.summary.requiredMonthlyInvestment || 0} duration={0.8} />
            ) : mode === 'swp' ? (
              <CountUp to={calcResults.summary.finalCorpus || 0} duration={0.8} />
            ) : (
              <CountUp to={calcResults.summary.futureValue || 0} duration={0.8} />
            )}
          </h2>
          <span className={`text-[11px] font-semibold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {mode === 'swp' && `Withdrawn: ${formatCompact(calcResults.summary.totalWithdrawn, locale)}`}
            {mode === 'goal' && `Yield: ${activeInputs.rate}% returns`}
            {mode === 'sip' && `Gains: +${formatCompact(calcResults.summary.totalReturns, locale)}`}
            {mode === 'lumpsum' && `Gains: +${formatCompact(calcResults.summary.totalReturns, locale)}`}
          </span>
        </div>
      </div>

      {/* Active Mode Title */}
      <div className="px-4 mt-4">
        <div className={`border rounded-xl px-4 py-3 transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className={`text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full"></span>
            {mode === 'sip' && 'SIP Calculator'}
            {mode === 'lumpsum' && 'Lumpsum Calculator'}
            {mode === 'swp' && 'SWP Calculator'}
            {mode === 'goal' && 'Goal Calculator'}
          </span>
        </div>
      </div>

      {/* 3. DYNAMIC INPUT CARDS (Thumb Friendly Sliders) */}
      <div className="px-4 mt-4 flex flex-col gap-4 flex-grow">
        
        {/* Slider 1: Amount */}
        <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {mode === 'sip' ? 'Monthly Investment' : mode === 'swp' ? 'Initial Capital' : mode === 'goal' ? 'Goal Amount' : 'Lumpsum Amount'}
            </span>
            <div className="relative">
              <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{locale === 'IN' ? '₹' : '$'}</span>
              <input
                type="number"
                inputMode="numeric"
                value={getRawDisplay(mode === 'goal' ? 'target' : 'amount')}
                onChange={(e) => handleRawChange(mode === 'goal' ? 'target' : 'amount', e.target.value)}
                onBlur={() => handleRawBlur(mode === 'goal' ? 'target' : 'amount')}
                onKeyDown={(e) => e.key === 'Enter' && handleRawBlur(mode === 'goal' ? 'target' : 'amount')}
                className={`w-36 border rounded-xl pl-7 pr-2 py-2 text-right text-sm font-bold focus:outline-none transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                    : 'bg-slate-50 border-slate-300 text-emerald-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20'
                }`}
              />
            </div>
          </div>
          <Slider
            min={mode === 'swp' ? 100000 : 1000}
            max={mode === 'swp' ? 50000000 : 5000000}
            step={mode === 'swp' ? 100000 : 5000}
            value={mode === 'goal' ? activeInputs.target : activeInputs.amount}
            onChange={(e, val) => handleInputChange(mode === 'goal' ? 'target' : 'amount', val)}
            sx={{
              color: '#10B981',
              height: 6,
              '& .MuiSlider-thumb': { width: 20, height: 20, backgroundColor: '#10B981', border: '2px solid #fff' },
              '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
            }}
          />
        </div>

        {/* Slider 2: SWP Pay-out Rate */}
        {mode === 'swp' && (
          <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-3">
              <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Monthly Pay-out</span>
              <div className="relative">
                <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{locale === 'IN' ? '₹' : '$'}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={getRawDisplay('withdrawal')}
                  onChange={(e) => handleRawChange('withdrawal', e.target.value)}
                  onBlur={() => handleRawBlur('withdrawal')}
                  onKeyDown={(e) => e.key === 'Enter' && handleRawBlur('withdrawal')}
                  className={`w-36 border rounded-xl pl-7 pr-2 py-2 text-right text-sm font-bold focus:outline-none transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
                      : 'bg-slate-50 border-slate-300 text-cyan-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                  }`}
                />
              </div>
            </div>
            <Slider
              min={5000}
              max={200000}
              step={5000}
              value={activeInputs.withdrawal}
              onChange={(e, val) => handleInputChange('withdrawal', val)}
              sx={{
                color: '#06B6D4',
                height: 6,
                '& .MuiSlider-thumb': { width: 20, height: 20, backgroundColor: '#06B6D4', border: '2px solid #fff' },
                '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
              }}
            />
          </div>
        )}

        {/* Slider 3: Returns Rate (%) */}
        <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Expected Rate (% p.a.)</span>
            <div className="relative">
              <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>%</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={getRawDisplay('rate')}
                onChange={(e) => handleRawChange('rate', e.target.value)}
                onBlur={() => handleRawBlur('rate')}
                onKeyDown={(e) => e.key === 'Enter' && handleRawBlur('rate')}
                className={`w-28 border rounded-xl pl-7 pr-2 py-2 text-right text-sm font-bold focus:outline-none transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
                    : 'bg-slate-50 border-slate-300 text-cyan-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                }`}
              />
            </div>
          </div>
          <Slider
            min={1}
            max={25}
            step={0.5}
            value={activeInputs.rate}
            onChange={(e, val) => handleInputChange('rate', val)}
            sx={{
              color: '#06B6D4',
              height: 6,
              '& .MuiSlider-thumb': { width: 20, height: 20, backgroundColor: '#06B6D4', border: '2px solid #fff' },
              '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
            }}
          />
        </div>

        {/* Slider 4: Time (Years) */}
        <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Duration (Years)</span>
            <div className="relative">
              <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Yr</span>
              <input
                type="number"
                inputMode="numeric"
                value={getRawDisplay('years')}
                onChange={(e) => handleRawChange('years', e.target.value)}
                onBlur={() => handleRawBlur('years')}
                onKeyDown={(e) => e.key === 'Enter' && handleRawBlur('years')}
                className={`w-28 border rounded-xl pl-8 pr-2 py-2 text-right text-sm font-bold focus:outline-none transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
                    : 'bg-slate-50 border-slate-300 text-cyan-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                }`}
              />
            </div>
          </div>
          <Slider
            min={1}
            max={30}
            step={1}
            value={activeInputs.years}
            onChange={(e, val) => handleInputChange('years', val)}
            sx={{
              color: '#06B6D4',
              height: 6,
              '& .MuiSlider-thumb': { width: 20, height: 20, backgroundColor: '#06B6D4', border: '2px solid #fff' },
              '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
            }}
          />
        </div>

        {/* Dynamic Controls Toggles */}
        <div className="flex flex-col gap-3">
          
          {/* Step up toggle for SIP */}
          {mode === 'sip' && (
            <div className={`border p-3 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-55 border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Annual Step-Up Savings</span>
                <Switch
                  checked={activeInputs.isStepUp}
                  onChange={(e) => handleInputChange('isStepUp', e.target.checked)}
                  color="success"
                  size="small"
                />
              </div>
              <Collapse in={activeInputs.isStepUp}>
                <div className="flex flex-col gap-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[11px] transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Step-Up Rate</span>
                    <div className="relative">
                      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>%</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={getRawDisplay('stepUpPercent')}
                        onChange={(e) => handleRawChange('stepUpPercent', e.target.value)}
                        onBlur={() => handleRawBlur('stepUpPercent')}
                        onKeyDown={(e) => e.key === 'Enter' && handleRawBlur('stepUpPercent')}
                        className={`w-24 border rounded-xl pl-7 pr-2 py-1.5 text-right text-sm font-bold focus:outline-none transition-colors duration-200 ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                            : 'bg-slate-50 border-slate-300 text-emerald-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20'
                        }`}
                      />
                    </div>
                  </div>
                  <Slider
                    min={1}
                    max={25}
                    step={1}
                    value={activeInputs.stepUpPercent}
                    onChange={(e, val) => handleInputChange('stepUpPercent', val)}
                    sx={{ 
                      color: '#10B981', 
                      height: 4,
                      '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
                    }}
                  />
                </div>
              </Collapse>
            </div>
          )}

          {/* Inflation Toggle */}
          <div className={`border p-3 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-55 border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Adjust for Inflation</span>
              <Switch
                checked={activeInputs.includeInflation}
                onChange={(e) => handleInputChange('includeInflation', e.target.checked)}
                color="warning"
                size="small"
              />
            </div>
            <Collapse in={activeInputs.includeInflation}>
              <div className="flex flex-col gap-3 pt-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inflation Rate (% p.a.)</span>
                  <div className="relative">
                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>%</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={getRawDisplay('inflation')}
                      onChange={(e) => handleRawChange('inflation', e.target.value)}
                      onBlur={() => handleRawBlur('inflation')}
                      onKeyDown={(e) => e.key === 'Enter' && handleRawBlur('inflation')}
                      className={`w-24 border rounded-xl pl-7 pr-2 py-1.5 text-right text-sm font-bold focus:outline-none transition-colors duration-200 ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-amber-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30'
                          : 'bg-slate-50 border-slate-300 text-amber-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20'
                      }`}
                    />
                  </div>
                </div>
                <Slider
                  min={1}
                  max={12}
                  step={0.5}
                  value={activeInputs.inflation}
                  onChange={(e, val) => handleInputChange('inflation', val)}
                  sx={{ 
                    color: '#F59E0B', 
                    height: 4,
                    '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
                  }}
                />
              </div>
            </Collapse>
          </div>

        </div>

        {/* 4. REAL-TIME MINI CHART */}
        <div className={`border p-3 rounded-xl h-[260px] flex flex-col justify-between mt-2 transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-850' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className={`text-[10px] font-bold uppercase transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>Compounding Trend</span>
          <div className="h-[210px] w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 2, right: 2, left: -25, bottom: 2 }}>
                <defs>
                  <linearGradient id="mobileColorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={8} stroke={isDarkMode ? "#475569" : "#94a3b8"} axisLine={false} tickLine={false} />
                <YAxis fontSize={8} stroke={isDarkMode ? "#475569" : "#94a3b8"} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v, locale)} />
                <Area type="monotone" dataKey={mode === 'swp' ? 'Portfolio' : 'Value'} stroke="#10B981" fillOpacity={1} fill="url(#mobileColorGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal milestone highlights */}
        {calcResults.milestones && calcResults.milestones.length > 0 && (
          <div className={`border p-3 rounded-xl flex gap-2.5 items-start mt-2 transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-emerald-950/20 border-emerald-900/30 text-slate-300' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-850'
          }`}>
            <StarsIcon className={`shrink-0 transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} sx={{ fontSize: 16 }} />
            <div className="text-[11px]">
              Goal Milestone: Crossed <strong className={isDarkMode ? "text-emerald-300" : "text-emerald-700"}>{calcResults.milestones[0].label}</strong> in year <strong className={isDarkMode ? "text-white" : "text-slate-900"}>{calcResults.milestones[0].year}</strong>
            </div>
          </div>
        )}

      </div>

      {/* 5. STICKY BOTTOM BUTTONS DRAWER */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-3 flex gap-2 shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222] border-slate-800/80' : 'bg-white border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]'}`}>
        {/* Slide-Up Bottom Drawer Trigger */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => setDrawerOpen(true)}
          startIcon={<TableViewIcon />}
          sx={{
            minHeight: 48,
            borderRadius: 3,
            bgcolor: isDarkMode ? '#1e293b' : '#f1f5f9',
            color: isDarkMode ? '#fff' : '#1e293b',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #cbd5e1',
            '&:hover': { bgcolor: isDarkMode ? '#334155' : '#e2e8f0' }
          }}
        >
          Growth Table
        </Button>
        {/* WhatsApp Share */}
        <a
          href={generateWhatsAppShare(mode, {
            ...calcResults?.summary,
            monthlyInvestment: mode === 'sip' ? activeInputs?.amount : undefined,
            years: activeInputs?.years || 0,
            initialInvestment: mode === 'swp' ? activeInputs?.amount : undefined,
            monthlyWithdrawal: mode === 'swp' ? activeInputs?.withdrawal : undefined,
            target: mode === 'goal' ? activeInputs?.target : undefined,
            requiredMonthlyInvestment: calcResults?.summary?.requiredMonthlyInvestment || calcResults?.summary?.monthlySIP,
          }, locale)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ minHeight: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, flexShrink: 0, border: '1px solid #16a34a', backgroundColor: '#15803d', color: '#fff' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.999 2C6.476 2 2 6.476 2 12c0 1.874.496 3.63 1.363 5.148L2 22l4.977-1.307A9.946 9.946 0 0 0 12 22c5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10z"/>
          </svg>
        </a>
        {/* Print */}
        <button
          onClick={() => window.print()}
          style={{ minHeight: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, flexShrink: 0, border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 18 }}
        >
          🖨️
        </button>
      </div>

      {/* 6. NATIVE SLIDE-UP BOTTOM SHEET (Drawer) */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '82vh',
            bgcolor: isDarkMode ? '#0a0f1d' : '#ffffff',
            color: isDarkMode ? '#fff' : '#1f2937',
            borderTop: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
            backgroundImage: 'none'
          }
        }}
      >
        {/* Bottom Drawer Content */}
        <div className="flex flex-col h-full max-h-[82vh] pb-6">
          {/* Drawer Drag handle indicator & header */}
          <div className={`p-4 flex justify-between items-center sticky top-0 z-10 border-b transition-colors duration-200 ${isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <TableViewIcon className="text-emerald-400" />
              <Typography variant="subtitle1" fontWeight="bold">Amortization Table</Typography>
            </div>
            
            <div className="flex items-center gap-2">
              <IconButton 
                onClick={handleCSVExport}
                className={`p-2 rounded-lg border transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
              >
                <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton 
                onClick={() => setDrawerOpen(false)}
                className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </div>
          </div>

          <div className="overflow-y-auto px-4 pt-4 flex flex-col gap-6">
            
            {/* Tax implication alert */}
            <div className={`p-3.5 rounded-xl flex gap-2.5 border transition-colors duration-200 ${isDarkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50 border-slate-200'}`}>
              <InfoOutlinedIcon className="text-cyan-400 mt-0.5 shrink-0" sx={{ fontSize: 16 }} />
              <div className="text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Gains Tax highlight</span>
                  <span className={`text-[9px] px-1 rounded border transition-colors duration-200 ${isDarkMode ? 'bg-cyan-950 border-cyan-800 text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-cyan-700'}`}>{taxDetails.rateText}</span>
                </div>
                <p className={`mt-1 transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{taxDetails.explanation}</p>
                <div className={`mt-1.5 transition-colors duration-200 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Est. Tax: <strong>{formatCurrency(taxDetails.estimatedTax, locale)}</strong>
                </div>
              </div>
            </div>

            {/* Structured Table */}
            <div className={`border rounded-xl overflow-hidden transition-colors duration-200 ${isDarkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white shadow-sm'}`}>
              <table className="w-full text-left text-[11px]">
                <thead className={`border-b font-bold transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  <tr>
                    <th className="py-2.5 px-4">Year</th>
                    <th className="py-2.5 px-4">{mode === 'swp' ? 'Withdrawn' : 'Saved'}</th>
                    <th className="py-2.5 px-4">{mode === 'swp' ? 'Balance' : 'Returns'}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-200 ${isDarkMode ? 'divide-slate-850' : 'divide-slate-200'}`}>
                  {calcResults.amortization.map((row, idx) => (
                    <tr key={idx} className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'}`}>
                      <td className={`py-2.5 px-4 font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Year {row.year}</td>
                      {mode === 'swp' ? (
                        <>
                          <td className={`py-2.5 px-4 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{formatCurrency(row.totalWithdrawn, locale)}</td>
                          <td className={`py-2.5 px-4 font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(row.corpus, locale)}</td>
                        </>
                      ) : mode === 'goal' ? (
                        <>
                          <td className={`py-2.5 px-4 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{formatCurrency(row.invested, locale)}</td>
                          <td className={`py-2.5 px-4 font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(row.projected, locale)}</td>
                        </>
                      ) : (
                        <>
                          <td className={`py-2.5 px-4 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{formatCurrency(row.invested, locale)}</td>
                          <td className={`py-2.5 px-4 font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(row.currentValue, locale)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </Drawer>

    </div>
  );
};

export default MobileCalculator;
