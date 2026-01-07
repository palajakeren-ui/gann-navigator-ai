/**
 * Live Trading Signal Card Component
 * Displays real-time trading signals with entry, SL, TP
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { TradingSignal, getSignalColor, getSignalBadgeVariant } from '@/lib/calculations/signalGenerator';
import { cn } from '@/lib/utils';

interface LiveSignalCardProps {
  signal: TradingSignal | null;
  showSources?: boolean;
  className?: string;
}

export const LiveSignalCard: React.FC<LiveSignalCardProps> = ({
  signal,
  showSources = true,
  className
}) => {
  if (!signal) {
    return (
      <Card className={cn('', className)}>
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Calculating signal...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isBullish = signal.direction.includes('buy');
  const isBearish = signal.direction.includes('sell');

  return (
    <Card className={cn(
      'border-2',
      isBullish ? 'border-success/50 bg-success/5' : isBearish ? 'border-destructive/50 bg-destructive/5' : 'border-border',
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className={cn('w-5 h-5', isBullish ? 'text-success' : isBearish ? 'text-destructive' : 'text-muted-foreground')} />
            Trading Signal
          </CardTitle>
          <Badge variant={getSignalBadgeVariant(signal.direction)} className={isBullish ? 'bg-success' : ''}>
            {signal.direction.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Signal Strength & Confidence */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Strength</p>
            <div className="flex items-center gap-2">
              <Progress value={signal.strength} className="h-2 flex-1" />
              <span className="text-sm font-mono">{signal.strength.toFixed(0)}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <Progress value={signal.confidence} className="h-2 flex-1" />
              <span className="text-sm font-mono">{signal.confidence.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Trade Setup */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Entry</p>
            <p className="text-lg font-bold font-mono text-foreground">
              ${signal.entry.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-destructive/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
            <p className="text-lg font-bold font-mono text-destructive">
              ${signal.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
            <p className="text-lg font-bold font-mono text-success">
              ${signal.takeProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Risk/Reward</p>
            <p className="text-lg font-bold font-mono text-primary">
              1:{signal.riskReward.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Signal Sources */}
        {showSources && signal.sources.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Signal Sources</p>
            <div className="grid grid-cols-2 gap-2">
              {signal.sources.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                  <span className="text-xs text-foreground">{source.name}</span>
                  <div className="flex items-center gap-2">
                    {source.direction.includes('buy') ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : source.direction.includes('sell') ? (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    ) : (
                      <Activity className="w-3 h-3 text-muted-foreground" />
                    )}
                    <span className="text-xs font-mono">{source.score.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reasoning */}
        {signal.reasoning.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Analysis</p>
            <ul className="space-y-1">
              {signal.reasoning.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="text-xs text-foreground flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 text-accent flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground text-right">
          Updated: {signal.timestamp.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default LiveSignalCard;
