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
import { useLiveData } from "@/hooks/useLiveData";
import AstroSummaryCard from "@/components/dashboard/AstroSummaryCard";

const Astro = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { astroData, timeCycles, marketData, refresh } = useLiveData({
    symbol: 'BTCUSDT',
    basePrice: 104525
  });

  const totalScore = astroData.marketSentiment.strength;
  const bullishCount = astroData.aspects.filter(a => a.influence > 0).length;
  const bearishCount = astroData.aspects.filter(a => a.influence < 0).length;

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
        <Button variant="outline" className="gap-2" onClick={refresh}>
          <RefreshCw className="w-4 h-4" />
          Update Ephemeris
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 glass-card text-center animate-scale-in">
          <Sun className="w-12 h-12 mx-auto mb-4 text-warning" />
          <h3 className="font-bold text-foreground mb-2">Solar Position</h3>
          <p className="text-2xl font-bold gradient-text mb-1">
            {astroData.planets[0]?.sign || 'Sagittarius'} {astroData.planets[0]?.degree?.toFixed(0) || 21}°
          </p>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            {astroData.marketSentiment.direction === 'bullish' ? 'Bullish Phase' : 'Bearish Phase'}
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
          <Moon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="font-bold text-foreground mb-2">Lunar Phase</h3>
          <p className="text-2xl font-bold gradient-text mb-1">{astroData.lunarPhase.name}</p>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            {(astroData.lunarPhase.illumination * 100).toFixed(0)}% Illumination
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Star className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className="font-bold text-foreground mb-2">Planetary Score</h3>
          <p className={`text-2xl font-bold ${totalScore > 0 ? 'text-success' : totalScore < 0 ? 'text-destructive' : 'text-warning'}`}>
            {totalScore > 0 ? '+' : ''}{(totalScore * 100).toFixed(0)}%
          </p>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            {bullishCount} Bullish / {bearishCount} Bearish
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-warning" />
          <h3 className="font-bold text-foreground mb-2">Retrogrades</h3>
          <p className="text-2xl font-bold text-warning mb-1">{astroData.retrogrades.length}</p>
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
              bullishAspects={astroData.aspects.filter(a => a.influence > 0).map(a => ({ 
                aspect: `${a.planet1}–${a.planet2} ${a.type}`, 
                score: a.influence 
              }))}
              bearishAspects={astroData.aspects.filter(a => a.influence < 0).map(a => ({ 
                aspect: `${a.planet1}–${a.planet2} ${a.type}`, 
                score: a.influence
              }))}
              totalScore={totalScore}
              planets={astroData.planets.slice(0, 5).map(p => ({
                name: p.name,
                sign: p.sign,
                degree: p.degree,
                note: p.retrograde ? 'Retrograde' : 'Direct'
              }))}
              retrograde={astroData.retrogrades.map(r => ({
                planet: r.planet,
                period: `Until ${r.endDate?.toLocaleDateString() || 'N/A'}`,
                note: r.impact
              }))}
            />

            <AstroSummaryCard 
              astroData={astroData}
              timeCycles={timeCycles}
            />
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Planetary Positions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Planet</TableHead>
                  <TableHead>Sign</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {astroData.planets.map((planet) => (
                  <TableRow key={planet.name}>
                    <TableCell className="font-semibold">{planet.name}</TableCell>
                    <TableCell>{planet.sign}</TableCell>
                    <TableCell className="font-mono">{planet.degree?.toFixed(1)}°</TableCell>
                    <TableCell>{planet.house || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={planet.retrograde ? "text-warning border-warning" : "text-success border-success"}
                      >
                        {planet.retrograde ? 'Retrograde' : 'Direct'}
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
              {astroData.aspects.map((aspect, idx) => (
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
                      <p className="font-semibold text-foreground">{aspect.type}</p>
                      <p className="text-xs text-muted-foreground">{aspect.angle}°</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Progress value={Math.abs(aspect.influence * 100)} className="w-24 mb-1" />
                      <p className="text-xs text-muted-foreground">{Math.abs(aspect.influence * 100).toFixed(0)}% strength</p>
                    </div>
                    <Badge
                      variant={aspect.influence > 0 ? "default" : "destructive"}
                      className={aspect.influence > 0 ? "bg-success" : ""}
                    >
                      {aspect.influence > 0 ? 'Bullish' : 'Bearish'}
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
              <h3 className="text-xl font-bold text-foreground mb-4">Current Lunar Phase</h3>
              <div className="text-center p-6 bg-secondary/30 rounded-lg">
                <Moon className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <p className="text-2xl font-bold text-foreground mb-2">{astroData.lunarPhase.name}</p>
                <p className="text-lg text-muted-foreground mb-4">
                  {(astroData.lunarPhase.illumination * 100).toFixed(0)}% Illumination
                </p>
                <Badge variant="outline" className={astroData.lunarPhase.influence > 0 ? "text-success border-success" : "text-destructive border-destructive"}>
                  {astroData.lunarPhase.influence > 0 ? 'Bullish Influence' : 'Bearish Influence'}
                </Badge>
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Planetary Hours</h3>
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 text-primary" />
                <p className="text-xl font-bold text-foreground mb-1">
                  {astroData.planetaryHours.currentHour}
                </p>
                <p className="text-sm text-muted-foreground">Current Planetary Hour</p>
                <Badge variant="outline" className={astroData.planetaryHours.isFavorable ? "mt-3 text-success border-success" : "mt-3 text-warning border-warning"}>
                  {astroData.planetaryHours.isFavorable ? 'Favorable for Trading' : 'Caution Advised'}
                </Badge>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Time Cycles Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">Next Turn Date</p>
                <p className="text-lg font-bold text-foreground">
                  {timeCycles.nextTurnDate?.toLocaleDateString() || 'Calculating...'}
                </p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-xs text-muted-foreground mb-1">Dominant Cycle</p>
                <p className="text-lg font-bold text-foreground">{timeCycles.dominantCycle || 21} days</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-warning" />
                <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                <p className="text-lg font-bold text-foreground">{timeCycles.confidence?.toFixed(0) || 85}%</p>
              </div>
            </div>

            <div className="space-y-3">
              {timeCycles.activeCycles?.map((cycle, idx) => (
                <div key={cycle.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-semibold text-foreground">{cycle.name}</p>
                    <p className="text-xs text-muted-foreground">Phase: {cycle.phase}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={cycle.progress * 100} className="w-24" />
                    <span className="text-sm font-mono">{(cycle.progress * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )) || (
                <p className="text-center text-muted-foreground">Loading cycles...</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Astro;
