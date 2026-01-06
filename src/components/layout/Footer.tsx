/**
 * Global Footer Component
 */

import React from 'react';
import { useGlobalStore } from '@/lib/stores/globalStore';
import { Activity, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { connectionStatus } = useGlobalStore();

  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Brand */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Gann Navigator
            </span>
            <span className="text-xs text-muted-foreground">v3.0</span>
          </div>

          {/* Center - Status */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-success animate-pulse'
                    : 'bg-destructive'
                }`}
              />
              <span>
                {connectionStatus === 'connected' ? 'Live Data' : 'Offline'}
              </span>
            </div>
            <span>|</span>
            <span>Last update: {new Date().toLocaleTimeString()}</span>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="/docs"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Gann Navigator
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
