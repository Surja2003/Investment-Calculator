import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Cell,
  Legend
} from 'recharts';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Switch,
  Slider,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Collapse
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableViewIcon from '@mui/icons-material/TableView';
import StarsIcon from '@mui/icons-material/Stars';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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
  deserializeState
} from '../utils/calcEngine';
import { updatePageSEO } from '../utils/SEOConfig';
import { CountUp } from './animations';
import { useTheme } from '../hooks/useTheme';

const DesktopCalculator = ({ mode: initialMode = 'sip' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // App states
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
  const [showAmortization, setShowAmortization] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale);
    try {
      localStorage.setItem('inv_calc_global_locale', newLocale);
    } catch (e) {}
  };

  // Form states based on mode
  const [inputs, setInputs] = useState(() => {
    // Attempt to parse query string first
    const urlParams = deserializeState(location.search);
    
    // Default values by mode
    const defaults = {
      sip: { amount: 25000, years: 15, rate: 12, includeInflation: false, inflation: 6, isStepUp: false, stepUpPercent: 10, stepUpFreq: 12 },
      lumpsum: { amount: 500000, years: 15, rate: 12, includeInflation: false, inflation: 6 },
      swp: { amount: 10000000, withdrawal: 50000, years: 15, rate: 8, includeInflation: false, inflation: 6 },
      goal: { target: 10000000, years: 15, rate: 12, includeInflation: false, inflation: 6 }
    };

    // Load from cache if exists
    const cachedSip = loadFromCache('sip', defaults.sip);
    const cachedLump = loadFromCache('lumpsum', defaults.lumpsum);
    const cachedSwp = loadFromCache('swp', defaults.swp);
    const cachedGoal = loadFromCache('goal', defaults.goal);

    // Merge cache, default, and URL params
    return {
      sip: { ...cachedSip, ...urlParams },
      lumpsum: { ...cachedLump, ...urlParams },
      swp: { ...cachedSwp, ...urlParams },
      goal: { ...cachedGoal, ...urlParams }
    };
  });

  const activeInputs = inputs[mode];

  // Sync mode if changed via navigation props
  useEffect(() => {
    if (initialMode && initialMode !== mode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Synchronize SEO Config & Script Injections
  useEffect(() => {
    updatePageSEO(mode, locale);
  }, [mode, locale]);

  // Read URL parameters on load & back navigation
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

  // Synchronize outputs in real-time when inputs change
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

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [field]: value
      }
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  // Tax calculations based on returns
  const taxDetails = useMemo(() => {
    let gains = 0;
    if (mode === 'sip' || mode === 'lumpsum') {
      gains = calcResults.summary.totalReturns || 0;
    } else if (mode === 'swp') {
      // capital gains in swp can be complex, but let's approximate gains as returns in the remaining portfolio
      const totalGrowth = calcResults.summary.finalCorpus + calcResults.summary.totalWithdrawn - calcResults.summary.initialInvestment;
      gains = Math.max(0, totalGrowth);
    } else if (mode === 'goal') {
      gains = calcResults.summary.wealthGained || 0;
    }
    return calculateTaxImplications(gains, locale);
  }, [calcResults, mode, locale]);

  // Export to CSV Helper
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
    link.setAttribute('download', `${mode}_amortization_${locale}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart Formatting Helpers
  const areaData = useMemo(() => {
    return calcResults.amortization.map(row => {
      const yearLabel = `Yr ${row.year}`;
      if (mode === 'swp') {
        return {
          name: yearLabel,
          Withdrawals: row.totalWithdrawn,
          Portfolio: row.corpus
        };
      } else if (mode === 'goal') {
        return {
          name: yearLabel,
          Invested: row.invested,
          Value: row.projected,
          Gains: Math.max(0, row.projected - row.invested)
        };
      } else {
        return {
          name: yearLabel,
          Invested: row.invested,
          Value: row.currentValue,
          Gains: row.returns
        };
      }
    });
  }, [calcResults, mode]);

  const donutData = useMemo(() => {
    if (mode === 'swp') {
      return [
        { name: 'Remaining Portfolio', value: calcResults.summary.finalCorpus, color: '#10B981' },
        { name: 'Total Withdrawals', value: calcResults.summary.totalWithdrawn, color: '#06B6D4' }
      ];
    } else if (mode === 'goal') {
      return [
        { name: 'Required Contributions', value: calcResults.summary.totalInvestment, color: '#06B6D4' },
        { name: 'Estimated Returns', value: calcResults.summary.wealthGained, color: '#10B981' }
      ];
    } else {
      return [
        { name: 'Total Invested', value: calcResults.summary.totalInvested, color: '#06B6D4' },
        { name: 'Estimated Returns', value: calcResults.summary.totalReturns, color: '#10B981' }
      ];
    }
  }, [calcResults, mode]);

  // Responsive chart height
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      className={`font-sans min-h-screen pb-12 transition-colors duration-200 ${isDarkMode ? 'text-slate-100 bg-[#090d16]' : 'text-slate-800 bg-slate-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Panel */}
      <div className={`border-b sticky top-16 z-30 py-4 px-8 flex justify-between items-center transition-colors duration-200 ${isDarkMode ? 'border-slate-800 bg-[#0c1222]/80 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md shadow-sm'}`}>
        <div>
          <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <AccountBalanceWalletIcon className="text-emerald-500" />
            Wealth Compounding Calculator
            <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border transition-colors duration-200 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-650 border-slate-200'}`}>
              Desktop Pro
            </span>
          </h1>
          <p className={`text-xs mt-0.5 transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>High-fidelity investment models optimized for wealth-growth strategies</p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          {/* Locale switcher */}
          <div className={`flex p-0.5 rounded-lg border transition-colors duration-200 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => handleLocaleChange('IN')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${locale === 'IN' ? 'bg-emerald-600 text-white shadow' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🇮🇳 India (Lakh/Cr)
            </button>
            <button
              onClick={() => handleLocaleChange('US')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${locale === 'US' ? 'bg-cyan-600 text-white shadow' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🇺🇸 Global (M/B)
            </button>
          </div>

          {/* Action buttons */}
          <Tooltip title={shareCopied ? "Link Copied!" : "Copy Configuration Link"}>
            <IconButton 
              onClick={handleShare}
              className={`p-2 border rounded-lg transition-all ${shareCopied ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              {shareCopied ? <CheckCircleOutlineIcon fontSize="small" /> : <ShareOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Export Amortization Data as CSV">
            <IconButton 
              onClick={handleCSVExport}
              className={`p-2 border rounded-lg transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              <FileDownloadOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="w-full px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Control Column (Grid span 4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-[90px] flex flex-col gap-6">
          <div className={`border rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-200 ${isDarkMode ? 'bg-[#0c1222]/90 border-slate-800/80 shadow-black/30' : 'bg-white border-slate-200/80 shadow-slate-200/20'}`}>
            {/* Calculator Title Header */}
            <div className={`border-b pb-4 mb-6 transition-colors duration-200 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <h2 className={`text-sm font-bold tracking-wider uppercase flex items-center gap-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                {mode === 'sip' && 'SIP Calculator'}
                {mode === 'lumpsum' && 'Lumpsum Calculator'}
                {mode === 'swp' && 'SWP Calculator'}
                {mode === 'goal' && 'Goal Calculator'}
              </h2>
              <p className={`text-[10px] mt-1 transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {mode === 'sip' && 'Model regular systematic savings over time.'}
                {mode === 'lumpsum' && 'Project the growth of a single bulk deposit.'}
                {mode === 'swp' && 'Schedule systematic regular withdrawals from your corpus.'}
                {mode === 'goal' && 'Find the monthly savings rate needed to hit a goal.'}
              </p>
            </div>

            {/* Inputs Dynamic Form */}
            <div className="flex flex-col gap-5">
              
              {/* Parameter 1: Investment Amount / Principal */}
              {mode !== 'goal' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="amount-slider" className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {mode === 'sip' ? 'Monthly Savings' : mode === 'swp' ? 'Initial Capital' : 'Lumpsum Investment'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="amount-text"
                        value={activeInputs.amount}
                        onChange={(e) => handleInputChange('amount', Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`w-32 border rounded px-2 py-1 text-right text-xs font-semibold focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-emerald-400 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-emerald-600 focus:border-emerald-600'}`}
                      />
                      <span className="absolute left-2 top-1.5 text-[10px] text-slate-500 font-bold">{locale === 'IN' ? '₹' : '$'}</span>
                    </div>
                  </div>
                  <div className="px-1 py-3">
                    <Slider
                      id="amount-slider"
                      min={mode === 'swp' ? 100000 : 1000}
                      max={mode === 'swp' ? 100000000 : 5000000}
                      step={mode === 'swp' ? 100000 : 5000}
                      value={activeInputs.amount}
                      onChange={(e, val) => handleInputChange('amount', val)}
                      sx={{
                        color: '#10B981',
                        height: 5,
                        '& .MuiSlider-thumb': {
                          width: 16, height: 16,
                          backgroundColor: '#10B981',
                          border: '2px solid #fff',
                          '&:hover, &.Mui-focusVisible': { boxShadow: '0px 0px 0px 8px rgba(16, 185, 129, 0.16)' }
                        },
                        '& .MuiSlider-track': { border: 'none' },
                        '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Parameter 1b: Target Amount for Goal Calculator */}
              {mode === 'goal' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="target-slider" className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Target Financial Goal</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="target-text"
                        value={activeInputs.target}
                        onChange={(e) => handleInputChange('target', Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`w-32 border rounded px-2 py-1 text-right text-xs font-semibold focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-emerald-400 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-emerald-600 focus:border-emerald-600'}`}
                      />
                      <span className="absolute left-2 top-1.5 text-[10px] text-slate-500 font-bold">{locale === 'IN' ? '₹' : '$'}</span>
                    </div>
                  </div>
                  <div className="px-1 py-3">
                    <Slider
                      id="target-slider"
                      min={100000}
                      max={100000000}
                      step={100000}
                      value={activeInputs.target}
                      onChange={(e, val) => handleInputChange('target', val)}
                      sx={{
                        color: '#10B981',
                        height: 5,
                        '& .MuiSlider-thumb': {
                          width: 16, height: 16,
                          backgroundColor: '#10B981',
                          border: '2px solid #fff',
                        },
                        '& .MuiSlider-track': { border: 'none' },
                        '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Parameter 2: SWP Monthly Withdrawal */}
              {mode === 'swp' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="withdrawal-slider" className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Monthly Pay-out</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="withdrawal-text"
                        value={activeInputs.withdrawal}
                        onChange={(e) => handleInputChange('withdrawal', Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`w-32 border rounded px-2 py-1 text-right text-xs font-semibold focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-cyan-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-cyan-600 focus:border-cyan-600'}`}
                      />
                      <span className="absolute left-2 top-1.5 text-[10px] text-slate-500 font-bold">{locale === 'IN' ? '₹' : '$'}</span>
                    </div>
                  </div>
                  <div className="px-1 py-3">
                    <Slider
                      id="withdrawal-slider"
                      min={5000}
                      max={500000}
                      step={5000}
                      value={activeInputs.withdrawal}
                      onChange={(e, val) => handleInputChange('withdrawal', val)}
                      sx={{
                        color: '#06B6D4',
                        height: 5,
                        '& .MuiSlider-thumb': {
                          width: 16, height: 16,
                          backgroundColor: '#06B6D4',
                          border: '2px solid #fff',
                        },
                        '& .MuiSlider-track': { border: 'none' },
                        '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Parameter 3: Expected Annual Return Rate (%) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="rate-slider" className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Expected Return Rate (% p.a.)</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="rate-text"
                      step="0.1"
                      value={activeInputs.rate}
                      onChange={(e) => handleInputChange('rate', Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className={`w-20 border rounded px-2 py-1 text-right text-xs font-semibold focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-cyan-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-cyan-600 focus:border-cyan-600'}`}
                    />
                    <span className="absolute left-2 top-1.5 text-[10px] text-slate-500 font-bold">%</span>
                  </div>
                </div>
                <div className="px-1 py-3">
                  <Slider
                    id="rate-slider"
                    min={1}
                    max={25}
                    step={0.5}
                    value={activeInputs.rate}
                    onChange={(e, val) => handleInputChange('rate', val)}
                    sx={{
                      color: '#06B6D4',
                      height: 5,
                      '& .MuiSlider-thumb': {
                        width: 16, height: 16,
                        backgroundColor: '#06B6D4',
                        border: '2px solid #fff',
                      },
                      '& .MuiSlider-track': { border: 'none' },
                      '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
                    }}
                  />
                </div>
              </div>

              {/* Parameter 4: Time Period (Years) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="years-slider" className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Investment Duration</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="years-text"
                      value={activeInputs.years}
                      onChange={(e) => handleInputChange('years', Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                      className={`w-20 border rounded px-2 py-1 text-right text-xs font-semibold focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-cyan-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-cyan-600 focus:border-cyan-600'}`}
                    />
                    <span className="absolute left-2 top-1.5 text-[10px] text-slate-500 font-bold">Yrs</span>
                  </div>
                </div>
                <div className="px-1 py-3">
                  <Slider
                    id="years-slider"
                    min={1}
                    max={40}
                    step={1}
                    value={activeInputs.years}
                    onChange={(e, val) => handleInputChange('years', val)}
                    sx={{
                      color: '#06B6D4',
                      height: 5,
                      '& .MuiSlider-thumb': {
                        width: 16, height: 16,
                        backgroundColor: '#06B6D4',
                        border: '2px solid #fff',
                      },
                      '& .MuiSlider-track': { border: 'none' },
                      '& .MuiSlider-rail': { opacity: isDarkMode ? 0.1 : 0.2, backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b' }
                    }}
                  />
                </div>
              </div>

              {/* Optional Step-Up (SIP Only) */}
              {mode === 'sip' && (
                <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-200 ${isDarkMode ? 'bg-slate-950/50 border-slate-850' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Annual Step-Up Contribution</span>
                      <Tooltip title="Increases your monthly savings dynamically to outpace wage stagnation">
                        <InfoOutlinedIcon className="text-slate-500 hover:text-slate-400 cursor-help" sx={{ fontSize: 14 }} />
                      </Tooltip>
                    </div>
                    <Switch
                      checked={activeInputs.isStepUp}
                      onChange={(e) => handleInputChange('isStepUp', e.target.checked)}
                      color="success"
                      size="small"
                    />
                  </div>

                  <Collapse in={activeInputs.isStepUp}>
                    <div className="flex flex-col gap-3 pt-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Step-Up Rate (%)</span>
                        <input
                          type="number"
                          value={activeInputs.stepUpPercent}
                          onChange={(e) => handleInputChange('stepUpPercent', Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                          className={`w-16 border rounded px-2 py-0.5 text-right text-xs transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-white border-slate-300 text-emerald-600'}`}
                        />
                      </div>
                      <Slider
                        min={1}
                        max={30}
                        step={1}
                        value={activeInputs.stepUpPercent}
                        onChange={(e, val) => handleInputChange('stepUpPercent', val)}
                        sx={{ color: '#10B981', height: 4 }}
                      />

                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Step-Up Frequency</span>
                        <div className={`flex p-0.5 rounded border transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <button
                            onClick={() => handleInputChange('stepUpFreq', 12)}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${activeInputs.stepUpFreq === 12 ? (isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800') : 'text-slate-500'}`}
                          >
                            Yearly
                          </button>
                          <button
                            onClick={() => handleInputChange('stepUpFreq', 6)}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${activeInputs.stepUpFreq === 6 ? (isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800') : 'text-slate-500'}`}
                          >
                            6-Month
                          </button>
                        </div>
                      </div>
                    </div>
                  </Collapse>
                </div>
              )}

              {/* Inflation Adjustment */}
              <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-200 ${isDarkMode ? 'bg-slate-950/50 border-slate-850' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Adjust for Real Purchasing Power</span>
                    <Tooltip title="Decreases future returns estimate to represent real purchasing power based on inflation.">
                      <InfoOutlinedIcon className="text-slate-500 hover:text-slate-400 cursor-help" sx={{ fontSize: 14 }} />
                    </Tooltip>
                  </div>
                  <Switch
                    checked={activeInputs.includeInflation}
                    onChange={(e) => handleInputChange('includeInflation', e.target.checked)}
                    color="warning"
                    size="small"
                  />
                </div>

                <Collapse in={activeInputs.includeInflation}>
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inflation Rate (% p.a.)</span>
                      <input
                        type="number"
                        value={activeInputs.inflation}
                        onChange={(e) => handleInputChange('inflation', Math.min(20, Math.max(1, parseFloat(e.target.value) || 1)))}
                        className={`w-16 border rounded px-2 py-0.5 text-right text-xs transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-500' : 'bg-white border-slate-300 text-amber-600'}`}
                      />
                    </div>
                    <Slider
                      min={1}
                      max={15}
                      step={0.5}
                      value={activeInputs.inflation}
                      onChange={(e, val) => handleInputChange('inflation', val)}
                      sx={{ color: '#F59E0B', height: 4 }}
                    />
                  </div>
                </Collapse>
              </div>

            </div>
          </div>
        </div>

        {/* Right Dashboard Workspace (Grid span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Top Level Summary Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${mode}-${locale}-${activeInputs.includeInflation}`}
          >
            {/* Card 1: Main Accumulation / Target Output */}
            <motion.div 
              variants={cardVariants} 
              className={`border rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-[#0c1222]/90 border-slate-800 hover:border-emerald-500/30 shadow-black/10' 
                  : 'bg-white border-slate-200 hover:border-emerald-500/40 shadow-slate-200/10'
              }`}
            >
              <div className="absolute right-4 top-4 text-emerald-500/20 group-hover:text-emerald-500/30 transition-all">
                <ShowChartIcon fontSize="large" />
              </div>
              <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {mode === 'swp' ? 'Final Corpus remaining' : mode === 'goal' ? 'Required Monthly SIP' : 'Expected Maturity Value'}
              </span>
              <h3 className={`text-2xl font-black mt-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {mode === 'goal' ? (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp 
                      to={calcResults.summary.requiredMonthlyInvestment || 0} 
                      duration={1.2}
                      formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} 
                    />
                  </>
                ) : mode === 'swp' ? (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp 
                      to={calcResults.summary.finalCorpus || 0} 
                      duration={1.2}
                      formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} 
                    />
                  </>
                ) : (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp 
                      to={calcResults.summary.futureValue || 0} 
                      duration={1.2}
                      formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} 
                    />
                  </>
                )}
              </h3>
              <p className={`text-[10px] mt-2 transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {mode === 'goal' && `To hit your goal in ${activeInputs.years} yrs`}
                {mode === 'swp' && `Withdrawn: ${formatCurrency(calcResults.summary.totalWithdrawn, locale)}`}
                {mode === 'sip' && `Invested Capital: ${formatCurrency(calcResults.summary.totalInvested, locale)}`}
                {mode === 'lumpsum' && `Invested Capital: ${formatCurrency(calcResults.summary.totalInvested, locale)}`}
              </p>
            </motion.div>

            {/* Card 2: Total Investment */}
            <motion.div 
              variants={cardVariants} 
              className={`border rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-[#0c1222]/90 border-slate-800 hover:border-cyan-500/30 shadow-black/10' 
                  : 'bg-white border-slate-200 hover:border-cyan-500/40 shadow-slate-200/10'
              }`}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {mode === 'swp' ? 'Initial Capital Invested' : mode === 'goal' ? 'Total Capital Invested' : 'Principal Saved'}
              </span>
              <h3 className={`text-2xl font-black mt-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {mode === 'swp' ? (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp to={calcResults.summary.initialInvestment || 0} duration={1.2} formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} />
                  </>
                ) : mode === 'goal' ? (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp to={calcResults.summary.totalInvestment || 0} duration={1.2} formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} />
                  </>
                ) : (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp to={calcResults.summary.totalInvested || 0} duration={1.2} formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} />
                  </>
                )}
              </h3>
              <p className={`text-[10px] mt-2 transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {mode === 'swp' && `Withdrawn: ${activeInputs.years * 12} monthly iterations`}
                {mode === 'goal' && `Target goal value: ${formatCurrency(activeInputs.target, locale)}`}
                {mode !== 'swp' && mode !== 'goal' && `Excludes return compounding`}
              </p>
            </motion.div>

            {/* Card 3: Wealth Gained */}
            <motion.div 
              variants={cardVariants} 
              className={`border rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-[#0c1222]/90 border-slate-800 hover:border-teal-500/30 shadow-black/10' 
                  : 'bg-white border-slate-200 hover:border-teal-500/40 shadow-slate-200/10'
              }`}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {mode === 'swp' ? 'Net portfolio returns' : mode === 'goal' ? 'Interest Accrued' : 'Compounded Returns'}
              </span>
              <h3 className={`text-2xl font-black mt-2 transition-colors duration-200 ${isDarkMode ? 'text-emerald-450' : 'text-emerald-600'}`}>
                {mode === 'swp' ? (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp to={Math.max(0, calcResults.summary.finalCorpus + calcResults.summary.totalWithdrawn - calcResults.summary.initialInvestment)} duration={1.2} formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} />
                  </>
                ) : mode === 'goal' ? (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp to={calcResults.summary.wealthGained || 0} duration={1.2} formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} />
                  </>
                ) : (
                  <>
                    {locale === 'IN' ? '₹' : '$'}
                    <CountUp to={calcResults.summary.totalReturns || 0} duration={1.2} formatter={(v) => Math.round(v).toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US')} />
                  </>
                )}
              </h3>
              <p className={`text-[10px] font-semibold mt-2 transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {mode === 'goal' ? (
                  `+${calcResults.summary.returnPercentage}% growth yield`
                ) : mode === 'swp' ? (
                  `Yield tracking: ${activeInputs.rate}% returns`
                ) : (
                  `+${calcResults.summary.totalInvested > 0 ? ((calcResults.summary.totalReturns / calcResults.summary.totalInvested) * 100).toFixed(1) : '0.0'}% capital returns`
                )}
              </p>
            </motion.div>
          </motion.div>

          {/* Persistent Data Visualizations (Area & Pie charts side-by-side) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            
            {/* Glowing Area Chart (Width span 2) */}
            <div className={`xl:col-span-2 border rounded-2xl p-5 shadow-xl flex flex-col transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-[#0c1222]/90 border-slate-800/80 shadow-black/10' 
                : 'bg-white border-slate-200 shadow-slate-200/20'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-xs font-semibold tracking-wide uppercase transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Compounding Path Timeline</span>
                <span className={`text-[10px] transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Values adjusted compounding annually</span>
              </div>
              
              <div className="h-[280px] w-full flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke={isDarkMode ? "#475569" : "#94a3b8"} 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#475569" : "#94a3b8"} 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(v) => formatCompact(v, locale)}
                    />
                    <ChartTooltip 
                      contentStyle={{ 
                        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                        borderColor: isDarkMode ? '#334155' : '#e2e8f0', 
                        borderRadius: 8 
                      }}
                      labelStyle={{ color: isDarkMode ? '#fff' : '#1e293b', fontSize: 11, fontWeight: 'bold' }}
                      itemStyle={{ fontSize: 11, color: isDarkMode ? '#cbd5e1' : '#475569' }}
                      formatter={(value) => [formatCurrency(value, locale), undefined]}
                    />
                    {mode === 'swp' ? (
                      <>
                        <Area type="monotone" dataKey="Portfolio" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPortfolio)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="Withdrawals" stroke="#06b6d4" fillOpacity={1} fill="url(#colorInvested)" strokeWidth={1.5} />
                      </>
                    ) : mode === 'goal' ? (
                      <>
                        <Area type="monotone" dataKey="Value" stroke="#10B981" fillOpacity={1} fill="url(#colorReturns)" strokeWidth={2.5} name="Total Target Value" />
                        <Area type="monotone" dataKey="Invested" stroke="#06b6d4" fillOpacity={1} fill="url(#colorInvested)" strokeWidth={1.5} name="Required Investments" />
                      </>
                    ) : (
                      <>
                        <Area type="monotone" dataKey="Value" stroke="#10B981" fillOpacity={1} fill="url(#colorReturns)" strokeWidth={2.5} name="Total Growth" />
                        <Area type="monotone" dataKey="Invested" stroke="#06b6d4" fillOpacity={1} fill="url(#colorInvested)" strokeWidth={1.5} name="Principal Invested" />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Asset Allocation Donut Chart (Width span 1) */}
            <div className={`xl:col-span-1 border rounded-2xl p-5 shadow-xl flex flex-col justify-between items-center text-center transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-[#0c1222]/90 border-slate-800 shadow-black/10' 
                : 'bg-white border-slate-200 shadow-slate-200/20'
            }`}>
              <div className="w-full text-left">
                <span className={`text-xs font-semibold tracking-wide uppercase transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Portfolio Split</span>
              </div>

              <div className="h-[180px] w-full mt-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      formatter={(v) => formatCurrency(v, locale)}
                      contentStyle={{ 
                        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                        borderColor: isDarkMode ? '#334155' : '#e2e8f0', 
                        borderRadius: 6 
                      }}
                      itemStyle={{ color: isDarkMode ? '#cbd5e1' : '#475569', fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="w-full flex flex-col gap-2 mt-4 text-xs">
                {donutData.map((d, index) => (
                  <div key={index} className={`flex justify-between items-center border-t pt-1.5 transition-colors duration-200 ${isDarkMode ? 'border-slate-800/40' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className={`text-[11px] transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{d.name}</span>
                    </div>
                    <span className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {calcResults.summary.totalInvested > 0 || calcResults.summary.finalCorpus > 0
                        ? `${((d.value / (donutData[0].value + donutData[1].value)) * 100).toFixed(0)}%`
                        : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Goal-Based Milestones Alert */}
          {calcResults.milestones && calcResults.milestones.length > 0 && (
            <motion.div 
              className={`border p-4 rounded-xl flex items-start gap-3 transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-emerald-950/20 border-emerald-900/40' 
                  : 'bg-emerald-50 border-emerald-200'
              }`}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <StarsIcon className={`mt-0.5 shrink-0 transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <div>
                <h4 className={`text-xs font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Goal Milestones Achieved</h4>
                <div className={`flex flex-wrap gap-x-6 gap-y-2 mt-1.5 text-xs transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {calcResults.milestones.map((m, idx) => (
                    <span key={idx}>
                      🚀 Crossed <strong className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>{m.label}</strong> in Year <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{m.year}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Dynamic Localized Tax implications Highlight */}
          <div className={`border p-4 rounded-xl flex gap-3 transition-colors duration-200 ${
            isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <InfoOutlinedIcon className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Estimated Capital Gains Tax Implication ({locale === 'IN' ? 'India' : 'International'})</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300' 
                    : 'bg-cyan-50 border-cyan-200 text-cyan-750'
                }`}>{taxDetails.rateText}</span>
              </div>
              <p className={`mt-1 transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{taxDetails.explanation}</p>
              <div className={`mt-2 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Estimated Tax: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{formatCurrency(taxDetails.estimatedTax, locale)}</strong> (Exemptions computed: {taxDetails.exemptionText})
              </div>
            </div>
          </div>

          {/* Year-by-Year Growth Amortization Table */}
          <div className={`border rounded-2xl shadow-xl overflow-hidden transition-colors duration-200 ${
            isDarkMode ? 'bg-[#0c1222]/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className={`w-full px-6 py-4 flex justify-between items-center text-xs font-semibold border-b transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-white border-slate-800 hover:bg-slate-900/40' 
                  : 'text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <TableViewIcon className="text-cyan-400" />
                Year-by-Year Growth Table
              </span>
              <span className="text-cyan-400">{showAmortization ? 'Hide Table ▴' : 'Show Table ▾'}</span>
            </button>

            <Collapse in={showAmortization}>
              <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className={`sticky top-0 font-bold border-b transition-colors duration-200 ${
                    isDarkMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    <tr>
                      <th className="py-3 px-6">Year</th>
                      {mode === 'swp' ? (
                        <>
                          <th className="py-3 px-6">Initial Principal</th>
                          <th className="py-3 px-6">Total Withdrawn</th>
                          <th className="py-3 px-6">Remaining Corpus</th>
                        </>
                      ) : mode === 'goal' ? (
                        <>
                          <th className="py-3 px-6">Capital Saved</th>
                          <th className="py-3 px-6">Gains Compounded</th>
                          <th className="py-3 px-6">Maturity Value</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3 px-6">Principal Invested</th>
                          <th className="py-3 px-6">Estimated Returns</th>
                          <th className="py-3 px-6">Maturity Balance</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className={`divide-y transition-colors duration-200 ${isDarkMode ? 'divide-slate-850 bg-slate-900/10' : 'divide-slate-200 bg-slate-50/20'}`}>
                    {calcResults.amortization.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`transition-all ${
                          isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-100'
                        } ${idx === 0 ? (isDarkMode ? 'opacity-60 bg-slate-950/20' : 'opacity-60 bg-slate-200/40') : ''}`}
                      >
                        <td className={`py-3 px-6 font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Year {row.year}</td>
                        {mode === 'swp' ? (
                          <>
                            <td className={`py-3 px-6 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>{formatCurrency(row.initialInvestment, locale)}</td>
                            <td className={`py-3 px-6 font-medium transition-colors duration-200 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{formatCurrency(row.totalWithdrawn, locale)}</td>
                            <td className={`py-3 px-6 font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(row.corpus, locale)}</td>
                          </>
                        ) : mode === 'goal' ? (
                          <>
                            <td className={`py-3 px-6 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>{formatCurrency(row.invested, locale)}</td>
                            <td className={`py-3 px-6 font-medium transition-colors duration-200 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{formatCurrency(Math.max(0, row.projected - row.invested), locale)}</td>
                            <td className={`py-3 px-6 font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(row.projected, locale)}</td>
                          </>
                        ) : (
                          <>
                            <td className={`py-3 px-6 transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>{formatCurrency(row.invested, locale)}</td>
                            <td className={`py-3 px-6 font-medium transition-colors duration-200 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{formatCurrency(row.returns, locale)}</td>
                            <td className={`py-3 px-6 font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(row.currentValue, locale)}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Collapse>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default DesktopCalculator;
