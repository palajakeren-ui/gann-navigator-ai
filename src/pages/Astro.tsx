import { PlanetaryPanel } from "@/components/PlanetaryPanel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Star } from "lucide-react";

const astroCycles = [
  { planet: "Mercury", cycle: "Retrograde", impact: "High", date: "Dec 13-25", description: "Communication disruptions expected" },
  { planet: "Venus", cycle: "Direct", impact: "Medium", date: "Ongoing", description: "Market sentiment positive" },
  { planet: "Mars", cycle: "Direct", impact: "High", date: "Ongoing", description: "Increased volatility" },
  { planet: "Jupiter", cycle: "Direct", impact: "Low", date: "Ongoing", description: "Long-term bullish" },
];

const Astro = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Astro Cycles</h1>
        <p className="text-muted-foreground">Planetary cycles and market correlation analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 glass-card text-center animate-scale-in">
          <Sun className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="font-bold text-foreground mb-2">Solar Cycle</h3>
          <p className="text-2xl font-bold gradient-text mb-1">Day 15</p>
          <p className="text-sm text-muted-foreground">Rising phase - Bullish bias</p>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
          <Moon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="font-bold text-foreground mb-2">Lunar Phase</h3>
          <p className="text-2xl font-bold gradient-text mb-1">Waxing</p>
          <p className="text-sm text-muted-foreground">Accumulation period active</p>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Star className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className="font-bold text-foreground mb-2">Planetary Hour</h3>
          <p className="text-2xl font-bold gradient-text mb-1">Jupiter</p>
          <p className="text-sm text-muted-foreground">Expansion and growth</p>
        </Card>
      </div>

      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Active Planetary Cycles</h2>
        <div className="space-y-4">
          {astroCycles.map((cycle, idx) => (
            <div 
              key={cycle.planet} 
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div>
                <h3 className="font-bold text-foreground">{cycle.planet}</h3>
                <p className="text-sm text-muted-foreground">{cycle.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{cycle.date}</p>
                  <Badge variant={cycle.cycle === "Retrograde" ? "destructive" : "default"}>
                    {cycle.cycle}
                  </Badge>
                </div>
                <Badge variant={cycle.impact === "High" ? "destructive" : cycle.impact === "Medium" ? "default" : "secondary"}>
                  {cycle.impact}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <PlanetaryPanel 
        bullishAspects={[
          { aspect: "Jupiter Trine Venus", score: 0.85 },
          { aspect: "Sun Conjunct Mercury", score: 0.72 },
        ]}
        bearishAspects={[
          { aspect: "Mars Square Saturn", score: -0.68 },
        ]}
        totalScore={0.65}
        planets={[
          { name: "Sun", sign: "Sagittarius", degree: 15, note: "Bullish influence" },
          { name: "Moon", sign: "Cancer", degree: 23, note: "Neutral" },
        ]}
        retrograde={[
          { planet: "Mercury", period: "Dec 13-25", note: "Communication disruptions" },
        ]}
      />
    </div>
  );
};

export default Astro;
