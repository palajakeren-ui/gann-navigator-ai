/**
 * Risk Management & Position Sizing Module
 * Kelly Criterion, Fixed Fractional, Optimal F, ATR-based sizing
 */

// ==================== TYPE DEFINITIONS ====================

export interface PositionSizeResult {
  shares: number;
  positionValue: number;
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
  percentageOfPortfolio: number;
}

export interface RiskMetrics {
  maxDrawdown: number;
  currentDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  winRate: number;
  profitFactor: number;
  expectedValue: number;
  riskOfRuin: number;
}

export interface TradeRisk {
  symbol: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  shares: number;
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
}

// ==================== POSITION SIZING METHODS ====================

/**
 * Fixed Fractional Position Sizing
 * Risk a fixed percentage of capital per trade
 */
export const calculateFixedFractional = (
  capital: number,
  riskPercent: number,
  entryPrice: number,
  stopLossPrice: number
): PositionSizeResult => {
  const riskPerShare = Math.abs(entryPrice - stopLossPrice);
  const riskAmount = capital * (riskPercent / 100);
  const shares = Math.floor(riskAmount / riskPerShare);
  const positionValue = shares * entryPrice;
  const takeProfitPrice = entryPrice + (entryPrice - stopLossPrice) * 2; // Default 2:1 R:R
  const rewardAmount = shares * Math.abs(takeProfitPrice - entryPrice);

  return {
    shares,
    positionValue,
    riskAmount: shares * riskPerShare,
    rewardAmount,
    riskRewardRatio: rewardAmount / (shares * riskPerShare),
    percentageOfPortfolio: (positionValue / capital) * 100
  };
};

/**
 * Kelly Criterion Position Sizing
 * Optimal bet size based on edge and odds
 */
export const calculateKellyCriterion = (
  capital: number,
  winRate: number, // 0 to 1
  avgWin: number,
  avgLoss: number,
  kellyFraction: number = 0.5 // Half-Kelly is commonly used
): { optimalBetPercent: number; optimalBetAmount: number; fullKelly: number } => {
  const b = avgWin / avgLoss; // Odds ratio
  const p = winRate;
  const q = 1 - winRate;

  // Kelly formula: f* = (bp - q) / b
  const fullKelly = ((b * p) - q) / b;
  const adjustedKelly = Math.max(0, fullKelly * kellyFraction);

  return {
    optimalBetPercent: adjustedKelly * 100,
    optimalBetAmount: capital * adjustedKelly,
    fullKelly: fullKelly * 100
  };
};

/**
 * ATR-Based Position Sizing
 * Size based on market volatility
 */
export const calculateATRPositionSize = (
  capital: number,
  atr: number,
  entryPrice: number,
  atrMultiplier: number = 2,
  riskPercent: number = 2
): PositionSizeResult => {
  const stopDistance = atr * atrMultiplier;
  const stopLossPrice = entryPrice - stopDistance;
  const riskAmount = capital * (riskPercent / 100);
  const shares = Math.floor(riskAmount / stopDistance);
  const positionValue = shares * entryPrice;
  const takeProfitPrice = entryPrice + stopDistance * 2;
  const rewardAmount = shares * (takeProfitPrice - entryPrice);

  return {
    shares,
    positionValue,
    riskAmount: shares * stopDistance,
    rewardAmount,
    riskRewardRatio: 2,
    percentageOfPortfolio: (positionValue / capital) * 100
  };
};

/**
 * Volatility-Adjusted Position Size
 * Normalize position sizes across different volatility assets
 */
export const calculateVolatilityAdjusted = (
  capital: number,
  dailyVolatility: number, // As decimal (e.g., 0.02 for 2%)
  targetVolatility: number = 0.02, // Target 2% daily vol
  maxPositionPercent: number = 20
): { positionPercent: number; positionValue: number } => {
  const rawPositionPercent = (targetVolatility / dailyVolatility) * 100;
  const positionPercent = Math.min(rawPositionPercent, maxPositionPercent);

  return {
    positionPercent,
    positionValue: capital * (positionPercent / 100)
  };
};

// ==================== RISK METRICS ====================

/**
 * Calculate Sharpe Ratio
 */
export const calculateSharpeRatio = (
  returns: number[],
  riskFreeRate: number = 0.02
): number => {
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  );

  if (stdDev === 0) return 0;
  return (avgReturn - riskFreeRate / 252) / stdDev * Math.sqrt(252);
};

/**
 * Calculate Sortino Ratio (downside risk only)
 */
export const calculateSortinoRatio = (
  returns: number[],
  riskFreeRate: number = 0.02
): number => {
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const negativeReturns = returns.filter(r => r < 0);
  
  if (negativeReturns.length === 0) return Infinity;
  
  const downsideDeviation = Math.sqrt(
    negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length
  );

  if (downsideDeviation === 0) return 0;
  return (avgReturn - riskFreeRate / 252) / downsideDeviation * Math.sqrt(252);
};

/**
 * Calculate Maximum Drawdown
 */
export const calculateMaxDrawdown = (equityCurve: number[]): { maxDrawdown: number; peak: number; trough: number } => {
  let peak = equityCurve[0];
  let maxDrawdown = 0;
  let troughValue = equityCurve[0];
  let peakValue = equityCurve[0];

  for (const equity of equityCurve) {
    if (equity > peak) {
      peak = equity;
    }
    const drawdown = (peak - equity) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      troughValue = equity;
      peakValue = peak;
    }
  }

  return {
    maxDrawdown: maxDrawdown * 100,
    peak: peakValue,
    trough: troughValue
  };
};

/**
 * Calculate Risk of Ruin
 */
export const calculateRiskOfRuin = (
  winRate: number,
  riskPerTrade: number, // As percentage
  maxDrawdownAllowed: number = 50 // As percentage
): number => {
  const p = winRate;
  const q = 1 - winRate;
  const n = Math.floor(maxDrawdownAllowed / riskPerTrade);

  if (p >= q) {
    return Math.pow(q / p, n);
  }
  return 1;
};

/**
 * Calculate Profit Factor
 */
export const calculateProfitFactor = (
  wins: number[],
  losses: number[]
): number => {
  const totalWins = wins.reduce((a, b) => a + b, 0);
  const totalLosses = Math.abs(losses.reduce((a, b) => a + b, 0));

  if (totalLosses === 0) return Infinity;
  return totalWins / totalLosses;
};

/**
 * Calculate Expected Value per Trade
 */
export const calculateExpectedValue = (
  winRate: number,
  avgWin: number,
  avgLoss: number
): number => {
  return (winRate * avgWin) - ((1 - winRate) * avgLoss);
};

// ==================== COMPREHENSIVE RISK ANALYSIS ====================

/**
 * Comprehensive Risk Metrics Calculator
 */
export const calculateRiskMetrics = (
  trades: Array<{ pnl: number; entryDate: Date; exitDate: Date }>
): RiskMetrics => {
  if (trades.length === 0) {
    return {
      maxDrawdown: 0,
      currentDrawdown: 0,
      sharpeRatio: 0,
      sortinoRatio: 0,
      calmarRatio: 0,
      winRate: 0,
      profitFactor: 0,
      expectedValue: 0,
      riskOfRuin: 1
    };
  }

  // Separate wins and losses
  const wins = trades.filter(t => t.pnl > 0).map(t => t.pnl);
  const losses = trades.filter(t => t.pnl < 0).map(t => t.pnl);
  const returns = trades.map(t => t.pnl);

  const winRate = wins.length / trades.length;
  const avgWin = wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((a, b) => a + b, 0) / losses.length) : 0;

  // Build equity curve
  let equity = 10000; // Starting capital
  const equityCurve = [equity];
  trades.forEach(t => {
    equity += t.pnl;
    equityCurve.push(equity);
  });

  const { maxDrawdown, peak } = calculateMaxDrawdown(equityCurve);
  const currentDrawdown = ((peak - equity) / peak) * 100;

  const sharpeRatio = calculateSharpeRatio(returns);
  const sortinoRatio = calculateSortinoRatio(returns);
  const profitFactor = calculateProfitFactor(wins, losses);
  const expectedValue = calculateExpectedValue(winRate, avgWin, avgLoss);
  const riskOfRuin = calculateRiskOfRuin(winRate, 2, 50);

  // Calmar Ratio (annualized return / max drawdown)
  const totalReturn = (equity - 10000) / 10000;
  const calmarRatio = maxDrawdown > 0 ? (totalReturn * 100) / maxDrawdown : 0;

  return {
    maxDrawdown,
    currentDrawdown,
    sharpeRatio,
    sortinoRatio,
    calmarRatio,
    winRate: winRate * 100,
    profitFactor,
    expectedValue,
    riskOfRuin: riskOfRuin * 100
  };
};

// ==================== TRADE RISK CALCULATOR ====================

/**
 * Calculate comprehensive trade risk
 */
export const calculateTradeRisk = (
  symbol: string,
  entry: number,
  stopLoss: number,
  takeProfit: number,
  capital: number,
  riskPercent: number = 2
): TradeRisk => {
  const riskPerShare = Math.abs(entry - stopLoss);
  const rewardPerShare = Math.abs(takeProfit - entry);
  const riskAmount = capital * (riskPercent / 100);
  const shares = Math.floor(riskAmount / riskPerShare);
  const actualRisk = shares * riskPerShare;
  const rewardAmount = shares * rewardPerShare;

  return {
    symbol,
    entry,
    stopLoss,
    takeProfit,
    shares,
    riskAmount: actualRisk,
    rewardAmount,
    riskRewardRatio: rewardAmount / actualRisk
  };
};

// ==================== PORTFOLIO RISK ====================

/**
 * Calculate portfolio-level risk metrics
 */
export const calculatePortfolioRisk = (
  positions: Array<{ symbol: string; value: number; volatility: number; correlation: number }>
): { portfolioVolatility: number; diversificationRatio: number; concentrationRisk: number } => {
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
  
  // Weight-adjusted volatility
  let portfolioVariance = 0;
  positions.forEach(p => {
    const weight = p.value / totalValue;
    portfolioVariance += Math.pow(weight * p.volatility, 2);
  });

  // Add correlation effects (simplified)
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const wi = positions[i].value / totalValue;
      const wj = positions[j].value / totalValue;
      portfolioVariance += 2 * wi * wj * positions[i].volatility * positions[j].volatility * 0.5; // Assumed 0.5 correlation
    }
  }

  const portfolioVolatility = Math.sqrt(portfolioVariance);

  // Diversification ratio (weighted avg volatility / portfolio volatility)
  const weightedAvgVol = positions.reduce((sum, p) => 
    sum + (p.value / totalValue) * p.volatility, 0);
  const diversificationRatio = weightedAvgVol / portfolioVolatility;

  // Concentration risk (Herfindahl-Hirschman Index)
  const hhi = positions.reduce((sum, p) => 
    sum + Math.pow(p.value / totalValue, 2), 0);
  const concentrationRisk = hhi * 100;

  return {
    portfolioVolatility: portfolioVolatility * 100,
    diversificationRatio,
    concentrationRisk
  };
};
