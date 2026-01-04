import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Moon, Sun, AlertTriangle } from "lucide-react";

interface PlanetaryCardProps {
  planetaryData: {
    planets: Array<{
      name: string;
      sign: string;
      degree: number;
      retrograde: boolean;
      influence: string;
    }>;
    aspects: Array<{
      planet1: string;
      planet2: string;
      aspect: string;
      angle: number;
      orb: number;
      influence: string;
      score: number;
    }>;
    lunarPhase: {
      phase: string;
      percentage: number;
      influence: string;
    };
    totalScore: number;
  };
}

export const PlanetaryCard = ({ planetaryData }: PlanetaryCardProps) => {
  const { planets, aspects, lunarPhase, totalScore } = planetaryData;

  const bullishAspects = aspects.filter(a => a.influence === 'bullish');
  const bearishAspects = aspects.filter(a => a.influence === 'bearish');
  const retrogradeWarnings = planets.filter(p => p.retrograde);

  return (
    <Card className="hover-glow transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Planetary Influences
          </CardTitle>
          <Badge 
            variant="outline" 
            className={totalScore >= 0 ? 'text-success border-success' : 'text-destructive border-destructive'}
          >
            {totalScore >= 0 ? '+' : ''}{totalScore.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lunar Phase */}
        <div className="p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Lunar Phase</span>
            <Badge variant={lunarPhase.influence === 'bullish' ? 'default' : 'secondary'}>
              {lunarPhase.phase}
            </Badge>
          </div>
          <Progress value={lunarPhase.percentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{lunarPhase.percentage}% illumination</p>
        </div>

        {/* Aspects Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Bullish Aspects</p>
            {bullishAspects.map((aspect, idx) => (
              <div key={idx} className="text-xs">
                <p className="font-semibold text-success">
                  {aspect.planet1}-{aspect.planet2} {aspect.aspect}
                </p>
                <p className="text-muted-foreground">+{aspect.score.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="p-3 bg-destructive/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Bearish Aspects</p>
            {bearishAspects.map((aspect, idx) => (
              <div key={idx} className="text-xs">
                <p className="font-semibold text-destructive">
                  {aspect.planet1}-{aspect.planet2} {aspect.aspect}
                </p>
                <p className="text-muted-foreground">{aspect.score.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Retrograde Warnings */}
        {retrogradeWarnings.length > 0 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold text-warning">Retrograde Phases</span>
            </div>
            <div className="space-y-1">
              {retrogradeWarnings.map((planet, idx) => (
                <p key={idx} className="text-xs text-muted-foreground">
                  <span className="font-semibold">{planet.name}</span> Rx in {planet.sign} ({planet.degree}°)
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Planet Positions */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground mb-2">Key Planets</p>
          <div className="grid grid-cols-2 gap-2">
            {planets.slice(0, 6).map((planet, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-2 rounded text-xs ${
                  planet.influence === 'bullish' ? 'bg-success/10' :
                  planet.influence === 'bearish' ? 'bg-destructive/10' :
                  'bg-secondary/30'
                }`}
              >
                <span className="font-semibold">{planet.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">{planet.sign}</span>
                  {planet.retrograde && <span className="text-warning">Rx</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
