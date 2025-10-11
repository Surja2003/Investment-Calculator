/**
 * Calculator Utilities
 * 
 * Shared functions and constants for SIP, Lumpsum, and SWP calculators
 */

// Scenario definitions
export const SCENARIOS = {
  conservative: {
    name: 'Conservative',
    return: 8,
  },
  moderate: {
    name: 'Moderate',
    return: 12,
  },
  aggressive: {
    name: 'Aggressive',
    return: 15,
  },
};

/**
 * Format currency in Indian format (e.g. ₹1,00,000)
 * 
 * @param {number} value - The value to format
 * @param {boolean} showCurrency - Whether to show the currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, showCurrency = true) => {
  if (isNaN(value) || value === null || value === undefined) {
    return showCurrency ? '₹0' : '0';
  }

  try {
    return new Intl.NumberFormat('en-IN', {
      style: showCurrency ? 'currency' : 'decimal',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return showCurrency ? '₹0' : '0';
  }
};

/**
 * Calculate future value of lumpsum investment
 * 
 * @param {number} principal - Initial investment amount
 * @param {number} ratePerAnnum - Annual interest rate (in percentage, e.g. 12 for 12%)
 * @param {number} years - Investment duration in years
 * @param {boolean} includeInflation - Whether to adjust for inflation
 * @param {number} inflationRate - Annual inflation rate (in percentage)
 * @returns {number} Future value
 */
export const calculateLumpsumFutureValue = (
  principal, 
  ratePerAnnum, 
  years, 
  includeInflation = false,
  inflationRate = 6
) => {
  // Object-style API support
  if (typeof principal === 'object' && principal !== null) {
    const { investment = 0, years = 0, returnRate = 0, inflation = 6, adjustForInflation = false } = principal;
    const fv = calculateLumpsumFutureValue(investment, returnRate, years, adjustForInflation, inflation);
    return {
      futureValue: fv,
      investment: Math.round(Number(investment) || 0),
      wealthGained: Math.round(fv - (Number(investment) || 0)),
      returnPercentage: (Number(investment) || 0) > 0 ? ((fv - Number(investment)) / Number(investment)) * 100 : 0,
    };
  }
  // Ensure all parameters are valid numbers
  principal = Number(principal) || 0;
  ratePerAnnum = Number(ratePerAnnum) || 0;
  years = Number(years) || 0;
  inflationRate = Number(inflationRate) || 0;

  // Calculate effective rate after inflation adjustment
  let effectiveRate = ratePerAnnum / 100;
  if (includeInflation) {
    effectiveRate = ((1 + ratePerAnnum / 100) / (1 + inflationRate / 100)) - 1;
  }

  // Monthly compounding: convert to monthly rate and compound over months
  const monthlyRate = effectiveRate / 12;
  const totalMonths = years * 12;
  const futureValue = principal * Math.pow(1 + monthlyRate, totalMonths);
  
  return Math.round(futureValue);
};

/**
 * Calculate future value of SIP investment
 * 
 * @param {number} monthlyInvestment - Monthly investment amount
 * @param {number} ratePerAnnum - Annual interest rate (in percentage, e.g. 12 for 12%)
 * @param {number} years - Investment duration in years
 * @param {boolean} includeInflation - Whether to adjust for inflation
 * @param {number} inflationRate - Annual inflation rate (in percentage)
 * @param {boolean} isStepUpSIP - Whether it's a step-up SIP
 * @param {number} stepUpPercentage - Annual step-up percentage
 * @param {number} stepUpFrequency - Step-up frequency in months (usually 12 for annual step-up)
 * @returns {Object} Results object with futureValue, totalInvestment, and gains
 */
export const calculateSIPFutureValue = (
  monthlyInvestment,
  ratePerAnnum,
  years,
  includeInflation = false,
  inflationRate = 6,
  isStepUpSIP = false,
  stepUpPercentage = 10,
  stepUpFrequency = 12
) => {
  // Object-style API support
  if (typeof monthlyInvestment === 'object' && monthlyInvestment !== null) {
    const {
      monthlyInvestment: mi = 0,
      years: y = 0,
      returnRate: rr = 0,
      inflation: infl = 6,
      adjustForInflation: adj = false,
      isStepUp: isStep = false,
      stepUpRate: stepRate = 10,
      stepUpFrequency: stepFreq = 12,
    } = monthlyInvestment;
    const result = calculateSIPFutureValue(mi, rr, y, adj, infl, isStep, stepRate, stepFreq);
    const wealthGained = result.futureValue - result.totalInvestment;
    const returnPercentage = result.totalInvestment > 0 ? (wealthGained / result.totalInvestment) * 100 : 0;
    return {
      futureValue: result.futureValue,
      totalInvestment: result.totalInvestment,
      wealthGained: Math.round(wealthGained),
      gains: Math.round(wealthGained),
      returnPercentage,
    };
  }
  // Ensure all parameters are valid numbers
  monthlyInvestment = Number(monthlyInvestment) || 0;
  ratePerAnnum = Number(ratePerAnnum) || 0;
  years = Number(years) || 0;
  inflationRate = Number(inflationRate) || 0;
  stepUpPercentage = Number(stepUpPercentage) || 0;
  stepUpFrequency = Number(stepUpFrequency) || 12;

  // Calculate effective rate after inflation adjustment
  let effectiveRate = ratePerAnnum;
  if (includeInflation) {
    effectiveRate = ((1 + ratePerAnnum / 100) / (1 + inflationRate / 100) - 1) * 100;
  }

  const monthlyRate = effectiveRate / (12 * 100);
  const totalMonths = years * 12;
  
  let futureValue = 0;
  let totalInvestment = 0;
  let currentMonthlyAmount = monthlyInvestment;

  // Calculate month by month
  for (let month = 1; month <= totalMonths; month++) {
    // Apply step-up at specified frequency
    if (isStepUpSIP && month > 1 && month % stepUpFrequency === 1) {
      currentMonthlyAmount = currentMonthlyAmount * (1 + stepUpPercentage / 100);
    }
    
    // Add this month's investment
    totalInvestment += currentMonthlyAmount;
    
    // Apply interest to the current balance plus this month's investment
    futureValue = (futureValue + currentMonthlyAmount) * (1 + monthlyRate);
  }

  const fv = Math.round(futureValue);
  const ti = Math.round(totalInvestment);
  const gains = Math.round(fv - ti);
  const returnPercentage = ti > 0 ? (gains / ti) * 100 : 0;
  return {
    futureValue: fv,
    totalInvestment: ti,
    gains,
    wealthGained: gains,
    returnPercentage,
  };
};

/**
 * Calculate monthly withdrawal amount for SWP
 * 
 * @param {number} corpusAmount - Initial corpus amount
 * @param {number} ratePerAnnum - Annual interest rate (in percentage, e.g. 12 for 12%)
 * @param {number} years - Withdrawal duration in years
 * @param {boolean} includeInflation - Whether to adjust for inflation
 * @param {number} inflationRate - Annual inflation rate (in percentage)
 * @returns {number} Monthly withdrawal amount
 */
export const calculateSWPMonthlyWithdrawal = (
  corpusAmount,
  ratePerAnnum,
  years,
  includeInflation = false,
  inflationRate = 6
) => {
  // Ensure all parameters are valid numbers
  corpusAmount = Number(corpusAmount) || 0;
  ratePerAnnum = Number(ratePerAnnum) || 0;
  years = Number(years) || 0;
  inflationRate = Number(inflationRate) || 0;

  // Calculate effective rate after inflation adjustment
  let effectiveRate = ratePerAnnum;
  if (includeInflation) {
    effectiveRate = ((1 + ratePerAnnum / 100) / (1 + inflationRate / 100) - 1) * 100;
  }

  const monthlyRate = effectiveRate / (12 * 100);
  const totalMonths = years * 12;
  
  // Calculate monthly withdrawal amount using PMT formula
  // PMT = (PV * r) / (1 - (1 + r)^-n)
  // where PV = present value, r = rate per period, n = number of periods
  
  if (monthlyRate === 0) {
    // Simple division if no interest
    return Math.round(corpusAmount / totalMonths);
  }
  
  const monthlyWithdrawal = 
    (corpusAmount * monthlyRate) / 
    (1 - Math.pow(1 + monthlyRate, -totalMonths));
  
  return Math.round(monthlyWithdrawal);
};

/**
 * Generate chart data for investment growth
 * 
 * @param {string} calculatorType - Type of calculator ('sip', 'lumpsum', or 'swp')
 * @param {number} amount - Monthly investment (SIP), initial investment (Lumpsum), or corpus (SWP)
 * @param {number} ratePerAnnum - Annual interest rate (in percentage)
 * @param {number} years - Duration in years
 * @param {boolean} includeInflation - Whether to adjust for inflation
 * @param {number} inflationRate - Annual inflation rate (in percentage)
 * @param {boolean} isStepUpSIP - Whether it's a step-up SIP (only for 'sip' type)
 * @param {number} stepUpPercentage - Annual step-up percentage (only for 'sip' type)
 * @param {number} stepUpFrequency - Step-up frequency in months (only for 'sip' type)
 * @returns {Array} Chart data array
 */
export const generateChartData = (
  calculatorType,
  amount,
  ratePerAnnum,
  years,
  includeInflation = false,
  inflationRate = 6,
  isStepUpSIP = false,
  stepUpPercentage = 10,
  stepUpFrequency = 12
) => {
  // Ensure all parameters are valid numbers
  amount = Number(amount) || 0;
  ratePerAnnum = Number(ratePerAnnum) || 0;
  years = Number(years) || 0;
  inflationRate = Number(inflationRate) || 0;
  
  // Calculate effective rate after inflation adjustment
  let effectiveRate = ratePerAnnum;
  if (includeInflation) {
    effectiveRate = ((1 + ratePerAnnum / 100) / (1 + inflationRate / 100) - 1) * 100;
  }
  
  const monthlyRate = effectiveRate / (12 * 100);
  const totalMonths = years * 12;
  
  const chartData = [];
  let currentValue = calculatorType === 'lumpsum' ? amount : 0;
  let totalInvestment = calculatorType === 'lumpsum' ? amount : 0;
  let currentMonthlyAmount = calculatorType === 'swp' ? 
    calculateSWPMonthlyWithdrawal(amount, ratePerAnnum, years, includeInflation, inflationRate) : 
    amount;
  
  // Add initial data point
  chartData.push({
    year: `Year 0`,
    month: 0,
    Invested: totalInvestment,
    'Current Value': currentValue,
  });
  
  // Calculate month by month
  for (let month = 1; month <= totalMonths; month++) {
    // Apply step-up at specified frequency for SIP
    if (calculatorType === 'sip' && isStepUpSIP && month > 1 && month % stepUpFrequency === 1) {
      currentMonthlyAmount = currentMonthlyAmount * (1 + stepUpPercentage / 100);
    }
    
    // Update values based on calculator type
    if (calculatorType === 'sip') {
      // For SIP, add monthly investment and apply interest
      totalInvestment += currentMonthlyAmount;
      currentValue = (currentValue + currentMonthlyAmount) * (1 + monthlyRate);
    } else if (calculatorType === 'lumpsum') {
      // For Lumpsum, just apply interest
      currentValue = currentValue * (1 + monthlyRate);
    } else if (calculatorType === 'swp') {
      // For SWP, subtract monthly withdrawal and apply interest
      currentValue = (currentValue - currentMonthlyAmount) * (1 + monthlyRate);
      totalInvestment -= currentMonthlyAmount;
    }
    
    // Add data point at yearly intervals
    if (month % 12 === 0) {
      chartData.push({
        year: `Year ${month / 12}`,
        month: month,
        Invested: Math.round(totalInvestment),
        'Current Value': Math.round(currentValue),
      });
    }
  }
  
  return chartData;
};

/**
 * Calculate the required SIP amount to reach a target amount
 * 
 * @param {number} targetAmount - Target amount to reach
 * @param {number} ratePerAnnum - Annual interest rate (in percentage)
 * @param {number} years - Investment duration in years
 * @param {boolean} includeInflation - Whether to adjust for inflation
 * @param {number} inflationRate - Annual inflation rate (in percentage)
 * @returns {number} Required monthly SIP amount
 */
export const calculateRequiredSIP = (
  targetAmount,
  ratePerAnnum,
  years,
  includeInflation = false,
  inflationRate = 6
) => {
  // Object-style API support
  if (typeof targetAmount === 'object' && targetAmount !== null) {
    const { targetAmount: ta = 0, years: y = 0, returnRate: rr = 0, inflation = 6, adjustForInflation = false } = targetAmount;
    const inflationAdjustedTarget = adjustForInflation ? (Number(ta) || 0) * Math.pow(1 + (Number(inflation) || 0) / 100, Number(y) || 0) : (Number(ta) || 0);
    const requiredMonthlyInvestment = calculateRequiredSIP(inflationAdjustedTarget, rr, y, false, inflation);
    const totalInvestment = requiredMonthlyInvestment * (Number(y) || 0) * 12;
    const wealthGained = inflationAdjustedTarget - totalInvestment;
    const returnPercentage = totalInvestment > 0 ? (wealthGained / totalInvestment) * 100 : 0;
    return {
      requiredMonthlyInvestment: Math.round(requiredMonthlyInvestment),
      totalInvestment: Math.round(totalInvestment),
      wealthGained: Math.round(wealthGained),
      returnPercentage,
      inflationAdjustedTarget: Math.round(inflationAdjustedTarget),
      originalTarget: Math.round(Number(ta) || 0),
    };
  }
  // Ensure all parameters are valid numbers
  targetAmount = Number(targetAmount) || 0;
  ratePerAnnum = Number(ratePerAnnum) || 0;
  years = Number(years) || 0;
  inflationRate = Number(inflationRate) || 0;

  // Calculate effective rate after inflation adjustment
  let effectiveRate = ratePerAnnum;
  if (includeInflation) {
    effectiveRate = ((1 + ratePerAnnum / 100) / (1 + inflationRate / 100) - 1) * 100;
  }

  const monthlyRate = effectiveRate / (12 * 100);
  const totalMonths = years * 12;
  
  // Calculate using SIP formula: A = P * (((1 + r)^n - 1) / r) * (1 + r)
  // where A = target amount, P = monthly investment, r = monthly rate, n = number of months
  // Solving for P: P = A / ((((1 + r)^n - 1) / r) * (1 + r))
  
  if (monthlyRate === 0) {
    // Simple division if no interest
    return Math.round(targetAmount / totalMonths);
  }
  
  const denominator = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const monthlyInvestment = targetAmount / denominator;
  
  return Math.round(monthlyInvestment);
};

/**
 * Calculate SWP summary parameters for a given corpus and monthly withdrawal rate.
 * Returns initial and final monthly withdrawal, total withdrawn, remaining corpus and percentages.
 *
 * @param {Object} opts
 * @param {number} opts.corpus - Initial corpus amount
 * @param {number} opts.withdrawalRate - Monthly withdrawal rate as percent (e.g., 0.5 for 0.5% per month)
 * @param {number} opts.returnRate - Annual return rate percent
 * @param {number} opts.years - Duration in years
 * @param {number} [opts.inflation=0] - Annual inflation rate percent
 * @param {boolean} [opts.adjustForInflation=false] - Whether to index withdrawals to inflation
 */
export const calculateSWPParameters = ({
  corpus,
  withdrawalRate,
  returnRate,
  years,
  inflation = 0,
  adjustForInflation = false,
} = {}) => {
  let initialCorpus = Number(corpus) || 0;
  const months = (Number(years) || 0) * 12;
  const monthlyReturn = (Number(returnRate) || 0) / 100 / 12;
  const monthlyInflation = (Number(inflation) || 0) / 100 / 12;
  let monthlyWithdrawal = initialCorpus * ((Number(withdrawalRate) || 0) / 100);
  const initialMonthlyWithdrawal = Math.round(monthlyWithdrawal);

  let currentCorpus = initialCorpus;
  let totalWithdrawal = 0;

  for (let m = 1; m <= months; m++) {
    // Withdraw first, then apply monthly return
    const withdraw = Math.min(monthlyWithdrawal, currentCorpus);
    currentCorpus -= withdraw;
    totalWithdrawal += withdraw;

    // Apply growth on remaining corpus
    currentCorpus = currentCorpus * (1 + monthlyReturn);
    
    // Index withdrawals to inflation if requested
    if (adjustForInflation) {
      monthlyWithdrawal = monthlyWithdrawal * (1 + monthlyInflation);
    }

    if (currentCorpus <= 0) {
      currentCorpus = 0;
      break;
    }
  }

  const remainingCorpus = Math.round(currentCorpus);
  const finalMonthlyWithdrawal = Math.round(monthlyWithdrawal);
  const withdrawalPercentage = initialCorpus > 0 ? (totalWithdrawal / initialCorpus) * 100 : 0;
  const remainingCorpusPercentage = initialCorpus > 0 ? (remainingCorpus / initialCorpus) * 100 : 0;

  return {
    initialMonthlyWithdrawal,
    finalMonthlyWithdrawal,
    totalWithdrawal: Math.round(totalWithdrawal),
    remainingCorpus,
    withdrawalPercentage,
    remainingCorpusPercentage,
  };
};