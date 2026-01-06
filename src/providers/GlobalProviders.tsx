/**
 * Global Providers Stack
 * Single initialization point for all app-wide providers
 * MUST wrap the entire application - no page-level provider overrides allowed
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useGlobalStore } from '@/lib/stores/globalStore';

// ==================== QUERY CLIENT ====================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      gcTime: 300000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ==================== THEME CONTEXT ====================

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within GlobalProviders');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { ui, setUI } = useGlobalStore();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  const applyTheme = useCallback((theme: Theme) => {
    const root = window.document.documentElement;
    let resolved: 'light' | 'dark';
    
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }
    
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setUI({ theme });
    applyTheme(theme);
  }, [setUI, applyTheme]);

  useEffect(() => {
    applyTheme(ui.theme);
  }, [ui.theme, applyTheme]);

  useEffect(() => {
    if (ui.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [ui.theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme: ui.theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ==================== AUTH CONTEXT ====================

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string | null; email: string | null; role: string };
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within GlobalProviders');
  }
  return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, setSession, logout: storeLogout } = useGlobalStore();

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulated login - replace with actual API call
    try {
      // In production, this would be an API call
      setSession({
        id: crypto.randomUUID(),
        email,
        role: 'user',
        permissions: ['view', 'trade', 'settings'],
        isAuthenticated: true,
        token: 'jwt-token-here',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      return true;
    } catch {
      return false;
    }
  }, [setSession]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const hasPermission = useCallback((permission: string): boolean => {
    return session.permissions.includes(permission) || session.role === 'admin';
  }, [session.permissions, session.role]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session.isAuthenticated,
        user: { id: session.id, email: session.email, role: session.role },
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==================== NOTIFICATION CONTEXT ====================

interface NotificationContextType {
  notifications: Array<{ id: string; type: string; title: string; message: string; read: boolean }>;
  unreadCount: number;
  addNotification: (type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within GlobalProviders');
  }
  return context;
};

const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { notifications, addNotification: storeAddNotification, markNotificationRead, clearNotifications } = useGlobalStore();

  const addNotification = useCallback((
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message: string
  ) => {
    storeAddNotification({ type, title, message });
  }, [storeAddNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead: markNotificationRead,
        clearAll: clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// ==================== ERROR BOUNDARY ====================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      console.error('Global Error:', error, errorInfo);
    } else {
      console.error('Development Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md p-6 bg-card rounded-lg border border-destructive/50 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {import.meta.env.PROD
                ? 'An unexpected error occurred. Please try refreshing the page.'
                : this.state.error?.message}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==================== LOADING OVERLAY ====================

const GlobalLoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useGlobalStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        {loadingMessage && (
          <p className="text-muted-foreground text-sm">{loadingMessage}</p>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN PROVIDER STACK ====================

interface GlobalProvidersProps {
  children: ReactNode;
}

export const GlobalProviders: React.FC<GlobalProvidersProps> = ({ children }) => {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <TooltipProvider>
                <GlobalLoadingOverlay />
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default GlobalProviders;
