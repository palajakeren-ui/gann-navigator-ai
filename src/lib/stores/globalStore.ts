/**
 * Global State Management - Zustand Store
 * Single source of truth for application state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ==================== TYPE DEFINITIONS ====================

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: Date;
}

export interface GannLevel {
  type: 'support' | 'resistance' | 'cardinal' | 'ordinal' | 'pivot';
  price: number;
  strength: number;
  angle: number;
  degree: number;
  description?: string;
}

export interface TradingSignal {
  direction: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  confidence: number;
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskReward?: number;
  timestamp: Date;
  source: string;
}

export interface PlanetaryData {
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    retrograde: boolean;
    longitude: number;
  }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: string;
    angle: number;
    influence: string;
  }>;
  lunarPhase: {
    phase: string;
    percentage: number;
    influence: string;
  };
}

export interface UserSession {
  id: string | null;
  email: string | null;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: Date | null;
}

export interface UIPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  activeTimeframe: string;
  language: string;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  refreshInterval: number;
  maxRetries: number;
  timeout: number;
  cacheEnabled: boolean;
  debugMode: boolean;
}

export interface FeatureFlags {
  gannEnabled: boolean;
  astroEnabled: boolean;
  aiEnabled: boolean;
  hftEnabled: boolean;
  optionsEnabled: boolean;
  backtestEnabled: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface RiskSettings {
  riskPerTrade: number;
  maxDrawdown: number;
  kellyFraction: number;
  riskReward: number;
  adaptiveSizing: boolean;
  maxPositions: number;
  stopLossPercent: number;
  takeProfitPercent: number;
}

export interface StrategyConfig {
  name: string;
  weight: number;
  enabled: boolean;
  parameters: Record<string, number | string | boolean>;
}

// ==================== GLOBAL STORE ====================

interface GlobalState {
  // User & Auth
  session: UserSession;
  setSession: (session: Partial<UserSession>) => void;
  logout: () => void;

  // UI Preferences
  ui: UIPreferences;
  setUI: (prefs: Partial<UIPreferences>) => void;
  toggleSidebar: () => void;

  // App Configuration
  config: AppConfig;
  setConfig: (config: Partial<AppConfig>) => void;

  // Feature Flags
  features: FeatureFlags;
  setFeatures: (flags: Partial<FeatureFlags>) => void;

  // Market Data
  marketData: Record<string, MarketData>;
  setMarketData: (symbol: string, data: MarketData) => void;
  clearMarketData: () => void;

  // Gann Levels
  gannLevels: GannLevel[];
  setGannLevels: (levels: GannLevel[]) => void;

  // Trading Signals
  signals: TradingSignal[];
  addSignal: (signal: TradingSignal) => void;
  clearSignals: () => void;

  // Planetary Data
  planetaryData: PlanetaryData | null;
  setPlanetaryData: (data: PlanetaryData) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Risk Settings
  risk: RiskSettings;
  setRisk: (settings: Partial<RiskSettings>) => void;

  // Strategy Configs
  strategies: StrategyConfig[];
  setStrategies: (strategies: StrategyConfig[]) => void;
  updateStrategy: (name: string, updates: Partial<StrategyConfig>) => void;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (msg: string) => void;

  // Connection Status
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;

  // Global Reset
  resetState: () => void;
}

const defaultSession: UserSession = {
  id: null,
  email: null,
  role: 'guest',
  permissions: [],
  isAuthenticated: false,
  token: null,
  expiresAt: null,
};

const defaultUI: UIPreferences = {
  theme: 'dark',
  sidebarCollapsed: false,
  activeTimeframe: 'H1',
  language: 'en',
  animationsEnabled: true,
  soundEnabled: true,
};

const defaultConfig: AppConfig = {
  apiBaseUrl: '/api',
  wsUrl: 'wss://stream.binance.com:9443/ws',
  refreshInterval: 5000,
  maxRetries: 3,
  timeout: 30000,
  cacheEnabled: true,
  debugMode: import.meta.env.DEV,
};

const defaultFeatures: FeatureFlags = {
  gannEnabled: true,
  astroEnabled: true,
  aiEnabled: true,
  hftEnabled: true,
  optionsEnabled: true,
  backtestEnabled: true,
};

const defaultRisk: RiskSettings = {
  riskPerTrade: 2.0,
  maxDrawdown: 20,
  kellyFraction: 0.5,
  riskReward: 2.0,
  adaptiveSizing: true,
  maxPositions: 5,
  stopLossPercent: 2,
  takeProfitPercent: 4,
};

const defaultStrategies: StrategyConfig[] = [
  { name: 'Gann Square of 9', weight: 0.20, enabled: true, parameters: {} },
  { name: 'Gann Angles', weight: 0.15, enabled: true, parameters: {} },
  { name: 'Astro Cycles', weight: 0.15, enabled: true, parameters: {} },
  { name: 'Ehlers DSP', weight: 0.20, enabled: true, parameters: {} },
  { name: 'ML Predictions', weight: 0.20, enabled: true, parameters: {} },
  { name: 'Pattern Recognition', weight: 0.10, enabled: true, parameters: {} },
];

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // User & Auth
      session: defaultSession,
      setSession: (session) => set((state) => ({ session: { ...state.session, ...session } })),
      logout: () => set({
        session: defaultSession,
        signals: [],
        notifications: [],
        marketData: {},
      }),

      // UI Preferences
      ui: defaultUI,
      setUI: (prefs) => set((state) => ({ ui: { ...state.ui, ...prefs } })),
      toggleSidebar: () => set((state) => ({ ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed } })),

      // App Configuration
      config: defaultConfig,
      setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),

      // Feature Flags
      features: defaultFeatures,
      setFeatures: (flags) => set((state) => ({ features: { ...state.features, ...flags } })),

      // Market Data
      marketData: {},
      setMarketData: (symbol, data) => set((state) => ({
        marketData: { ...state.marketData, [symbol]: data }
      })),
      clearMarketData: () => set({ marketData: {} }),

      // Gann Levels
      gannLevels: [],
      setGannLevels: (levels) => set({ gannLevels: levels }),

      // Trading Signals
      signals: [],
      addSignal: (signal) => set((state) => ({
        signals: [signal, ...state.signals].slice(0, 100)
      })),
      clearSignals: () => set({ signals: [] }),

      // Planetary Data
      planetaryData: null,
      setPlanetaryData: (data) => set({ planetaryData: data }),

      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false,
          },
          ...state.notifications,
        ].slice(0, 50)
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Risk Settings
      risk: defaultRisk,
      setRisk: (settings) => set((state) => ({ risk: { ...state.risk, ...settings } })),

      // Strategy Configs
      strategies: defaultStrategies,
      setStrategies: (strategies) => set({ strategies }),
      updateStrategy: (name, updates) => set((state) => ({
        strategies: state.strategies.map((s) =>
          s.name === name ? { ...s, ...updates } : s
        )
      })),

      // Loading States
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      loadingMessage: '',
      setLoadingMessage: (msg) => set({ loadingMessage: msg }),

      // Connection Status
      isConnected: false,
      setConnected: (connected) => set({ isConnected: connected }),
      connectionStatus: 'disconnected',
      setConnectionStatus: (status) => set({ connectionStatus: status }),

      // Global Reset
      resetState: () => set({
        session: defaultSession,
        ui: defaultUI,
        config: defaultConfig,
        features: defaultFeatures,
        marketData: {},
        gannLevels: [],
        signals: [],
        planetaryData: null,
        notifications: [],
        risk: defaultRisk,
        strategies: defaultStrategies,
        isLoading: false,
        loadingMessage: '',
        isConnected: false,
        connectionStatus: 'disconnected',
      }),
    }),
    {
      name: 'gann-navigator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        ui: state.ui,
        config: state.config,
        features: state.features,
        risk: state.risk,
        strategies: state.strategies,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const selectSession = (state: GlobalState) => state.session;
export const selectUI = (state: GlobalState) => state.ui;
export const selectConfig = (state: GlobalState) => state.config;
export const selectFeatures = (state: GlobalState) => state.features;
export const selectMarketData = (state: GlobalState) => state.marketData;
export const selectGannLevels = (state: GlobalState) => state.gannLevels;
export const selectSignals = (state: GlobalState) => state.signals;
export const selectNotifications = (state: GlobalState) => state.notifications;
export const selectRisk = (state: GlobalState) => state.risk;
export const selectStrategies = (state: GlobalState) => state.strategies;
export const selectIsLoading = (state: GlobalState) => state.isLoading;
export const selectConnectionStatus = (state: GlobalState) => state.connectionStatus;
