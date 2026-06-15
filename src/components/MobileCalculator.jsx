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
  deserializeState
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
  const [locale, setLocale] = useState('IN'); // 'IN' or 'US'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  
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
    navigate(`?${queryString}`, { replace: true });
  }, [mode, activeInputs, navigate]);

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
              onClick={() => setLocale(l => l === 'IN' ? 'US' : 'IN')}
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
        <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-850' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-baseline mb-1">
            <span className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>
              {mode === 'sip' ? 'Monthly Investment' : mode === 'swp' ? 'Initial Capital' : mode === 'goal' ? 'Goal Amount' : 'Lumpsum Amount'}
            </span>
            <span className={`text-xs font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {formatCurrency(mode === 'goal' ? activeInputs.target : activeInputs.amount, locale)}
            </span>
          </div>
          <div className="py-2.5">
            <Slider
              min={mode === 'swp' ? 100000 : 1000}
              max={mode === 'swp' ? 50000000 : 5000000}
              step={mode === 'swp' ? 100000 : 5000}
              value={mode === 'goal' ? activeInputs.target : activeInputs.amount}
              onChange={(e, val) => handleInputChange(mode === 'goal' ? 'target' : 'amount', val)}
              sx={{
                color: '#10B981',
                height: 6,
                '& .MuiSlider-thumb': {
                  width: 20, height: 20, // larger for thumb dragging
                  backgroundColor: '#10B981',
                  border: '2px solid #fff',
                },
                '& .MuiSlider-rail': {
                  opacity: isDarkMode ? 0.1 : 0.2,
                  backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b'
                }
              }}
            />
          </div>
        </div>

        {/* Slider 2: SWP Pay-out Rate */}
        {mode === 'swp' && (
          <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-850' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>Monthly Pay-out</span>
              <span className={`text-xs font-bold transition-colors duration-200 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{formatCurrency(activeInputs.withdrawal, locale)}</span>
            </div>
            <div className="py-2.5">
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
                  '& .MuiSlider-rail': {
                    opacity: isDarkMode ? 0.1 : 0.2,
                    backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b'
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Slider 3: Returns Rate (%) */}
        <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-850' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-baseline mb-1">
            <span className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>Expected Rate (% p.a.)</span>
            <span className={`text-xs font-bold transition-colors duration-200 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{activeInputs.rate}%</span>
          </div>
          <div className="py-2.5">
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
                '& .MuiSlider-rail': {
                  opacity: isDarkMode ? 0.1 : 0.2,
                  backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b'
                }
              }}
            />
          </div>
        </div>

        {/* Slider 4: Time (Years) */}
        <div className={`border p-4 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222]/80 border-slate-850' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between items-baseline mb-1">
            <span className={`text-xs font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>Duration</span>
            <span className={`text-xs font-bold transition-colors duration-200 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{activeInputs.years} Years</span>
          </div>
          <div className="py-2.5">
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
                '& .MuiSlider-rail': {
                  opacity: isDarkMode ? 0.1 : 0.2,
                  backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b'
                }
              }}
            />
          </div>
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
                <div className="flex flex-col gap-2 pt-3">
                  <div className={`flex justify-between text-[11px] transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>Rate (%)</span>
                    <span className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+{activeInputs.stepUpPercent}%</span>
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
                      '& .MuiSlider-rail': {
                        opacity: isDarkMode ? 0.1 : 0.2,
                        backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b'
                      }
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
              <div className="flex flex-col gap-2 pt-3">
                <div className={`flex justify-between text-[11px] transition-colors duration-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>Inflation Rate (% p.a.)</span>
                  <span className="text-amber-550 font-bold">{activeInputs.inflation}%</span>
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
                    '& .MuiSlider-rail': {
                      opacity: isDarkMode ? 0.1 : 0.2,
                      backgroundColor: isDarkMode ? '#cbd5e1' : '#64748b'
                    }
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
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-3 flex gap-3 shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-[#0c1222] border-slate-800/80' : 'bg-white border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]'}`}>
        {/* Slide-Up Bottom Drawer Trigger */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => setDrawerOpen(true)}
          startIcon={<TableViewIcon />}
          sx={{
            minHeight: 52, // touch friendly target size
            borderRadius: 3,
            bgcolor: isDarkMode ? '#1e293b' : '#f1f5f9',
            color: isDarkMode ? '#fff' : '#1e293b',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #cbd5e1',
            '&:hover': { bgcolor: isDarkMode ? '#334155' : '#e2e8f0' }
          }}
        >
          View Growth Table
        </Button>
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
