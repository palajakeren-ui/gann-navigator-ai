/**
 * Centralized API Client
 * Single source for all HTTP requests with interceptors, caching, and error handling
 */

import { useGlobalStore } from '../stores/globalStore';

// ==================== TYPES ====================

export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  timestamp: Date;
  cached?: boolean;
}

export interface APIError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTime?: number;
}

// ==================== CACHE ====================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_CACHE_TIME = 60000; // 1 minute

const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = <T>(key: string, data: T, cacheTime: number = DEFAULT_CACHE_TIME): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + cacheTime,
  });
};

export const clearCache = (): void => {
  cache.clear();
};

// ==================== INTERCEPTORS ====================

type RequestInterceptor = (config: RequestInit) => RequestInit;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export const addRequestInterceptor = (interceptor: RequestInterceptor): void => {
  requestInterceptors.push(interceptor);
};

export const addResponseInterceptor = (interceptor: ResponseInterceptor): void => {
  responseInterceptors.push(interceptor);
};

// Default auth interceptor
addRequestInterceptor((config) => {
  const { session } = useGlobalStore.getState();
  if (session.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${session.token}`,
    };
  }
  return config;
});

// ==================== ERROR HANDLING ====================

const normalizeError = (error: unknown, status: number = 500): APIError => {
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      status,
      details: { stack: import.meta.env.DEV ? error.stack : undefined },
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    const e = error as Record<string, unknown>;
    return {
      code: (e.code as string) || 'API_ERROR',
      message: (e.message as string) || 'An error occurred',
      status: (e.status as number) || status,
      details: e.details as Record<string, unknown>,
    };
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: String(error),
    status,
  };
};

// ==================== API CLIENT ====================

class APIClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private maxRetries: number;

  constructor() {
    const { config } = useGlobalStore.getState();
    this.baseUrl = config.apiBaseUrl;
    this.defaultTimeout = config.timeout;
    this.maxRetries = config.maxRetries;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const {
      headers = {},
      timeout = this.defaultTimeout,
      retries = this.maxRetries,
      cache: useCache = false,
      cacheTime = DEFAULT_CACHE_TIME,
    } = config;

    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body)}`;
    
    // Check cache for GET requests
    if (useCache && method === 'GET') {
      const cached = getCached<T>(cacheKey);
      if (cached) {
        return {
          data: cached,
          status: 200,
          timestamp: new Date(),
          cached: true,
        };
      }
    }

    let requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    // Apply request interceptors
    for (const interceptor of requestInterceptors) {
      requestConfig = interceptor(requestConfig);
    }

    // Retry logic
    let lastError: APIError | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        let response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Apply response interceptors
        for (const interceptor of responseInterceptors) {
          response = await interceptor(response);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw normalizeError(errorData, response.status);
        }

        const data = await response.json() as T;

        // Cache successful GET requests
        if (useCache && method === 'GET') {
          setCache(cacheKey, data, cacheTime);
        }

        return {
          data,
          status: response.status,
          timestamp: new Date(),
          cached: false,
        };
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          lastError = {
            code: 'TIMEOUT',
            message: 'Request timed out',
            status: 408,
          };
        } else {
          lastError = normalizeError(error);
        }

        // Don't retry on client errors (4xx)
        if (lastError.status >= 400 && lastError.status < 500) {
          throw lastError;
        }

        // Wait before retrying
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || { code: 'UNKNOWN', message: 'Request failed', status: 500 };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('POST', endpoint, body, config);
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('PUT', endpoint, body, config);
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('PATCH', endpoint, body, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

// Singleton instance
export const apiClient = new APIClient();

// ==================== SPECIFIC API SERVICES ====================

export const marketAPI = {
  getQuote: (symbol: string) => 
    apiClient.get<{ price: number; change: number }>(`/market/quote/${symbol}`, { cache: true, cacheTime: 5000 }),
  
  getHistory: (symbol: string, timeframe: string, limit: number = 100) =>
    apiClient.get<Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }>>(
      `/market/history/${symbol}?timeframe=${timeframe}&limit=${limit}`,
      { cache: true, cacheTime: 30000 }
    ),
  
  getMarkets: () =>
    apiClient.get<Array<{ symbol: string; name: string; price: number; change: number }>>('/market/list', { cache: true }),
};

export const gannAPI = {
  calculateSquareOf9: (price: number) =>
    apiClient.post<{ levels: Array<{ degree: number; price: number; type: string }> }>('/gann/square-of-9', { price }),
  
  calculateAngles: (pivotPrice: number, pivotTime: number) =>
    apiClient.post<{ angles: Array<{ ratio: string; angle: number; price: number }> }>('/gann/angles', { pivotPrice, pivotTime }),
  
  calculateTimeCycles: (startDate: string) =>
    apiClient.post<{ cycles: Array<{ cycle: string; days: number; targetDate: string }> }>('/gann/time-cycles', { startDate }),
};

export const astroAPI = {
  getPlanetaryPositions: (date: string) =>
    apiClient.get<{ planets: Array<{ name: string; sign: string; degree: number; retrograde: boolean }> }>(
      `/astro/positions?date=${date}`,
      { cache: true, cacheTime: 3600000 }
    ),
  
  getAspects: (date: string) =>
    apiClient.get<{ aspects: Array<{ planet1: string; planet2: string; type: string; influence: string }> }>(
      `/astro/aspects?date=${date}`,
      { cache: true, cacheTime: 3600000 }
    ),
  
  getLunarPhase: (date: string) =>
    apiClient.get<{ phase: string; percentage: number; influence: string }>(
      `/astro/lunar?date=${date}`,
      { cache: true, cacheTime: 3600000 }
    ),
};

export const aiAPI = {
  getPrediction: (symbol: string, timeframe: string) =>
    apiClient.post<{ prediction: { direction: string; confidence: number; price: number } }>('/ai/predict', { symbol, timeframe }),
  
  getSignal: (symbol: string, indicators: Record<string, number>) =>
    apiClient.post<{ signal: { direction: string; strength: number; entry: number; stopLoss: number; takeProfit: number } }>(
      '/ai/signal',
      { symbol, indicators }
    ),
};

export const backtestAPI = {
  run: (strategy: string, params: Record<string, unknown>) =>
    apiClient.post<{ results: { trades: number; winRate: number; profit: number; drawdown: number } }>(
      '/backtest/run',
      { strategy, params }
    ),
};
