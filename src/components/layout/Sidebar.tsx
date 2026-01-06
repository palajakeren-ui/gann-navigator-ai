/**
 * Global Sidebar Component
 * Collapsible navigation sidebar with route-controlled active states
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useGlobalStore } from '@/lib/stores/globalStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Sparkles,
  Target,
  Brain,
  Telescope,
  Activity,
  Search,
  Shield,
  Calendar,
  BarChart3,
  Zap,
  Eye,
  AlertTriangle,
  FileText,
  BookOpen,
  Server,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  LineChart,
  Orbit,
  Gauge,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  category?: string;
}

const navItems: NavItem[] = [
  // Dashboard
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', category: 'Main' },
  { icon: TrendingUp, label: 'Charts', path: '/charts', category: 'Main' },
  { icon: Search, label: 'Scanner', path: '/scanner', category: 'Main' },
  
  // Gann Tools
  { icon: Sparkles, label: 'Gann Analysis', path: '/gann', category: 'Gann' },
  { icon: Crosshair, label: 'Gann Tools', path: '/gann-tools', category: 'Gann' },
  { icon: Hexagon, label: 'Square of 9', path: '/gann/square-of-9', category: 'Gann' },
  { icon: LineChart, label: 'Gann Angles', path: '/gann/angles', category: 'Gann' },
  
  // Astro & Cycles
  { icon: Telescope, label: 'Astro Cycles', path: '/astro', category: 'Astro' },
  { icon: Orbit, label: 'Planetary', path: '/planetary', category: 'Astro' },
  { icon: Calendar, label: 'Forecasting', path: '/forecasting', category: 'Astro' },
  
  // Technical Analysis
  { icon: Activity, label: 'Ehlers DSP', path: '/ehlers', category: 'Technical' },
  { icon: Eye, label: 'Pattern Recognition', path: '/pattern-recognition', category: 'Technical' },
  { icon: Gauge, label: 'Indicators', path: '/indicators', category: 'Technical' },
  
  // AI & ML
  { icon: Brain, label: 'AI Models', path: '/ai', category: 'AI' },
  
  // Trading
  { icon: Zap, label: 'Trading Mode', path: '/trading-mode', category: 'Trading' },
  { icon: Zap, label: 'HFT', path: '/hft', category: 'Trading' },
  { icon: Target, label: 'Options', path: '/options', category: 'Trading' },
  
  // Risk & Analysis
  { icon: Shield, label: 'Risk Manager', path: '/risk', category: 'Risk' },
  { icon: BarChart3, label: 'Backtest', path: '/backtest', category: 'Risk' },
  { icon: AlertTriangle, label: 'Slippage/Spike', path: '/slippage-spike', category: 'Risk' },
  
  // Reports
  { icon: FileText, label: 'Reports', path: '/reports', category: 'Reports' },
  { icon: BookOpen, label: 'Journal', path: '/journal', category: 'Reports' },
  
  // System
  { icon: Server, label: 'Backend API', path: '/backend-api', category: 'System' },
  { icon: Settings, label: 'Settings', path: '/settings', category: 'System' },
];

// Group nav items by category
const groupedItems = navItems.reduce((acc, item) => {
  const category = item.category || 'Other';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(item);
  return acc;
}, {} as Record<string, NavItem[]>);

export const Sidebar: React.FC = () => {
  const { ui, toggleSidebar, connectionStatus } = useGlobalStore();
  const location = useLocation();
  const isCollapsed = ui.sidebarCollapsed;

  const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const content = (
      <NavLink
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          isActive
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : 'text-muted-foreground'
        )}
      >
        <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="z-[100]">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card/50 backdrop-blur-md border-r border-border/40 z-40',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Header */}
      <div className={cn('p-4 border-b border-border/40', isCollapsed && 'px-2')}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Gann Navigator
              </h1>
              <p className="text-xs text-muted-foreground">v3.0 Pro</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 h-[calc(100%-8rem)]">
        <div className={cn('p-3 space-y-4', isCollapsed && 'px-2')}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => (
                  <NavItemComponent key={item.path} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className={cn('absolute bottom-0 left-0 right-0 p-4 border-t border-border/40 bg-card/50', isCollapsed && 'px-2')}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              connectionStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-destructive'
            )}
          />
          {!isCollapsed && (
            <span className="text-xs text-muted-foreground">
              {connectionStatus === 'connected' ? 'System Online' : 'Disconnected'}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground mt-1">
            {new Date().toLocaleTimeString()}
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
