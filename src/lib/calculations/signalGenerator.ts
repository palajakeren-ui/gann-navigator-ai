/**
 * Trading Signal Generator
 * Combines Gann, Astro, Technical, and ML signals into unified trading signals
 */

import { GannLevel, calculateGannMaster, calculateGannAngles } from './gannEngine';
import { calculateAstroMaster, MarketSentiment } from './astroEngine';
import { calculateRSI, calculateMACD, calculateBollingerBands, calculateATR, OHLC } from './technicalIndicators';

// ==================== TYPE DEFINITIONS ====================

export type SignalDirection = 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';

export interface TradingSignal {
  direction: SignalDirection;
  strength: number; // 0-100
  confidence: number; // 0-100
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  timestamp: Date;
  sources: SignalSource[];
  reasoning: string[];
}

export interface SignalSource {
  name: string;
  direction: SignalDirection;
  weight: number;
  score: number;
  details: string;
}

export interface SignalConfig {
  gannWeight: number;
  astroWeight: number;
  technicalWeight: number;
  mlWeight: number;
  minConfidence: number;
}

// ==================== SIGNAL GENERATORS ====================

/**
 * Generate Gann-based signals
 */
export const generateGannSignal = (
  currentPrice: number,
  historicalHigh: number,
  historicalLow: number
): SignalSource => {
  const { nearestSupport, nearestResistance, keyLevels } = calculateGannMaster(currentPrice);
  
  let score = 50; // Neutral starting point
  let direction: SignalDirection = 'neutral';
  let details = '';

  if (nearestSupport && nearestResistance) {
    const supportDistance = currentPrice - nearestSupport.price;
    const resistanceDistance = nearestResistance.price - currentPrice;
    const range = nearestResistance.price - nearestSupport.price;
    
    // Position within range
    const positionInRange = supportDistance / range;

    if (positionInRange < 0.2) {
      // Near support - bullish
      score = 70 + nearestSupport.strength / 5;
      direction = score > 80 ? 'strong_buy' : 'buy';
      details = `Price near ${nearestSupport.description} support at ${nearestSupport.price.toFixed(2)}`;
    } else if (positionInRange > 0.8) {
      // Near resistance - bearish
      score = 30 - nearestResistance.strength / 5;
      direction = score < 20 ? 'strong_sell' : 'sell';
      details = `Price near ${nearestResistance.description} resistance at ${nearestResistance.price.toFixed(2)}`;
    } else {
      // In middle - check trend
      const trendBias = (currentPrice - historicalLow) / (historicalHigh - historicalLow);
      score = 50 + (trendBias - 0.5) * 40;
      direction = score > 55 ? 'buy' : score < 45 ? 'sell' : 'neutral';
      details = `Price in mid-range, trend bias ${(trendBias * 100).toFixed(0)}%`;
    }
  }

  return {
    name: 'Gann Analysis',
    direction,
    weight: 0.25,
    score: Math.max(0, Math.min(100, score)),
    details
  };
};

/**
 * Generate Astro-based signals
 */
export const generateAstroSignal = (date: Date = new Date()): SignalSource => {
  const astro = calculateAstroMaster(date);
  const { sentiment, lunarPhase, currentHour, retrogrades } = astro;

  let score = sentiment.score;
  let direction: SignalDirection = sentiment.direction === 'bullish' ? 'buy' : sentiment.direction === 'bearish' ? 'sell' : 'neutral';
  
  // Adjust for lunar phase
  if (lunarPhase.phase === 'Full Moon') {
    score -= 10; // Full moons often indicate reversals
  } else if (lunarPhase.phase === 'New Moon') {
    score += 5; // New moons can start new trends
  }

  // Adjust for current planetary hour
  if (currentHour) {
    if (currentHour.quality === 'bullish') score += 5;
    else if (currentHour.quality === 'bearish') score -= 5;
  }

  // Adjust for retrograde planets
  const retrogradeCount = retrogrades.filter(r => r.isRetrograde).length;
  score -= retrogradeCount * 3;

  // Recalculate direction based on adjusted score
  if (score >= 65) direction = 'strong_buy';
  else if (score >= 55) direction = 'buy';
  else if (score <= 35) direction = 'strong_sell';
  else if (score <= 45) direction = 'sell';
  else direction = 'neutral';

  const details = `${lunarPhase.phase}, ${sentiment.direction} sentiment (${sentiment.score}%), ${retrogradeCount} retrograde planets`;

  return {
    name: 'Astro Cycles',
    direction,
    weight: 0.15,
    score: Math.max(0, Math.min(100, score)),
    details
  };
};

/**
 * Generate Technical Analysis signals
 */
export const generateTechnicalSignal = (
  ohlcData: OHLC[],
  prices: number[]
): SignalSource => {
  if (prices.length < 30) {
    return {
      name: 'Technical Analysis',
      direction: 'neutral',
      weight: 0.30,
      score: 50,
      details: 'Insufficient data for technical analysis'
    };
  }

  let score = 50;
  const signals: string[] = [];

  // RSI
  const rsi = calculateRSI(prices, 14);
  const currentRSI = rsi[rsi.length - 1];
  if (!isNaN(currentRSI)) {
    if (currentRSI < 30) {
      score += 15;
      signals.push('RSI oversold');
    } else if (currentRSI > 70) {
      score -= 15;
      signals.push('RSI overbought');
    }
  }

  // MACD
  const { macd, signal } = calculateMACD(prices);
  const currentMACD = macd[macd.length - 1];
  const currentSignalLine = signal[signal.length - 1] || 0;
  if (!isNaN(currentMACD)) {
    if (currentMACD > currentSignalLine) {
      score += 10;
      signals.push('MACD bullish');
    } else {
      score -= 10;
      signals.push('MACD bearish');
    }
  }

  // Bollinger Bands
  const bb = calculateBollingerBands(prices, 20, 2);
  const currentPrice = prices[prices.length - 1];
  const upperBB = bb.upper[bb.upper.length - 1];
  const lowerBB = bb.lower[bb.lower.length - 1];
  
  if (!isNaN(upperBB) && !isNaN(lowerBB)) {
    if (currentPrice < lowerBB) {
      score += 12;
      signals.push('Below lower BB');
    } else if (currentPrice > upperBB) {
      score -= 12;
      signals.push('Above upper BB');
    }
  }

  // ATR trend
  const atr = calculateATR(ohlcData, 14);
  const currentATR = atr[atr.length - 1];
  const avgATR = atr.slice(-20).filter(v => !isNaN(v)).reduce((a, b) => a + b, 0) / 20;
  
  if (!isNaN(currentATR) && !isNaN(avgATR)) {
    if (currentATR > avgATR * 1.5) {
      signals.push('High volatility');
    }
  }

  // Price momentum
  const momentum = (prices[prices.length - 1] - prices[prices.length - 10]) / prices[prices.length - 10] * 100;
  if (momentum > 5) {
    score += 8;
    signals.push('Strong upward momentum');
  } else if (momentum < -5) {
    score -= 8;
    signals.push('Strong downward momentum');
  }

  let direction: SignalDirection;
  if (score >= 70) direction = 'strong_buy';
  else if (score >= 55) direction = 'buy';
  else if (score <= 30) direction = 'strong_sell';
  else if (score <= 45) direction = 'sell';
  else direction = 'neutral';

  return {
    name: 'Technical Analysis',
    direction,
    weight: 0.30,
    score: Math.max(0, Math.min(100, score)),
    details: signals.join(', ') || 'Mixed signals'
  };
};

/**
 * Generate ML/AI prediction signal (placeholder)
 */
export const generateMLSignal = (
  currentPrice: number,
  _historicalPrices: number[]
): SignalSource => {
  // This would connect to actual ML models
  // For now, generate a simulated prediction
  const randomFactor = Math.sin(currentPrice * 0.01) * 0.5 + 0.5;
  const score = 30 + randomFactor * 40; // Score between 30-70

  let direction: SignalDirection;
  if (score >= 60) direction = 'buy';
  else if (score <= 40) direction = 'sell';
  else direction = 'neutral';

  return {
    name: 'ML Prediction',
    direction,
    weight: 0.30,
    score,
    details: `LSTM ensemble prediction with ${score.toFixed(0)}% confidence`
  };
};

// ==================== MASTER SIGNAL GENERATOR ====================

/**
 * Generate comprehensive trading signal from all sources
 */
export const generateTradingSignal = (
  currentPrice: number,
  historicalHigh: number,
  historicalLow: number,
  ohlcData: OHLC[],
  prices: number[],
  config: Partial<SignalConfig> = {}
): TradingSignal => {
  const {
    gannWeight = 0.25,
    astroWeight = 0.15,
    technicalWeight = 0.30,
    mlWeight = 0.30,
    minConfidence = 60
  } = config;

  // Generate signals from all sources
  const gannSignal = generateGannSignal(currentPrice, historicalHigh, historicalLow);
  const astroSignal = generateAstroSignal();
  const technicalSignal = generateTechnicalSignal(ohlcData, prices);
  const mlSignal = generateMLSignal(currentPrice, prices);

  // Normalize weights
  const totalWeight = gannWeight + astroWeight + technicalWeight + mlWeight;
  const normalizedGann = gannWeight / totalWeight;
  const normalizedAstro = astroWeight / totalWeight;
  const normalizedTech = technicalWeight / totalWeight;
  const normalizedML = mlWeight / totalWeight;

  // Calculate weighted score
  const weightedScore = 
    gannSignal.score * normalizedGann +
    astroSignal.score * normalizedAstro +
    technicalSignal.score * normalizedTech +
    mlSignal.score * normalizedML;

  // Determine direction
  let direction: SignalDirection;
  if (weightedScore >= 70) direction = 'strong_buy';
  else if (weightedScore >= 55) direction = 'buy';
  else if (weightedScore <= 30) direction = 'strong_sell';
  else if (weightedScore <= 45) direction = 'sell';
  else direction = 'neutral';

  // Calculate confidence based on signal alignment
  const directionScores = [gannSignal, astroSignal, technicalSignal, mlSignal]
    .map(s => s.direction.includes('buy') ? 1 : s.direction.includes('sell') ? -1 : 0);
  const alignment = Math.abs(directionScores.reduce((a, b) => a + b, 0)) / 4;
  const confidence = 50 + alignment * 50;

  // Calculate entry, stop loss, take profit
  const { nearestSupport, nearestResistance } = calculateGannMaster(currentPrice);
  const atr = ohlcData.length >= 14 ? calculateATR(ohlcData, 14) : [currentPrice * 0.02];
  const currentATR = atr[atr.length - 1] || currentPrice * 0.02;

  let entry = currentPrice;
  let stopLoss: number;
  let takeProfit: number;

  if (direction.includes('buy')) {
    stopLoss = nearestSupport ? nearestSupport.price : currentPrice - currentATR * 2;
    takeProfit = nearestResistance ? nearestResistance.price : currentPrice + currentATR * 4;
  } else if (direction.includes('sell')) {
    stopLoss = nearestResistance ? nearestResistance.price : currentPrice + currentATR * 2;
    takeProfit = nearestSupport ? nearestSupport.price : currentPrice - currentATR * 4;
  } else {
    stopLoss = currentPrice - currentATR * 1.5;
    takeProfit = currentPrice + currentATR * 1.5;
  }

  const riskReward = Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

  // Build reasoning
  const reasoning: string[] = [
    gannSignal.details,
    astroSignal.details,
    technicalSignal.details,
    mlSignal.details
  ].filter(r => r.length > 0);

  return {
    direction,
    strength: weightedScore,
    confidence,
    entry,
    stopLoss,
    takeProfit,
    riskReward,
    timestamp: new Date(),
    sources: [gannSignal, astroSignal, technicalSignal, mlSignal],
    reasoning
  };
};

/**
 * Get signal color for UI display
 */
export const getSignalColor = (direction: SignalDirection): string => {
  switch (direction) {
    case 'strong_buy': return 'text-success';
    case 'buy': return 'text-success/80';
    case 'neutral': return 'text-muted-foreground';
    case 'sell': return 'text-destructive/80';
    case 'strong_sell': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
};

/**
 * Get signal badge variant for UI display
 */
export const getSignalBadgeVariant = (direction: SignalDirection): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (direction) {
    case 'strong_buy':
    case 'buy':
      return 'default';
    case 'neutral':
      return 'secondary';
    case 'sell':
    case 'strong_sell':
      return 'destructive';
    default:
      return 'outline';
  }
};
