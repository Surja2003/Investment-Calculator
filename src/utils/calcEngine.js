/**
 * Centralized Math & State Caching Engine for the Premium Investment Calculator
 * Handles SIP, Lumpsum, SWP, and Goal calculations, tax highlights, caching, and serialization.
 */

// --- 1. LOCALIZATION & CURRENCY FORMATTERS ---

/**
 * Formats a number into a locale-specific currency string (INR or USD).
 * @param {number} value - The numeric value to format
 * @param {string} locale - 'IN' or 'US'
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value, locale = 'IN') => {
  const isINR = locale === 'IN';
  return new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: isINR ? 'INR' : 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formats a number in a compact layout (Lakhs/Crores for India, Millions/Billions for US).
 * @param {number} value - The numeric value to format
 * @param {string} locale - 'IN' or 'US'
 * @returns {string} Formatted compact string
 */
export const formatCompact = (value, locale = 'IN') => {
  const isINR = locale === 'IN';
  if (isINR) {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${new Intl.NumberFormat('en-IN').format(value)}`;
    }
  } else {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${new Intl.NumberFormat('en-US').format(value)}`;
    }
  }
};

// --- 2. TAX IMPLICATION CALCULATOR ---

/**
 * Estimates capital gains tax implications based on locale.
 * @param {number} gains - Total accumulated capital gains
 * @param {string} locale - 'IN' or 'US'
 * @returns {Object} Tax details containing estimated tax and explanation
 */
export const calculateTaxImplications = (gains, locale = 'IN') => {
  if (locale === 'IN') {
    // Indian LTCG for Equity Mutual Funds: 12.5% tax on gains exceeding ₹1.25 Lakhs per year.
    // Assuming this is a long-term holding.
    const exemption = 125000;
    const taxableGains = Math.max(0, gains - exemption);
    const estimatedTax = taxableGains * 0.125;
    
    return {
      estimatedTax: Math.round(estimatedTax),
      rateText: '12.5% (LTCG)',
      exemptionText: '₹1.25 Lakh annual exemption applies',
      taxableAmount: taxableGains,
      explanation: `Long Term Capital Gains (LTCG) tax is estimated at 12.5% for equity-oriented mutual funds on gains exceeding ₹1.25 Lakhs. Under current rules, gains up to ₹1.25L are tax-free.`
    };
  } else {
    // US / Global long term capital gains tax general estimate: 15% flat rate
    const estimatedTax = gains * 0.15;
    return {
      estimatedTax: Math.round(estimatedTax),
      rateText: '15% (Est. LTCG)',
      exemptionText: 'Based on US federal tax brackets',
      taxableAmount: gains,
      explanation: `Capital gains tax is estimated at 15% based on typical long-term capital gains tax brackets for individual filers. Actual tax brackets range from 0% to 20% depending on income.`
    };
  }
};

// --- 3. MILESTONE GENERATION ---

/**
 * Finds milestones crossed in a wealth growth projection.
 * @param {Array} amortizationData - Year-by-year growth details
 * @param {string} locale - 'IN' or 'US'
 * @returns {Array} List of milestones crossed
 */
export const calculateMilestones = (amortizationData, locale = 'IN') => {
  const milestones = [];
  const isINR = locale === 'IN';
  
  // Define milestones based on locale
  const targetMilestones = isINR 
    ? [
        { limit: 1000000, label: '₹10 Lakhs (Millionaire)' },
        { limit: 5000000, label: '₹50 Lakhs (Half Crore)' },
        { limit: 10000000, label: '₹1 Crore (10 Million)' },
        { limit: 50000000, label: '₹5 Crores (50 Million)' },
        { limit: 100000000, label: '₹10 Crores (100 Million)' },
      ]
    : [
        { limit: 100000, label: '$100k milestone' },
        { limit: 250000, label: '$250k milestone' },
        { limit: 500000, label: '$500k milestone' },
        { limit: 1000000, label: '$1 Million' },
        { limit: 5000000, label: '$5 Million' },
      ];
      
  const achieved = new Set();
  
  amortizationData.forEach((point) => {
    const value = point.currentValue || point.projected || point.corpus || 0;
    const yearMatch = typeof point.year === 'string' ? parseInt(point.year.replace(/\D/g, ''), 10) : point.year;
    
    targetMilestones.forEach((m) => {
      if (value >= m.limit && !achieved.has(m.limit)) {
        achieved.add(m.limit);
        milestones.push({
          label: m.label,
          year: yearMatch,
          value: value
        });
      }
    });
  });
  
  return milestones;
};

// --- 4. CORE MATH CALCULATORS ---

/**
 * Calculate future value of SIP investments (supports Step-Up and Inflation)
 */
export const calculateSIP = (monthlyInvestment, annualRate, years, options = {}) => {
  const {
    includeInflation = false,
    inflation = 6,
    isStepUpSIP = false,
    stepUpPercentage = 10,
    stepUpFrequency = 12 // 12 for yearly, 6 for half-yearly
  } = options;

  const nominalRate = annualRate / 100;
  const inflationRate = includeInflation ? (inflation / 100) : 0;
  
  // Real interest rate compounding
  const realAnnualRate = (1 + nominalRate) / (1 + inflationRate) - 1;
  const monthlyRate = realAnnualRate / 12;
  const stepUpRate = stepUpPercentage / 100;
  
  const amortization = [];
  let investedAmount = 0;
  let currentValue = 0;
  let monthlyAmount = monthlyInvestment;

  // Year 0 starting point
  amortization.push({
    year: 0,
    invested: 0,
    returns: 0,
    currentValue: 0
  });

  for (let year = 1; year <= years; year++) {
    let yearlyInvestment = 0;
    let prevMonthValue = currentValue;

    for (let month = 1; month <= 12; month++) {
      // Apply Step-Up if enabled
      if (isStepUpSIP && year > 1 && month === 1) {
        // Yearly frequency is standard, or 6-monthly
        // Apply at the start of each year (or half-year if frequency is 6)
        monthlyAmount = Math.round(monthlyAmount * (1 + stepUpRate));
      }
      
      // Additional half-year frequency check
      if (isStepUpSIP && stepUpFrequency === 6 && year > 1 && month === 7) {
        monthlyAmount = Math.round(monthlyAmount * (1 + stepUpRate));
      }

      yearlyInvestment += monthlyAmount;
      // Formula: growing annuity compounded monthly (due at start of month)
      prevMonthValue = (prevMonthValue + monthlyAmount) * (1 + monthlyRate);
    }

    investedAmount += yearlyInvestment;
    currentValue = prevMonthValue;

    amortization.push({
      year: year,
      invested: Math.round(investedAmount),
      returns: Math.round(Math.max(0, currentValue - investedAmount)),
      currentValue: Math.round(currentValue)
    });
  }

  const finalPoint = amortization[amortization.length - 1];
  const summary = {
    totalInvested: finalPoint.invested,
    totalReturns: finalPoint.returns,
    futureValue: finalPoint.currentValue
  };

  return {
    summary,
    amortization,
    milestones: calculateMilestones(amortization, options.locale || 'IN')
  };
};

/**
 * Calculate future value of Lumpsum investment
 */
export const calculateLumpsum = (principal, annualRate, years, options = {}) => {
  const {
    includeInflation = false,
    inflation = 6
  } = options;

  const nominalRate = annualRate / 100;
  const inflationRate = includeInflation ? (inflation / 100) : 0;
  
  const realAnnualRate = (1 + nominalRate) / (1 + inflationRate) - 1;
  const monthlyRate = realAnnualRate / 12;

  const amortization = [];
  
  // Year 0
  amortization.push({
    year: 0,
    invested: principal,
    returns: 0,
    currentValue: principal
  });

  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    const currentValue = principal * Math.pow(1 + monthlyRate, months);
    
    amortization.push({
      year: year,
      invested: principal,
      returns: Math.round(Math.max(0, currentValue - principal)),
      currentValue: Math.round(currentValue)
    });
  }

  const finalPoint = amortization[amortization.length - 1];
  const summary = {
    totalInvested: finalPoint.invested,
    totalReturns: finalPoint.returns,
    futureValue: finalPoint.currentValue
  };

  return {
    summary,
    amortization,
    milestones: calculateMilestones(amortization, options.locale || 'IN')
  };
};

/**
 * Calculate Systematic Withdrawal Plan (SWP)
 */
export const calculateSWP = (principal, monthlyWithdrawal, annualRate, years, options = {}) => {
  const {
    includeInflation = false,
    inflation = 6
  } = options;

  const nominalRate = annualRate / 100;
  const inflationRate = includeInflation ? (inflation / 100) : 0;
  
  const realAnnualRate = (1 + nominalRate) / (1 + inflationRate) - 1;
  const monthlyRate = realAnnualRate / 12;

  const amortization = [];
  let remainingCorpus = principal;
  let totalWithdrawn = 0;
  
  // Year 0
  amortization.push({
    year: 0,
    initialInvestment: principal,
    totalWithdrawn: 0,
    corpus: principal,
    currentValue: principal // key uniformity
  });

  for (let year = 1; year <= years; year++) {
    let yearWithdrawal = 0;
    
    for (let month = 1; month <= 12; month++) {
      if (remainingCorpus > 0) {
        // SWP Subtracts withdrawal at start of month
        const actualWithdrawal = Math.min(remainingCorpus, monthlyWithdrawal);
        remainingCorpus -= actualWithdrawal;
        yearWithdrawal += actualWithdrawal;
        
        // Apply growth on remainder
        remainingCorpus = remainingCorpus * (1 + monthlyRate);
      } else {
        remainingCorpus = 0;
      }
    }
    
    totalWithdrawn += yearWithdrawal;

    amortization.push({
      year: year,
      initialInvestment: principal,
      totalWithdrawn: Math.round(totalWithdrawn),
      corpus: Math.round(remainingCorpus),
      currentValue: Math.round(remainingCorpus) // key uniformity for charting
    });
  }

  const finalPoint = amortization[amortization.length - 1];
  const summary = {
    initialInvestment: principal,
    totalWithdrawn: finalPoint.totalWithdrawn,
    finalCorpus: finalPoint.corpus
  };

  return {
    summary,
    amortization,
    milestones: calculateMilestones(amortization, options.locale || 'IN')
  };
};

/**
 * Calculate Goal based required SIP
 */
export const calculateGoal = (targetAmount, years, expectedReturn, options = {}) => {
  const {
    includeInflation = false,
    inflation = 6
  } = options;

  const nominalRate = expectedReturn / 100;
  const inflationRate = includeInflation ? (inflation / 100) : 0;
  
  // Adjust target upwards for inflation
  const inflationAdjustedTarget = includeInflation 
    ? targetAmount * Math.pow(1 + inflationRate, years)
    : targetAmount;

  // Real return rate
  const realAnnualRate = (1 + nominalRate) / (1 + inflationRate) - 1;
  const monthlyRate = realAnnualRate / 12;
  const totalMonths = years * 12;

  let requiredMonthlyInvestment = 0;
  
  if (Math.abs(monthlyRate) < 0.00001) {
    requiredMonthlyInvestment = inflationAdjustedTarget / totalMonths;
  } else {
    // PMT formula adjusted for annuity due: PMT = FV * r / (((1 + r)^n - 1) * (1 + r))
    const numerator = inflationAdjustedTarget * monthlyRate;
    const denominator = (Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate);
    requiredMonthlyInvestment = numerator / denominator;
  }

  // Generate Year-by-Year Amortization
  const amortization = [];
  let currentValue = 0;
  let totalInvestment = 0;

  // Year 0
  amortization.push({
    year: 0,
    invested: 0,
    projected: 0,
    currentValue: 0
  });

  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    totalInvestment = requiredMonthlyInvestment * months;

    if (Math.abs(monthlyRate) < 0.00001) {
      currentValue = totalInvestment;
    } else {
      currentValue = requiredMonthlyInvestment * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
        (1 + monthlyRate);
    }

    amortization.push({
      year: year,
      invested: Math.round(totalInvestment),
      projected: Math.round(currentValue),
      currentValue: Math.round(currentValue) // for milestone check
    });
  }

  const finalPoint = amortization[amortization.length - 1];
  const totalInvested = finalPoint.invested;
  const wealthGained = Math.max(0, finalPoint.projected - totalInvested);
  const returnPercentage = totalInvested > 0 ? (wealthGained / totalInvested) * 100 : 0;

  const summary = {
    requiredMonthlyInvestment: Math.round(requiredMonthlyInvestment),
    totalInvestment: Math.round(totalInvested),
    wealthGained: Math.round(wealthGained),
    returnPercentage: parseFloat(returnPercentage.toFixed(2)),
    inflationAdjustedTarget: Math.round(inflationAdjustedTarget)
  };

  return {
    summary,
    amortization,
    milestones: calculateMilestones(amortization, options.locale || 'IN')
  };
};

// --- 5. LOCAL STORAGE CACHE HELPERS ---

/**
 * Saves input settings to LocalStorage.
 */
export const saveToCache = (key, state) => {
  try {
    localStorage.setItem(`inv_calc_${key}`, JSON.stringify({
      ...state,
      _savedAt: Date.now()
    }));
  } catch (e) {
    console.error('LocalStorage save failed', e);
  }
};

/**
 * Loads input settings from LocalStorage.
 */
export const loadFromCache = (key, defaultState) => {
  try {
    const item = localStorage.getItem(`inv_calc_${key}`);
    return item ? JSON.parse(item) : defaultState;
  } catch (e) {
    console.error('LocalStorage load failed', e);
    return defaultState;
  }
};

// --- 6. URL PARAMETER STATE SHARING ---

/**
 * Converts state variables to query string.
 */
export const serializeState = (state) => {
  const params = new URLSearchParams();
  Object.keys(state).forEach((key) => {
    if (state[key] !== undefined && state[key] !== null && state[key] !== '' && key !== '_timestamp' && key !== '_savedAt') {
      params.set(key, state[key]);
    }
  });
  return params.toString();
};

/**
 * Parses query string into a state object.
 */
export const deserializeState = (queryString) => {
  const params = new URLSearchParams(queryString);
  const state = {};
  params.forEach((value, key) => {
    // Determine conversion based on value properties
    if (value === 'true') {
      state[key] = true;
    } else if (value === 'false') {
      state[key] = false;
    } else if (!isNaN(value) && value !== '') {
      state[key] = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
    } else {
      state[key] = value;
    }
  });
  return state;
};
