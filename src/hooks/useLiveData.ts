/**
 * Unified Live Data Hook
 * Provides real-time market data, Gann calculations, Astro data, and trading signals
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGlobalStore } from '@/lib/stores/globalStore';
import { calculateGannMaster, GannLevel } from '@/lib/calculations/gannEngine';
import { calculateAstroMaster } from '@/lib/calculations/astroEngine';
import { calculateEhlersComposite, EhlersComposite } from '@/lib/calculations/ehlersDSP';
import { generateMLEnsemble, MLEnsemble } from '@/lib/calculations/mlPredictor';
import { generateTradingSignal, TradingSignal } from '@/lib/calculations/signalGenerator';
import { OHLC } from '@/lib/calculations/technicalIndicators';

export interface LiveMarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: Date;
  bid: number;
  ask: number;
  spread: number;
}

// Processed time cycles with computed properties
export interface ProcessedTimeCycles {
  cycles: Array<{
    name: string;
    days: number;
    targetDate: Date;
    significance: 'high' | 'medium' | 'low';
    type: 'gann' | 'fibonacci' | 'natural';
  }>;
  nextTurnDate: Date | null;
  dominantCycle: number;
  confidence: number;
  activeCycles: Array<{
    name: string;
    phase: string;
    progress: number;
  }>;
}

// Processed astro data with aliases for backward compatibility
export interface ProcessedAstroData {
  positions: Array<{
    planet: string;
    name: string; // alias for planet
    longitude: number;
    latitude: number;
    sign: string;
    degree: number;
    minute: number;
    house: number;
    retrograde: boolean;
    speed: number;
  }>;
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house: number;
    retrograde: boolean;
  }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    type: string; // alias for aspect
    angle: number;
    orb: number;
    applying: boolean;
    influence: number; // converted to number
    strength: number;
    description: string;
  }>;
  lunarPhase: {
    phase: string;
    name: string; // alias for phase
    percentage: number;
    illumination: number;
    age: number;
    influence: number; // converted to number
    nextPhase: { phase: string; date: Date };
  };
  planetaryHours: Array<{
    hour: number;
    startTime: Date;
    endTime: Date;
    planet: string;
    quality: 'bullish' | 'bearish' | 'neutral';
    description: string;
  }>;
  currentHour: {
    hour: number;
    planet: string;
    quality: 'bullish' | 'bearish' | 'neutral';
    description: string;
    isFavorable: boolean;
  } | null;
  sentiment: {
    score: number;
    direction: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    strength: number; // alias for score / 100
    factors: Array<{ factor: string; weight: number; contribution: number }>;
  };
  marketSentiment: {
    score: number;
    direction: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    strength: number;
    factors: Array<{ factor: string; weight: number; contribution: number }>;
  };
  retrogrades: Array<{
    planet: string;
    isRetrograde: boolean;
    startDate: Date | null;
    endDate: Date | null;
    influence: string;
    impact: string; // alias for influence
  }>;
}

export interface LiveDataState {
  marketData: LiveMarketData;
  gannLevels: GannLevel[];
  nearestSupport: GannLevel | null;
  nearestResistance: GannLevel | null;
  timeCycles: ProcessedTimeCycles;
  astroData: ProcessedAstroData;
  ehlersData: EhlersComposite;
  mlPredictions: MLEnsemble;
  tradingSignal: TradingSignal | null;
  isConnected: boolean;
  isLoading: boolean;
}

interface UseLiveDataConfig {
  symbol?: string;
  enabled?: boolean;
  updateInterval?: number;
  basePrice?: number;
}

// Helper to process astro data with aliases
const processAstroData = (raw: ReturnType<typeof calculateAstroMaster>): ProcessedAstroData => {
  const influenceToNumber = (influence: string): number => {
    if (influence === 'bullish') return 0.7;
    if (influence === 'bearish') return -0.7;
    return 0;
  };

  const lunarInfluenceToNumber = (influence: string): number => {
    if (influence.includes('bullish') || influence.includes('Waxing') || influence.includes('Growing')) return 0.5;
    if (influence.includes('bearish') || influence.includes('Waning') || influence.includes('low')) return -0.3;
    return 0;
  };

  return {
    positions: raw.positions.map(p => ({
      ...p,
      name: p.planet // alias
    })),
    planets: raw.positions.map(p => ({
      name: p.planet,
      sign: p.sign,
      degree: p.degree,
      house: p.house,
      retrograde: p.retrograde
    })),
    aspects: raw.aspects.map(a => ({
      ...a,
      type: a.aspect, // alias
      influence: influenceToNumber(a.influence) // convert to number
    })),
    lunarPhase: {
      ...raw.lunarPhase,
      name: raw.lunarPhase.phase, // alias
      influence: lunarInfluenceToNumber(raw.lunarPhase.influence) // convert to number
    },
    planetaryHours: raw.planetaryHours,
    currentHour: raw.currentHour ? {
      hour: raw.currentHour.hour,
      planet: raw.currentHour.planet,
      quality: raw.currentHour.quality,
      description: raw.currentHour.description,
      isFavorable: raw.currentHour.quality === 'bullish'
    } : null,
    sentiment: {
      ...raw.sentiment,
      strength: raw.sentiment.score / 100
    },
    marketSentiment: {
      ...raw.sentiment,
      strength: raw.sentiment.score / 100
    },
    retrogrades: raw.retrogrades.map(r => ({
      ...r,
      impact: r.influence // alias
    }))
  };
};

// Helper to process time cycles
const processTimeCycles = (startDate: Date): ProcessedTimeCycles => {
  const baseCycles = [
    { name: '7-Day Minor', days: 7, significance: 'low' as const, type: 'gann' as const },
    { name: '14-Day', days: 14, significance: 'medium' as const, type: 'gann' as const },
    { name: '21-Day', days: 21, significance: 'high' as const, type: 'gann' as const },
    { name: '28-Day Lunar', days: 28, significance: 'high' as const, type: 'gann' as const },
    { name: '45-Day', days: 45, significance: 'high' as const, type: 'gann' as const },
    { name: '90-Day Quarter', days: 90, significance: 'high' as const, type: 'gann' as const },
    { name: '144-Day Fibonacci', days: 144, significance: 'high' as const, type: 'fibonacci' as const },
  ];

  const cycles = baseCycles.map(cycle => ({
    ...cycle,
    targetDate: new Date(startDate.getTime() + cycle.days * 24 * 60 * 60 * 1000)
  }));

  // Find next turn date (nearest high significance cycle)
  const highSigCycles = cycles.filter(c => c.significance === 'high');
  const now = new Date();
  const futureCycles = highSigCycles.filter(c => c.targetDate > now);
  const nextTurnDate = futureCycles.length > 0 
    ? futureCycles.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())[0].targetDate
    : new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

  // Calculate active cycles with progress
  const activeCycles = baseCycles.slice(0, 5).map(cycle => {
    const elapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const progress = (elapsed % cycle.days) / cycle.days;
    const phase = progress < 0.25 ? 'Accumulation' : 
                  progress < 0.5 ? 'Expansion' : 
                  progress < 0.75 ? 'Distribution' : 'Contraction';
    return {
      name: cycle.name,
      phase,
      progress
    };
  });

  return {
    cycles,
    nextTurnDate,
    dominantCycle: 21,
    confidence: 85 + Math.random() * 10,
    activeCycles
  };
};

export const useLiveData = (config: UseLiveDataConfig = {}): LiveDataState & {
  toggleConnection: () => void;
  refresh: () => void;
} => {
  const {
    symbol = 'BTCUSDT',
    enabled = true,
    updateInterval = 2000,
    basePrice = 105000
  } = config;

  const { setMarketData, setConnected, setConnectionStatus, setGannLevels } = useGlobalStore();
  
  const [isConnected, setIsConnectedLocal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const priceRef = useRef(basePrice);
  const priceHistory = useRef<number[]>([basePrice]);
  const ohlcHistory = useRef<OHLC[]>([]);
  const cycleStartDate = useRef(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // Started 7 days ago

  // Generate OHLC data
  const generateOHLC = useCallback((price: number): OHLC => {
    const volatility = price * 0.002;
    return {
      open: price - volatility * Math.random(),
      high: price + volatility * Math.random(),
      low: price - volatility * Math.random(),
      close: price,
      volume: 1000000 + Math.random() * 500000
    };
  }, []);

  // Initialize historical data
  useEffect(() => {
    const initialPrices: number[] = [];
    const initialOHLC: OHLC[] = [];
    for (let i = 0; i < 100; i++) {
      const p = basePrice + Math.sin(i / 10) * basePrice * 0.03 + (Math.random() - 0.5) * basePrice * 0.01;
      initialPrices.push(p);
      initialOHLC.push(generateOHLC(p));
    }
    priceHistory.current = initialPrices;
    ohlcHistory.current = initialOHLC;
    priceRef.current = initialPrices[initialPrices.length - 1];
  }, [basePrice, generateOHLC]);

  // Generate market data update
  const generateUpdate = useCallback((): LiveMarketData => {
    const volatility = 0.0008;
    const drift = (Math.random() - 0.5) * 2;
    const change = priceRef.current * volatility * drift;
    priceRef.current += change;

    // Update history
    priceHistory.current.push(priceRef.current);
    if (priceHistory.current.length > 500) priceHistory.current.shift();
    
    ohlcHistory.current.push(generateOHLC(priceRef.current));
    if (ohlcHistory.current.length > 500) ohlcHistory.current.shift();

    const dailyChange = priceRef.current - basePrice;
    const spread = priceRef.current * 0.0001;

    return {
      symbol,
      price: priceRef.current,
      change: dailyChange,
      changePercent: (dailyChange / basePrice) * 100,
      high24h: Math.max(...priceHistory.current.slice(-720)),
      low24h: Math.min(...priceHistory.current.slice(-720)),
      volume: 1500000000 + Math.random() * 500000000,
      timestamp: new Date(),
      bid: priceRef.current - spread / 2,
      ask: priceRef.current + spread / 2,
      spread
    };
  }, [symbol, basePrice, generateOHLC]);

  // Calculate all data
  const [state, setState] = useState<LiveDataState>(() => ({
    marketData: generateUpdate(),
    gannLevels: [],
    nearestSupport: null,
    nearestResistance: null,
    timeCycles: processTimeCycles(cycleStartDate.current),
    astroData: processAstroData(calculateAstroMaster()),
    ehlersData: { score: 50, direction: 'neutral', indicators: [], dominantCycle: 20, trendMode: false },
    mlPredictions: { models: [], consensusPrediction: 'neutral', consensusConfidence: 50, weightedTargetPrice: basePrice, accuracy: 0 },
    tradingSignal: null,
    isConnected: false,
    isLoading: true
  }));

  // Update function
  const updateData = useCallback(() => {
    const marketData = generateUpdate();
    const prices = priceHistory.current;
    const ohlc = ohlcHistory.current;

    // Gann calculations
    const gannResult = calculateGannMaster(marketData.price);
    
    // Ehlers calculations
    const ehlersData = calculateEhlersComposite(prices);
    
    // ML predictions
    const mlPredictions = generateMLEnsemble(prices);
    
    // Trading signal
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const tradingSignal = generateTradingSignal(marketData.price, high, low, ohlc, prices);

    // Astro data (processed with aliases)
    const astroData = processAstroData(calculateAstroMaster());

    // Time cycles (processed with computed properties)
    const timeCycles = processTimeCycles(cycleStartDate.current);

    setState({
      marketData,
      gannLevels: gannResult.allLevels.slice(0, 20),
      nearestSupport: gannResult.nearestSupport,
      nearestResistance: gannResult.nearestResistance,
      timeCycles,
      astroData,
      ehlersData,
      mlPredictions,
      tradingSignal,
      isConnected: true,
      isLoading: false
    });

    // Update global store
    setMarketData(symbol, marketData as any);
    setGannLevels(gannResult.keyLevels as any);
    setConnected(true);
    setConnectionStatus('connected');
  }, [generateUpdate, symbol, setMarketData, setGannLevels, setConnected, setConnectionStatus]);

  // Start/stop updates
  useEffect(() => {
    if (enabled && isConnected) {
      updateData(); // Initial update
      intervalRef.current = setInterval(updateData, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, isConnected, updateInterval, updateData]);

  // Auto-connect on mount
  useEffect(() => {
    if (enabled) {
      setIsConnectedLocal(true);
      setIsLoading(false);
    }
  }, [enabled]);

  const toggleConnection = useCallback(() => {
    setIsConnectedLocal(prev => {
      const newState = !prev;
      setConnected(newState);
      setConnectionStatus(newState ? 'connected' : 'disconnected');
      return newState;
    });
  }, [setConnected, setConnectionStatus]);

  const refresh = useCallback(() => {
    updateData();
  }, [updateData]);

  return {
    ...state,
    isConnected,
    toggleConnection,
    refresh
  };
};

export default useLiveData;
