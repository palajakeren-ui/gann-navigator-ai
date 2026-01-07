/**
 * Unified Live Data Hook
 * Provides real-time market data, Gann calculations, Astro data, and trading signals
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGlobalStore } from '@/lib/stores/globalStore';
import { calculateGannMaster, calculateTimeCycles, GannLevel } from '@/lib/calculations/gannEngine';
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

export interface LiveDataState {
  marketData: LiveMarketData;
  gannLevels: GannLevel[];
  nearestSupport: GannLevel | null;
  nearestResistance: GannLevel | null;
  timeCycles: ReturnType<typeof calculateTimeCycles>;
  astroData: ReturnType<typeof calculateAstroMaster>;
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
  const [state, setState] = useState<LiveDataState>({
    marketData: generateUpdate(),
    gannLevels: [],
    nearestSupport: null,
    nearestResistance: null,
    timeCycles: calculateTimeCycles(new Date()),
    astroData: calculateAstroMaster(),
    ehlersData: { score: 50, direction: 'neutral', indicators: [], dominantCycle: 20, trendMode: false },
    mlPredictions: { models: [], consensusPrediction: 'neutral', consensusConfidence: 50, weightedTargetPrice: basePrice, accuracy: 0 },
    tradingSignal: null,
    isConnected: false,
    isLoading: true
  });

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

    // Astro data (update less frequently)
    const astroData = calculateAstroMaster();

    setState({
      marketData,
      gannLevels: gannResult.allLevels.slice(0, 20),
      nearestSupport: gannResult.nearestSupport,
      nearestResistance: gannResult.nearestResistance,
      timeCycles: calculateTimeCycles(new Date()),
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
