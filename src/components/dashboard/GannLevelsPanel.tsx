/**
 * Gann Levels Panel Component
 * Displays real-time Gann support/resistance levels
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { GannLevel } from '@/lib/calculations/gannEngine';
import { cn } from '@/lib/utils';

interface GannLevelsPanelProps {
  levels: GannLevel[];
  currentPrice: number;
  nearestSupport: GannLevel | null;
  nearestResistance: GannLevel | null;
  className?: string;
}

export const GannLevelsPanel: React.FC<GannLevelsPanelProps> = ({
  levels,
  currentPrice,
  nearestSupport,
  nearestResistance,
  className
}) => {
  const getTypeColor = (type: GannLevel['type']) => {
    switch (type) {
      case 'support': return 'text-success border-success';
      case 'resistance': return 'text-destructive border-destructive';
      case 'cardinal': return 'text-primary border-primary';
      case 'ordinal': return 'text-accent border-accent';
      case 'pivot': return 'text-warning border-warning';
      default: return 'text-muted-foreground border-muted';
    }
  };

  const getSignificanceColor = (sig: GannLevel['significance']) => {
    switch (sig) {
      case 'high': return 'bg-primary/20';
      case 'medium': return 'bg-secondary/50';
      case 'low': return 'bg-secondary/30';
      default: return '';
    }
  };

  // Split levels into support and resistance
  const supports = levels.filter(l => l.price < currentPrice).sort((a, b) => b.price - a.price).slice(0, 5);
  const resistances = levels.filter(l => l.price > currentPrice).sort((a, b) => a.price - b.price).slice(0, 5);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Gann Price Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Price */}
        <div className="p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
          <p className="text-2xl font-bold text-primary font-mono">
            ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Nearest Levels */}
        <div className="grid grid-cols-2 gap-3">
          {nearestSupport && (
            <div className="p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="w-4 h-4 text-success" />
                <p className="text-xs text-muted-foreground">Nearest Support</p>
              </div>
              <p className="text-lg font-bold text-success font-mono">
                ${nearestSupport.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{nearestSupport.description}</p>
            </div>
          )}
          {nearestResistance && (
            <div className="p-3 bg-destructive/10 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-destructive" />
                <p className="text-xs text-muted-foreground">Nearest Resistance</p>
              </div>
              <p className="text-lg font-bold text-destructive font-mono">
                ${nearestResistance.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{nearestResistance.description}</p>
            </div>
          )}
        </div>

        {/* Support Levels */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-success" />
            Support Levels
          </h4>
          <div className="space-y-1">
            {supports.map((level, idx) => (
              <div key={idx} className={cn('flex items-center justify-between p-2 rounded', getSignificanceColor(level.significance))}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn('text-xs', getTypeColor(level.type))}>
                    {level.degree}°
                  </Badge>
                  <span className="text-sm font-mono text-foreground">
                    ${level.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={level.strength} className="w-12 h-1.5" />
                  <span className="text-xs text-muted-foreground">{level.strength.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resistance Levels */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-destructive" />
            Resistance Levels
          </h4>
          <div className="space-y-1">
            {resistances.map((level, idx) => (
              <div key={idx} className={cn('flex items-center justify-between p-2 rounded', getSignificanceColor(level.significance))}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn('text-xs', getTypeColor(level.type))}>
                    {level.degree}°
                  </Badge>
                  <span className="text-sm font-mono text-foreground">
                    ${level.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={level.strength} className="w-12 h-1.5" />
                  <span className="text-xs text-muted-foreground">{level.strength.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GannLevelsPanel;
