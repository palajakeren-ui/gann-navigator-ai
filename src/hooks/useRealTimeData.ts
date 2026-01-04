import { useState, useEffect, useCallback } from 'react';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

export interface GannLevel {
  type: 'support' | 'resistance' | 'pivot';
  price: number;
  strength: number;
  angle?: string;
  degree?: number;
}

export interface TradingSignal {
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number;
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  timestamp: number;
}

// Simulated real-time data generator
const generateMarketData = (symbol: string, basePrice: number): MarketData => {
  const change = (Math.random() - 0.5) * basePrice * 0.02;
  return {
    symbol,
    price: basePrice + change,
    change,
    changePercent: (change / basePrice) * 100,
    high: basePrice + Math.abs(change) * 1.5,
    low: basePrice - Math.abs(change) * 1.5,
    volume: Math.floor(Math.random() * 10000000),
    timestamp: Date.now(),
  };
};

export const useRealTimeData = (symbol: string, basePrice: number, interval = 2000) => {
  const [data, setData] = useState<MarketData>(() => generateMarketData(symbol, basePrice));
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const newPrice = prev.price + (Math.random() - 0.5) * prev.price * 0.001;
        return generateMarketData(symbol, newPrice);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [symbol, interval]);

  const reconnect = useCallback(() => {
    setIsConnected(true);
    setData(generateMarketData(symbol, basePrice));
  }, [symbol, basePrice]);

  return { data, isConnected, reconnect };
};

export const useGannLevels = (currentPrice: number) => {
  const [levels, setLevels] = useState<GannLevel[]>([]);

  useEffect(() => {
    const calculateLevels = () => {
      const baseUnit = currentPrice * 0.01;
      return [
        { type: 'resistance' as const, price: currentPrice + baseUnit * 3, strength: 70, angle: '3x1', degree: 270 },
        { type: 'resistance' as const, price: currentPrice + baseUnit * 2, strength: 85, angle: '2x1', degree: 180 },
        { type: 'resistance' as const, price: currentPrice + baseUnit * 1, strength: 92, angle: '1x1', degree: 90 },
        { type: 'pivot' as const, price: currentPrice, strength: 100, angle: 'Current', degree: 0 },
        { type: 'support' as const, price: currentPrice - baseUnit * 1, strength: 88, angle: '1x2', degree: 90 },
        { type: 'support' as const, price: currentPrice - baseUnit * 2, strength: 82, angle: '1x3', degree: 180 },
        { type: 'support' as const, price: currentPrice - baseUnit * 3, strength: 70, angle: '1x4', degree: 270 },
      ];
    };

    setLevels(calculateLevels());
  }, [currentPrice]);

  return levels;
};

export const useSignalGenerator = (marketData: MarketData, gannLevels: GannLevel[]) => {
  const [signal, setSignal] = useState<TradingSignal | null>(null);

  useEffect(() => {
    const generateSignal = () => {
      const nearestSupport = gannLevels.filter(l => l.type === 'support').sort((a, b) => b.price - a.price)[0];
      const nearestResistance = gannLevels.filter(l => l.type === 'resistance').sort((a, b) => a.price - b.price)[0];
      
      if (!nearestSupport || !nearestResistance) return null;

      const distanceToSupport = marketData.price - nearestSupport.price;
      const distanceToResistance = nearestResistance.price - marketData.price;
      
      const direction: 'BUY' | 'SELL' | 'NEUTRAL' = 
        distanceToSupport < distanceToResistance * 0.5 ? 'BUY' :
        distanceToResistance < distanceToSupport * 0.5 ? 'SELL' : 'NEUTRAL';

      const strength = Math.min(0.95, 0.6 + Math.random() * 0.35);
      const confidence = Math.min(0.90, 0.5 + Math.random() * 0.4);

      const stopDistance = marketData.price * 0.01;
      const targetDistance = stopDistance * 2.5;

      return {
        direction,
        strength,
        confidence,
        entry: marketData.price,
        stopLoss: direction === 'BUY' ? marketData.price - stopDistance : marketData.price + stopDistance,
        takeProfit: direction === 'BUY' ? marketData.price + targetDistance : marketData.price - targetDistance,
        riskReward: 2.5,
        timestamp: Date.now(),
      };
    };

    setSignal(generateSignal());
  }, [marketData.price, gannLevels]);

  return signal;
};

export const usePlanetaryData = () => {
  const [planetaryData, setPlanetaryData] = useState({
    planets: [
      { name: 'Sun', sign: 'Capricorn', degree: 284, retrograde: false, influence: 'neutral' },
      { name: 'Moon', sign: 'Leo', degree: 128, retrograde: false, influence: 'bullish' },
      { name: 'Mercury', sign: 'Sagittarius', degree: 262, retrograde: true, influence: 'bearish' },
      { name: 'Venus', sign: 'Aquarius', degree: 315, retrograde: false, influence: 'bullish' },
      { name: 'Mars', sign: 'Scorpio', degree: 225, retrograde: false, influence: 'neutral' },
      { name: 'Jupiter', sign: 'Gemini', degree: 78, retrograde: false, influence: 'bullish' },
      { name: 'Saturn', sign: 'Pisces', degree: 348, retrograde: false, influence: 'bearish' },
    ],
    aspects: [
      { planet1: 'Jupiter', planet2: 'Venus', aspect: 'Trine', angle: 120, orb: 2.3, influence: 'bullish', score: 0.42 },
      { planet1: 'Mercury', planet2: 'Neptune', aspect: 'Sextile', angle: 60, orb: 1.8, influence: 'bullish', score: 0.32 },
      { planet1: 'Saturn', planet2: 'Mars', aspect: 'Square', angle: 90, orb: 3.1, influence: 'bearish', score: -0.38 },
    ],
    lunarPhase: { phase: 'Waxing Gibbous', percentage: 78, influence: 'bullish' },
    totalScore: 0.36,
  });

  return planetaryData;
};

export const useEhlersIndicators = (prices: number[]) => {
  const [indicators, setIndicators] = useState([
    { name: 'Fisher Transform', signal: 'Bullish Cross', value: '1.33', confidence: 0.93 },
    { name: 'Smoothed RSI', signal: 'Bullish', value: '67.2', confidence: 0.87 },
    { name: 'Super Smoother', signal: 'Trend Up', value: '+0.024', confidence: 0.85 },
    { name: 'MAMA', signal: 'Bullish', value: '104,400', confidence: 0.90 },
    { name: 'Instantaneous Trendline', signal: 'Uptrend', value: '104,100', confidence: 0.89 },
    { name: 'Cyber Cycle', signal: 'Rising', value: '+0.026', confidence: 0.86 },
    { name: 'Dominant Cycle', signal: 'Strong', value: '24.0 days', confidence: 0.96 },
    { name: 'Sinewave Indicator', signal: 'Bullish phase', value: '+0.021', confidence: 0.84 },
    { name: 'Roofing Filter', signal: 'Uptrend', value: '+0.017', confidence: 0.80 },
    { name: 'Decycler', signal: 'Bullish', value: '+0.028', confidence: 0.82 },
  ]);

  const compositeScore = 0.88;

  return { indicators, compositeScore };
};

export const useMLPredictions = () => {
  const [predictions, setPredictions] = useState([
    { name: 'XGBoost', signal: 'Bullish', value: '104,700', confidence: 0.86, weight: 14 },
    { name: 'Random Forest', signal: 'Bullish', value: '104,650', confidence: 0.84, weight: 14 },
    { name: 'LSTM', signal: 'Bullish', value: '104,720', confidence: 0.89, weight: 14 },
    { name: 'Neural ODE', signal: 'Bullish', value: '104,680', confidence: 0.85, weight: 12 },
    { name: 'Gradient Boosting', signal: 'Bullish', value: '104,710', confidence: 0.87, weight: 18 },
    { name: 'LightGBM', signal: 'Bullish', value: '104,695', confidence: 0.85, weight: 14 },
    { name: 'Hybrid Meta-Model', signal: 'Bullish', value: '104,700', confidence: 0.88, weight: 14 },
  ]);

  const compositeScore = 0.88;
  const consensusPrice = 104700;

  return { predictions, compositeScore, consensusPrice };
};
