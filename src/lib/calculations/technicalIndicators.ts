/**
 * Technical Indicators Calculation Engine
 * Common trading indicators with optimized calculations
 */

export interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Calculate Simple Moving Average (SMA)
 */
export const calculateSMA = (prices: number[], period: number): number[] => {
  const sma: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
      continue;
    }
    
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  
  return sma;
};

/**
 * Calculate Exponential Moving Average (EMA)
 */
export const calculateEMA = (prices: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  const firstSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(firstSMA);
  
  for (let i = period; i < prices.length; i++) {
    const currentEMA = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(currentEMA);
  }
  
  return ema;
};

/**
 * Calculate Relative Strength Index (RSI)
 */
export const calculateRSI = (prices: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const changes: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  for (let i = 0; i < changes.length; i++) {
    if (i < period - 1) {
      rsi.push(NaN);
      continue;
    }
    
    const recentChanges = changes.slice(i - period + 1, i + 1);
    const gains = recentChanges.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
    const losses = Math.abs(recentChanges.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;
    
    const rs = gains / (losses || 1);
    const rsiValue = 100 - (100 / (1 + rs));
    rsi.push(rsiValue);
  }
  
  return rsi;
};

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export const calculateMACD = (prices: number[]): { macd: number[]; signal: number[]; histogram: number[] } => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  const macd = ema12.map((val, i) => val - ema26[i]);
  const signal = calculateEMA(macd.filter(v => !isNaN(v)), 9);
  
  const histogram = macd.map((val, i) => {
    if (i < signal.length) {
      return val - signal[i];
    }
    return NaN;
  });
  
  return { macd, signal, histogram };
};

/**
 * Calculate Bollinger Bands
 */
export const calculateBollingerBands = (
  prices: number[], 
  period: number = 20, 
  stdDev: number = 2
): { upper: number[]; middle: number[]; lower: number[] } => {
  const sma = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }
    
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = sma[i];
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    
    upper.push(mean + stdDev * std);
    lower.push(mean - stdDev * std);
  }
  
  return { upper, middle: sma, lower };
};

/**
 * Calculate Average True Range (ATR)
 */
export const calculateATR = (data: OHLC[], period: number = 14): number[] => {
  const atr: number[] = [];
  const trueRanges: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      trueRanges.push(data[i].high - data[i].low);
      continue;
    }
    
    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );
    trueRanges.push(tr);
  }
  
  for (let i = 0; i < trueRanges.length; i++) {
    if (i < period - 1) {
      atr.push(NaN);
      continue;
    }
    
    const avgTR = trueRanges.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    atr.push(avgTR);
  }
  
  return atr;
};

/**
 * Calculate Stochastic Oscillator
 */
export const calculateStochastic = (
  data: OHLC[], 
  kPeriod: number = 14, 
  dPeriod: number = 3
): { k: number[]; d: number[] } => {
  const k: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      k.push(NaN);
      continue;
    }
    
    const slice = data.slice(i - kPeriod + 1, i + 1);
    const highestHigh = Math.max(...slice.map(d => d.high));
    const lowestLow = Math.min(...slice.map(d => d.low));
    
    const kValue = ((data[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;
    k.push(kValue);
  }
  
  const d = calculateSMA(k.filter(v => !isNaN(v)), dPeriod);
  
  return { k, d };
};

/**
 * Detect chart patterns
 */
export const detectPatterns = (prices: number[]): Array<{ pattern: string; confidence: number; description: string }> => {
  const patterns: Array<{ pattern: string; confidence: number; description: string }> = [];
  const windowSize = 5;
  
  for (let i = windowSize; i < prices.length; i++) {
    const window = prices.slice(i - windowSize, i);
    
    // Head and Shoulders
    if (window[1] < window[2] && window[2] > window[3] && window[3] < window[4]) {
      patterns.push({
        pattern: "Head and Shoulders",
        confidence: 75,
        description: "Bearish reversal pattern detected",
      });
    }
    
    // Double Top
    if (window[1] < window[2] && Math.abs(window[2] - window[4]) < window[2] * 0.02) {
      patterns.push({
        pattern: "Double Top",
        confidence: 70,
        description: "Potential reversal to downside",
      });
    }
    
    // Ascending Triangle
    const isAscending = window.every((val, idx) => idx === 0 || val >= window[idx - 1]);
    if (isAscending) {
      patterns.push({
        pattern: "Ascending Triangle",
        confidence: 65,
        description: "Bullish continuation pattern",
      });
    }
  }
  
  return patterns;
};
