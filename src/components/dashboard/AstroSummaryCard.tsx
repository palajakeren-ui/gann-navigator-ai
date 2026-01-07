/**
 * Astro Summary Card Component
 * Displays condensed astrological data and market sentiment
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Moon, Sun, Star, AlertTriangle, Telescope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AstroSummaryCardProps {
  astroData: {
    positions: Array<{ planet: string; sign: string; degree: number; retrograde: boolean }>;
    aspects: Array<{ planet1: string; planet2: string; aspect: string; influence: string; strength: number }>;
    lunarPhase: { phase: string; percentage: number; illumination: number; influence: string };
    sentiment: { score: number; direction: string; confidence: number };
    retrogrades: Array<{ planet: string; isRetrograde: boolean }>;
    currentHour: { planet: string; quality: string } | null;
  };
  className?: string;
}

export const AstroSummaryCard: React.FC<AstroSummaryCardProps> = ({
  astroData,
  className
}) => {
  const { positions, aspects, lunarPhase, sentiment, retrogrades, currentHour } = astroData;
  
  const retrogradeCount = retrogrades.filter(r => r.isRetrograde).length;
  const bullishAspects = aspects.filter(a => a.influence === 'bullish');
  const bearishAspects = aspects.filter(a => a.influence === 'bearish');

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Telescope className="w-5 h-5 text-accent" />
          Astro Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sentiment Score */}
        <div className="p-4 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Planetary Sentiment</span>
            <Badge 
              variant="outline" 
              className={cn(
                sentiment.direction === 'bullish' ? 'text-success border-success' :
                sentiment.direction === 'bearish' ? 'text-destructive border-destructive' :
                'text-muted-foreground'
              )}
            >
              {sentiment.direction.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={sentiment.score} className="flex-1 h-3" />
            <span className="text-lg font-bold text-foreground">{sentiment.score}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Confidence: {sentiment.confidence.toFixed(0)}%
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <Moon className="w-6 h-6 mx-auto mb-1 text-blue-400" />
            <p className="text-xs text-muted-foreground mb-1">Lunar Phase</p>
            <p className="text-sm font-semibold text-foreground">{lunarPhase.phase}</p>
            <p className="text-xs text-muted-foreground">{lunarPhase.illumination}% lit</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <Star className="w-6 h-6 mx-auto mb-1 text-accent" />
            <p className="text-xs text-muted-foreground mb-1">Aspects</p>
            <p className="text-sm font-semibold text-success">+{bullishAspects.length}</p>
            <p className="text-sm font-semibold text-destructive">-{bearishAspects.length}</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-warning" />
            <p className="text-xs text-muted-foreground mb-1">Retrogrades</p>
            <p className="text-lg font-bold text-warning">{retrogradeCount}</p>
          </div>
        </div>

        {/* Current Planetary Hour */}
        {currentHour && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold text-foreground">Planetary Hour: {currentHour.planet}</span>
            </div>
            <p className={cn(
              'text-xs',
              currentHour.quality === 'bullish' ? 'text-success' :
              currentHour.quality === 'bearish' ? 'text-destructive' :
              'text-muted-foreground'
            )}>
              {currentHour.quality === 'bullish' ? 'Favorable for expansion' :
               currentHour.quality === 'bearish' ? 'Exercise caution' :
               'Neutral energy'}
            </p>
          </div>
        )}

        {/* Key Aspects */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Aspects</h4>
          <div className="space-y-1">
            {aspects.slice(0, 4).map((aspect, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                <span className="text-xs text-foreground">
                  {aspect.planet1} {aspect.aspect.toLowerCase()} {aspect.planet2}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-xs',
                    aspect.influence === 'bullish' ? 'text-success border-success' :
                    aspect.influence === 'bearish' ? 'text-destructive border-destructive' :
                    'text-muted-foreground'
                  )}
                >
                  {aspect.strength}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Major Planets */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Planetary Positions</h4>
          <div className="grid grid-cols-2 gap-2">
            {positions.slice(0, 6).map((planet, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                <span className="text-xs text-foreground">{planet.planet}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{planet.sign} {planet.degree}°</span>
                  {planet.retrograde && <span className="text-warning text-xs">℞</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Influence */}
        <p className="text-xs text-muted-foreground italic">{lunarPhase.influence}</p>
      </CardContent>
    </Card>
  );
};

export default AstroSummaryCard;
