import { PlanetaryPanel } from "@/components/PlanetaryPanel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Moon, Sun, Star, Telescope, Calendar, Clock, 
  TrendingUp, TrendingDown, AlertTriangle, RefreshCw,
  CircleDot, Orbit
} from "lucide-react";
import { useState } from "react";

const planetaryPositions = [
  { planet: "Sun", symbol: "☉", sign: "Sagittarius", degree: 21, house: 9, note: "Bullish expansion", impact: "positive" },
  { planet: "Moon", symbol: "☽", sign: "Cancer", degree: 15, house: 4, note: "Emotional support", impact: "positive" },
  { planet: "Mercury", symbol: "☿", sign: "Capricorn", degree: 5, house: 10, note: "Retrograde alert", impact: "negative" },
  { planet: "Venus", symbol: "♀", sign: "Scorpio", degree: 28, house: 8, note: "Value transformation", impact: "neutral" },
  { planet: "Mars", symbol: "♂", sign: "Leo", degree: 12, house: 5, note: "Aggressive momentum", impact: "positive" },
  { planet: "Jupiter", symbol: "♃", sign: "Taurus", degree: 8, house: 2, note: "Financial growth", impact: "positive" },
  { planet: "Saturn", symbol: "♄", sign: "Pisces", degree: 3, house: 12, note: "Karmic pressure", impact: "negative" },
  { planet: "Uranus", symbol: "♅", sign: "Taurus", degree: 23, house: 2, note: "Sudden changes", impact: "neutral" },
  { planet: "Neptune", symbol: "♆", sign: "Pisces", degree: 25, house: 12, note: "Illusion/intuition", impact: "neutral" },
  { planet: "Pluto", symbol: "♇", sign: "Aquarius", degree: 0, house: 11, note: "Deep transformation", impact: "neutral" },
];

const aspects = [
  { planet1: "Jupiter", planet2: "Venus", aspect: "Trine", angle: 120, effect: "Bullish", strength: 92, description: "Strong financial support" },
  { planet1: "Sun", planet2: "Mercury", aspect: "Conjunction", angle: 0, effect: "Neutral", strength: 78, description: "Mental clarity" },
  { planet1: "Mars", planet2: "Saturn", aspect: "Square", angle: 90, effect: "Bearish", strength: 85, description: "Resistance and delays" },
  { planet1: "Mercury", planet2: "Neptune", aspect: "Sextile", angle: 60, effect: "Bullish", strength: 72, description: "Intuitive insights" },
  { planet1: "Moon", planet2: "Pluto", aspect: "Opposition", angle: 180, effect: "Volatile", strength: 68, description: "Emotional intensity" },
];

const lunarPhases = [
  { phase: "New Moon", date: "Dec 12, 2024", sign: "Sagittarius", impact: "Start new positions" },
  { phase: "First Quarter", date: "Dec 19, 2024", sign: "Pisces", impact: "Build momentum" },
  { phase: "Full Moon", date: "Dec 26, 2024", sign: "Cancer", impact: "Peak activity" },
  { phase: "Last Quarter", date: "Jan 3, 2025", sign: "Libra", impact: "Take profits" },
];

const retrogrades = [
  { planet: "Mercury", status: "Direct", period: "Next: Jan 15 - Feb 4, 2025", note: "Communication clear", impact: "positive" },
  { planet: "Venus", status: "Direct", period: "Next: Mar 2 - Apr 13, 2025", note: "Value steady", impact: "positive" },
  { planet: "Mars", status: "Retrograde", period: "Dec 6, 2024 - Feb 24, 2025", note: "Review strategies", impact: "negative" },
  { planet: "Jupiter", status: "Direct", period: "Next: Nov 11, 2025", note: "Expansion active", impact: "positive" },
  { planet: "Saturn", status: "Direct", period: "Next: Jun 29, 2025", note: "Discipline maintained", impact: "positive" },
];

const astroCycles = [
  { name: "Jupiter Cycle", progress: 23, total: "12 years", current: "Year 3", phase: "Growth" },
  { name: "Saturn Cycle", progress: 45, total: "29.5 years", current: "Year 13", phase: "Maturity" },
  { name: "Uranus Cycle", progress: 28, total: "84 years", current: "Year 23", phase: "Innovation" },
  { name: "Neptune Cycle", progress: 15, total: "165 years", current: "Year 25", phase: "Dissolution" },
];

const Astro = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const totalScore = 0.65;
  const bullishCount = aspects.filter(a => a.effect === "Bullish").length;
  const bearishCount = aspects.filter(a => a.effect === "Bearish").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Telescope className="w-8 h-8 text-accent" />
            Astro Cycles
          </h1>
          <p className="text-muted-foreground">Planetary cycles, aspects & market correlation analysis</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Update Ephemeris
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 glass-card text-center animate-scale-in">
          <Sun className="w-12 h-12 mx-auto mb-4 text-warning" />
          <h3 className="font-bold text-foreground mb-2">Solar Position</h3>
          <p className="text-2xl font-bold gradient-text mb-1">Sagittarius 21°</p>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Bullish Phase
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
          <Moon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="font-bold text-foreground mb-2">Lunar Phase</h3>
          <p className="text-2xl font-bold gradient-text mb-1">Waxing Gibbous</p>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            82% Illumination
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Star className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className="font-bold text-foreground mb-2">Planetary Score</h3>
          <p className={`text-2xl font-bold ${totalScore > 0.5 ? 'text-success' : totalScore < -0.5 ? 'text-destructive' : 'text-warning'}`}>
            +{(totalScore * 100).toFixed(0)}%
          </p>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            {bullishCount} Bullish / {bearishCount} Bearish
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-warning" />
          <h3 className="font-bold text-foreground mb-2">Retrogrades</h3>
          <p className="text-2xl font-bold text-warning mb-1">{retrogrades.filter(r => r.status === "Retrograde").length}</p>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            Active Now
          </Badge>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="aspects">Aspects</TabsTrigger>
          <TabsTrigger value="lunar">Lunar</TabsTrigger>
          <TabsTrigger value="cycles">Cycles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlanetaryPanel 
              bullishAspects={aspects.filter(a => a.effect === "Bullish").map(a => ({ 
                aspect: `${a.planet1}–${a.planet2} ${a.aspect}`, 
                score: a.strength / 100 
              }))}
              bearishAspects={aspects.filter(a => a.effect === "Bearish").map(a => ({ 
                aspect: `${a.planet1}–${a.planet2} ${a.aspect}`, 
                score: -(a.strength / 100)
              }))}
              totalScore={totalScore}
              planets={planetaryPositions.slice(0, 5).map(p => ({
                name: p.planet,
                sign: p.sign,
                degree: p.degree,
                note: p.note
              }))}
              retrograde={retrogrades.filter(r => r.status === "Retrograde").map(r => ({
                planet: r.planet,
                period: r.period,
                note: r.note
              }))}
            />

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Lunar Phases
              </h3>
              <div className="space-y-3">
                {lunarPhases.map((phase, idx) => (
                  <div key={phase.phase} className="p-4 rounded-lg bg-secondary/50 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className={`w-5 h-5 ${
                          phase.phase.includes("Full") ? "text-warning" : 
                          phase.phase.includes("New") ? "text-muted-foreground" : "text-blue-400"
                        }`} />
                        <span className="font-semibold text-foreground">{phase.phase}</span>
                      </div>
                      <Badge variant="outline">{phase.sign}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{phase.date}</p>
                    <p className="text-xs text-accent mt-1">{phase.impact}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Planetary Positions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Planet</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Sign</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planetaryPositions.map((planet) => (
                  <TableRow key={planet.planet}>
                    <TableCell className="font-semibold">{planet.planet}</TableCell>
                    <TableCell className="text-xl">{planet.symbol}</TableCell>
                    <TableCell>{planet.sign}</TableCell>
                    <TableCell className="font-mono">{planet.degree}°</TableCell>
                    <TableCell>{planet.house}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{planet.note}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          planet.impact === "positive" ? "text-success border-success" :
                          planet.impact === "negative" ? "text-destructive border-destructive" :
                          "text-muted-foreground"
                        }
                      >
                        {planet.impact}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="aspects" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Active Planetary Aspects</h3>
            <div className="space-y-4">
              {aspects.map((aspect, idx) => (
                <div 
                  key={`${aspect.planet1}-${aspect.planet2}`} 
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        {aspect.planet1}
                      </Badge>
                      <Orbit className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        {aspect.planet2}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{aspect.aspect}</p>
                      <p className="text-xs text-muted-foreground">{aspect.angle}° — {aspect.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Progress value={aspect.strength} className="w-24 mb-1" />
                      <p className="text-xs text-muted-foreground">{aspect.strength}% strength</p>
                    </div>
                    <Badge
                      variant={aspect.effect === "Bullish" ? "default" : aspect.effect === "Bearish" ? "destructive" : "secondary"}
                      className={aspect.effect === "Bullish" ? "bg-success" : ""}
                    >
                      {aspect.effect}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="lunar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Lunar Calendar</h3>
              <div className="space-y-4">
                {lunarPhases.map((phase, idx) => (
                  <div key={phase.phase} className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{phase.phase}</span>
                      <Badge variant="outline">{phase.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Sign: {phase.sign}</p>
                    <p className="text-sm text-accent mt-1">{phase.impact}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Retrograde Status</h3>
              <div className="space-y-3">
                {retrogrades.map((ret, idx) => (
                  <div key={ret.planet} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${ret.status === "Retrograde" ? "bg-warning animate-pulse" : "bg-success"}`} />
                      <div>
                        <p className="font-semibold text-foreground">{ret.planet}</p>
                        <p className="text-xs text-muted-foreground">{ret.period}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={ret.status === "Retrograde" ? "destructive" : "default"}>
                        {ret.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{ret.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Long-Term Planetary Cycles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {astroCycles.map((cycle, idx) => (
                <div key={cycle.name} className="p-4 rounded-lg border border-border bg-secondary/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-foreground">{cycle.name}</span>
                    <Badge variant="outline">{cycle.phase}</Badge>
                  </div>
                  <Progress value={cycle.progress} className="mb-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{cycle.current}</span>
                    <span className="text-muted-foreground">Total: {cycle.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Astro;
