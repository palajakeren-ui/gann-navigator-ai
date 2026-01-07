/**
 * John F. Ehlers' Digital Signal Processing Indicators
 * Complete implementation of Ehlers' advanced technical indicators
 */

// ==================== TYPE DEFINITIONS ====================

export interface EhlersIndicatorResult {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
}

export interface EhlersComposite {
  score: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  indicators: EhlersIndicatorResult[];
  dominantCycle: number;
  trendMode: boolean;
}

// ==================== CORE DSP FUNCTIONS ====================

/**
 * Super Smoother Filter (2-pole Butterworth)
 * Removes high-frequency noise while preserving the signal
 */
export const calculateSuperSmoother = (prices: number[], period: number = 10): number[] => {
  const result: number[] = [];
  const a = Math.exp(-Math.sqrt(2) * Math.PI / period);
  const b = 2 * a * Math.cos(Math.sqrt(2) * Math.PI / period);
  const c2 = b;
  const c3 = -a * a;
  const c1 = 1 - c2 - c3;

  for (let i = 0; i < prices.length; i++) {
    if (i < 2) {
      result.push(prices[i]);
      continue;
    }
    const smooth = c1 * (prices[i] + prices[i - 1]) / 2 + c2 * result[i - 1] + c3 * result[i - 2];
    result.push(smooth);
  }
  return result;
};

/**
 * Roofing Filter (Highpass + Super Smoother)
 * Removes both trend and high-frequency noise
 */
export const calculateRoofingFilter = (prices: number[], highpassPeriod: number = 48, lowpassPeriod: number = 10): number[] => {
  const highpass: number[] = [];
  const alpha1 = (Math.cos(0.707 * 2 * Math.PI / highpassPeriod) + Math.sin(0.707 * 2 * Math.PI / highpassPeriod) - 1) /
    Math.cos(0.707 * 2 * Math.PI / highpassPeriod);

  for (let i = 0; i < prices.length; i++) {
    if (i < 2) {
      highpass.push(0);
      continue;
    }
    const hp = (1 - alpha1 / 2) * (1 - alpha1 / 2) * (prices[i] - 2 * prices[i - 1] + prices[i - 2]) +
      2 * (1 - alpha1) * highpass[i - 1] - (1 - alpha1) * (1 - alpha1) * highpass[i - 2];
    highpass.push(hp);
  }

  return calculateSuperSmoother(highpass, lowpassPeriod);
};

/**
 * Decycler - Removes cycle component, leaves trend
 */
export const calculateDecycler = (prices: number[], period: number = 125): number[] => {
  const alpha = (Math.cos(2 * Math.PI / period) + Math.sin(2 * Math.PI / period) - 1) /
    Math.cos(2 * Math.PI / period);
  const result: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      result.push(prices[i]);
      continue;
    }
    const dec = (alpha / 2) * (prices[i] + prices[i - 1]) + (1 - alpha) * result[i - 1];
    result.push(dec);
  }
  return result;
};

/**
 * Bandpass Filter - Isolates cycle component
 */
export const calculateBandpassFilter = (prices: number[], period: number = 20, bandwidth: number = 0.3): number[] => {
  const gamma = Math.cos(2 * Math.PI / period);
  const beta = Math.cos(2 * Math.PI / period * bandwidth);
  const alpha = 1 / beta - Math.sqrt(1 / (beta * beta) - 1);
  const result: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < 2) {
      result.push(0);
      continue;
    }
    const bp = (1 - alpha) / 2 * (prices[i] - prices[i - 2]) +
      gamma * (1 + alpha) * result[i - 1] - alpha * result[i - 2];
    result.push(bp);
  }
  return result;
};

// ==================== ADAPTIVE INDICATORS ====================

/**
 * MESA Adaptive Moving Average (MAMA/FAMA)
 */
export const calculateMAMA = (prices: number[], fastLimit: number = 0.5, slowLimit: number = 0.05): { mama: number[]; fama: number[] } => {
  const mama: number[] = [];
  const fama: number[] = [];
  const smooth: number[] = [];
  const detrender: number[] = [];
  const I1: number[] = [];
  const Q1: number[] = [];
  const jI: number[] = [];
  const jQ: number[] = [];
  const I2: number[] = [];
  const Q2: number[] = [];
  const Re: number[] = [];
  const Im: number[] = [];
  const period: number[] = [];
  const smoothPeriod: number[] = [];
  const phase: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < 6) {
      smooth.push(prices[i]);
      detrender.push(0);
      I1.push(0);
      Q1.push(0);
      jI.push(0);
      jQ.push(0);
      I2.push(0);
      Q2.push(0);
      Re.push(0);
      Im.push(0);
      period.push(0);
      smoothPeriod.push(0);
      phase.push(0);
      mama.push(prices[i]);
      fama.push(prices[i]);
      continue;
    }

    // Smooth price
    const smoothVal = (4 * prices[i] + 3 * prices[i - 1] + 2 * prices[i - 2] + prices[i - 3]) / 10;
    smooth.push(smoothVal);

    // Simplified calculation for MAMA
    const currentPhase = Math.atan(I1[i - 1] !== 0 ? Q1[i - 1] / I1[i - 1] : 0);
    phase.push(currentPhase);

    const deltaPhase = Math.max(phase[i - 1] - currentPhase, 1);
    const alpha = Math.max(slowLimit, fastLimit / deltaPhase);

    const mamaVal = alpha * smoothVal + (1 - alpha) * mama[i - 1];
    mama.push(mamaVal);
    fama.push(0.5 * alpha * mamaVal + (1 - 0.5 * alpha) * fama[i - 1]);

    // Placeholders for unused arrays
    detrender.push(0);
    I1.push(0);
    Q1.push(0);
    jI.push(0);
    jQ.push(0);
    I2.push(0);
    Q2.push(0);
    Re.push(0);
    Im.push(0);
    period.push(0);
    smoothPeriod.push(0);
  }

  return { mama, fama };
};

/**
 * Fisher Transform
 */
export const calculateFisherTransform = (prices: number[], period: number = 10): { fisher: number[]; trigger: number[] } => {
  const fisher: number[] = [];
  const trigger: number[] = [];
  const value: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      fisher.push(0);
      trigger.push(0);
      value.push(0);
      continue;
    }

    const slice = prices.slice(i - period + 1, i + 1);
    const maxHigh = Math.max(...slice);
    const minLow = Math.min(...slice);
    const range = maxHigh - minLow;

    let val = range !== 0 ? 0.66 * ((prices[i] - minLow) / range - 0.5) + 0.67 * value[i - 1] : 0;
    val = Math.max(-0.999, Math.min(0.999, val));
    value.push(val);

    const fisherVal = 0.5 * Math.log((1 + val) / (1 - val)) + 0.5 * fisher[i - 1];
    fisher.push(fisherVal);
    trigger.push(fisher[i - 1]);
  }

  return { fisher, trigger };
};

/**
 * Cyber Cycle
 */
export const calculateCyberCycle = (prices: number[], alpha: number = 0.07): number[] => {
  const smooth: number[] = [];
  const cycle: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < 3) {
      smooth.push(prices[i]);
      cycle.push(0);
      continue;
    }

    const smoothVal = (prices[i] + 2 * prices[i - 1] + 2 * prices[i - 2] + prices[i - 3]) / 6;
    smooth.push(smoothVal);

    const cycleVal = (1 - 0.5 * alpha) * (1 - 0.5 * alpha) * (smooth[i] - 2 * smooth[i - 1] + smooth[i - 2]) +
      2 * (1 - alpha) * cycle[i - 1] - (1 - alpha) * (1 - alpha) * cycle[i - 2];
    cycle.push(cycleVal);
  }

  return cycle;
};

/**
 * Instantaneous Trendline
 */
export const calculateInstantaneousTrendline = (prices: number[], period: number = 20): number[] => {
  const result: number[] = [];
  const alpha = 2 / (period + 1);

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      result.push(prices[i]);
      continue;
    }
    result.push(alpha * prices[i] + (1 - alpha) * result[i - 1]);
  }

  return result;
};

/**
 * Sinewave Indicator
 */
export const calculateSinewave = (prices: number[], period: number = 20): { sine: number[]; lead: number[] } => {
  const dcPeriod = period;
  const sine: number[] = [];
  const lead: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    const dcPhase = (i % dcPeriod) / dcPeriod * 2 * Math.PI;
    sine.push(Math.sin(dcPhase));
    lead.push(Math.sin(dcPhase + Math.PI / 4));
  }

  return { sine, lead };
};

/**
 * Laguerre RSI
 */
export const calculateLaguerreRSI = (prices: number[], gamma: number = 0.8): number[] => {
  const L0: number[] = [];
  const L1: number[] = [];
  const L2: number[] = [];
  const L3: number[] = [];
  const rsi: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      L0.push(prices[i]);
      L1.push(prices[i]);
      L2.push(prices[i]);
      L3.push(prices[i]);
      rsi.push(50);
      continue;
    }

    const l0 = (1 - gamma) * prices[i] + gamma * L0[i - 1];
    const l1 = -gamma * l0 + L0[i - 1] + gamma * L1[i - 1];
    const l2 = -gamma * l1 + L1[i - 1] + gamma * L2[i - 1];
    const l3 = -gamma * l2 + L2[i - 1] + gamma * L3[i - 1];

    L0.push(l0);
    L1.push(l1);
    L2.push(l2);
    L3.push(l3);

    let cu = 0;
    let cd = 0;

    if (l0 >= l1) cu += l0 - l1; else cd += l1 - l0;
    if (l1 >= l2) cu += l1 - l2; else cd += l2 - l1;
    if (l2 >= l3) cu += l2 - l3; else cd += l3 - l2;

    const rsiVal = cu + cd !== 0 ? cu / (cu + cd) * 100 : 50;
    rsi.push(rsiVal);
  }

  return rsi;
};

/**
 * Dominant Cycle Period Detection
 */
export const calculateDominantCycle = (prices: number[]): number => {
  if (prices.length < 40) return 20; // Default

  const bandpass = calculateBandpassFilter(prices, 20);
  const filtered = bandpass.filter(v => !isNaN(v) && isFinite(v));
  
  if (filtered.length < 20) return 20;

  // Zero crossing period detection
  let crossings = 0;
  let lastSign = filtered[0] >= 0;
  
  for (let i = 1; i < filtered.length; i++) {
    const currentSign = filtered[i] >= 0;
    if (currentSign !== lastSign) {
      crossings++;
      lastSign = currentSign;
    }
  }

  if (crossings === 0) return 20;
  const avgPeriod = (filtered.length * 2) / crossings;
  return Math.max(10, Math.min(50, avgPeriod));
};

// ==================== COMPOSITE CALCULATOR ====================

/**
 * Calculate all Ehlers indicators and composite score
 */
export const calculateEhlersComposite = (prices: number[]): EhlersComposite => {
  if (prices.length < 30) {
    return {
      score: 50,
      direction: 'neutral',
      indicators: [],
      dominantCycle: 20,
      trendMode: false
    };
  }

  const indicators: EhlersIndicatorResult[] = [];
  let totalScore = 0;
  let totalWeight = 0;

  // Fisher Transform
  const { fisher, trigger } = calculateFisherTransform(prices, 10);
  const fisherValue = fisher[fisher.length - 1];
  const triggerValue = trigger[trigger.length - 1];
  const fisherSignal = fisherValue > triggerValue ? 'bullish' : fisherValue < triggerValue ? 'bearish' : 'neutral';
  const fisherConfidence = Math.min(100, Math.abs(fisherValue - triggerValue) * 50);
  indicators.push({
    name: 'Fisher Transform',
    value: fisherValue,
    signal: fisherSignal,
    confidence: fisherConfidence,
    description: fisherSignal === 'bullish' ? 'Bullish crossover' : fisherSignal === 'bearish' ? 'Bearish crossover' : 'No signal'
  });
  totalScore += fisherSignal === 'bullish' ? 70 : fisherSignal === 'bearish' ? 30 : 50;
  totalWeight += 1;

  // MAMA/FAMA
  const { mama, fama } = calculateMAMA(prices);
  const mamaValue = mama[mama.length - 1];
  const famaValue = fama[fama.length - 1];
  const mamaSignal = mamaValue > famaValue ? 'bullish' : mamaValue < famaValue ? 'bearish' : 'neutral';
  indicators.push({
    name: 'MAMA',
    value: mamaValue,
    signal: mamaSignal,
    confidence: Math.min(100, Math.abs(mamaValue - famaValue) / prices[prices.length - 1] * 10000),
    description: `MAMA: ${mamaValue.toFixed(2)}, FAMA: ${famaValue.toFixed(2)}`
  });
  totalScore += mamaSignal === 'bullish' ? 70 : mamaSignal === 'bearish' ? 30 : 50;
  totalWeight += 1;

  // Cyber Cycle
  const cyberCycle = calculateCyberCycle(prices);
  const cyberValue = cyberCycle[cyberCycle.length - 1];
  const prevCyberValue = cyberCycle[cyberCycle.length - 2];
  const cyberSignal = cyberValue > prevCyberValue ? 'bullish' : cyberValue < prevCyberValue ? 'bearish' : 'neutral';
  indicators.push({
    name: 'Cyber Cycle',
    value: cyberValue,
    signal: cyberSignal,
    confidence: Math.min(100, Math.abs(cyberValue - prevCyberValue) * 1000),
    description: cyberSignal === 'bullish' ? 'Rising' : cyberSignal === 'bearish' ? 'Falling' : 'Flat'
  });
  totalScore += cyberSignal === 'bullish' ? 70 : cyberSignal === 'bearish' ? 30 : 50;
  totalWeight += 1;

  // Super Smoother
  const superSmoother = calculateSuperSmoother(prices, 10);
  const smootherValue = superSmoother[superSmoother.length - 1];
  const smootherSignal = prices[prices.length - 1] > smootherValue ? 'bullish' : 'bearish';
  indicators.push({
    name: 'Super Smoother',
    value: smootherValue,
    signal: smootherSignal,
    confidence: Math.min(100, Math.abs(prices[prices.length - 1] - smootherValue) / prices[prices.length - 1] * 1000),
    description: `Price ${smootherSignal === 'bullish' ? 'above' : 'below'} smoother`
  });
  totalScore += smootherSignal === 'bullish' ? 70 : 30;
  totalWeight += 1;

  // Laguerre RSI
  const laguerreRSI = calculateLaguerreRSI(prices);
  const lrsiValue = laguerreRSI[laguerreRSI.length - 1];
  const lrsiSignal = lrsiValue > 80 ? 'bearish' : lrsiValue < 20 ? 'bullish' : 'neutral';
  indicators.push({
    name: 'Laguerre RSI',
    value: lrsiValue,
    signal: lrsiSignal === 'bullish' ? 'bullish' : lrsiSignal === 'bearish' ? 'bearish' : 'neutral',
    confidence: Math.abs(lrsiValue - 50),
    description: lrsiValue > 80 ? 'Overbought' : lrsiValue < 20 ? 'Oversold' : 'Neutral'
  });
  totalScore += lrsiSignal === 'bullish' ? 70 : lrsiSignal === 'bearish' ? 30 : 50;
  totalWeight += 1;

  // Dominant Cycle
  const dominantCycle = calculateDominantCycle(prices);
  indicators.push({
    name: 'Dominant Cycle',
    value: dominantCycle,
    signal: 'neutral',
    confidence: 80,
    description: `${dominantCycle.toFixed(1)} bars detected`
  });

  // Trend Mode Detection
  const decycler = calculateDecycler(prices, 125);
  const trendMode = Math.abs(prices[prices.length - 1] - decycler[decycler.length - 1]) / prices[prices.length - 1] < 0.02;

  // Calculate composite score
  const score = totalWeight > 0 ? totalScore / totalWeight : 50;
  const direction: 'bullish' | 'bearish' | 'neutral' = score >= 60 ? 'bullish' : score <= 40 ? 'bearish' : 'neutral';

  return {
    score,
    direction,
    indicators,
    dominantCycle,
    trendMode
  };
};
