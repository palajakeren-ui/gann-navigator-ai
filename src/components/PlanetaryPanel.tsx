import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Star } from "lucide-react";

interface Planet {
  name: string;
  sign: string;
  degree: number;
  note: string;
}

interface PlanetaryPanelProps {
  bullishAspects: { aspect: string; score: number | string }[];
  bearishAspects: { aspect: string; score: number | string }[];
  totalScore: number;
  planets: Planet[];
  retrograde: { planet: string; period: string; note: string }[];
}

export const PlanetaryPanel = ({
  bullishAspects,
  bearishAspects,
  totalScore,
  planets,
  retrograde,
}: PlanetaryPanelProps) => {
  const scoreColor = totalScore > 0.3 ? "text-bullish" : totalScore < -0.3 ? "text-bearish" : "text-neutral-foreground";
  const scoreLabel = totalScore > 0.3 ? "Bullish" : totalScore < -0.3 ? "Bearish" : "Neutral";
  
  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" />
          Planetary Influences & Gann Astrology
        </h2>
        <Badge variant="outline" className={scoreColor}>
          {scoreLabel} ({totalScore > 0 ? "+" : ""}{totalScore.toFixed(2)})
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Bullish Aspects
          </p>
          <div className="space-y-1">
            {bullishAspects.map((aspect, idx) => (
              <div key={idx} className="text-xs bg-bullish/10 text-bullish px-2 py-1.5 rounded flex justify-between">
                <span>{aspect.aspect}</span>
                <span className="font-semibold">+{typeof aspect.score === 'number' ? aspect.score.toFixed(2) : aspect.score}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Bearish Aspects
          </p>
          <div className="space-y-1">
            {bearishAspects.map((aspect, idx) => (
              <div key={idx} className="text-xs bg-bearish/10 text-bearish px-2 py-1.5 rounded flex justify-between">
                <span>{aspect.aspect}</span>
                <span className="font-semibold">{typeof aspect.score === 'number' ? aspect.score.toFixed(2) : aspect.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
          <Star className="w-3 h-3" /> Zodiac (Gann 360° Master Chart)
        </p>
        <div className="space-y-2">
          {planets.map((planet, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded text-xs">
              <span className="font-semibold text-foreground">{planet.name}</span>
              <span className="text-muted-foreground">{planet.sign}</span>
              <span className="font-mono text-primary">{planet.degree}°</span>
              <span className="text-muted-foreground italic">{planet.note}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Retrograde Phases</p>
        <div className="space-y-1">
          {retrograde.map((retro, idx) => (
            <div key={idx} className="text-xs bg-bearish/10 text-bearish px-3 py-2 rounded">
              <span className="font-semibold">{retro.planet} Retrograde:</span> {retro.period} → {retro.note}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

import { TrendingUp, TrendingDown } from "lucide-react";
