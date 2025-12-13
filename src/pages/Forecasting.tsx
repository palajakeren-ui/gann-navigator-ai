import { ForecastPanel } from "@/components/ForecastPanel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Calendar, TrendingUp, TrendingDown, Target, Clock, RefreshCw, Download, Sparkles } from "lucide-react";
import { useState } from "react";

const forecastData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  actual: i < 15 ? 104000 + Math.sin(i / 3) * 1200 + Math.random() * 500 : null,
  forecast: 104000 + Math.sin(i / 3) * 1200 + Math.random() * 300,
  upper: 104000 + Math.sin(i / 3) * 1200 + 800 + Math.random() * 200,
  lower: 104000 + Math.sin(i / 3) * 1200 - 800 - Math.random() * 200,
}));

const dailyForecast = [
  { date: "2024-12-14", price: 104850, probability: 72, gannNote: "1x1 angle support", astroNote: "Moon trine Jupiter" },
  { date: "2024-12-15", price: 105200, probability: 68, gannNote: "Square of 9 confluence", astroNote: "Mercury direct" },
  { date: "2024-12-16", price: 104950, probability: 65, gannNote: "2x1 angle test", astroNote: "Neutral aspect" },
  { date: "2024-12-17", price: 105400, probability: 70, gannNote: "Breakout potential", astroNote: "Venus enters Capricorn" },
  { date: "2024-12-18", price: 105100, probability: 62, gannNote: "Consolidation zone", astroNote: "Sun square Neptune" },
  { date: "2024-12-19", price: 105650, probability: 75, gannNote: "Time cycle peak", astroNote: "Full Moon influence" },
  { date: "2024-12-20", price: 105300, probability: 68, gannNote: "Retracement expected", astroNote: "Mars aspects" },
];

const timeProjections = [
  { type: "ATH", label: "Short-Term High", date: "Dec 19, 2024 14:00 UTC", price: 105650, confidence: 82, gannNote: "Square of 52 + 1x2 confluence" },
  { type: "ATL", label: "Short-Term Low", date: "Dec 22, 2024 08:00 UTC", price: 104200, confidence: 75, gannNote: "90° rotation support" },
  { type: "ATH", label: "Medium-Term High", date: "Jan 12, 2025", price: 112000, confidence: 70, gannNote: "Fibonacci extension + Jupiter transit" },
  { type: "ATH", label: "Long-Term Target", date: "Q2 2025", price: 150000, confidence: 65, gannNote: "Full cycle completion" },
];

const gannCycles = [
  { cycle: "7 Day", nextTurn: "Dec 17, 2024", direction: "Up", confidence: 88 },
  { cycle: "21 Day", nextTurn: "Dec 26, 2024", direction: "Peak", confidence: 85 },
  { cycle: "30 Day", nextTurn: "Jan 5, 2025", direction: "Down", confidence: 78 },
  { cycle: "90 Day (Quarter)", nextTurn: "Feb 15, 2025", direction: "Up", confidence: 82 },
  { cycle: "180 Day (Semi)", nextTurn: "May 20, 2025", direction: "Peak", confidence: 75 },
  { cycle: "360 Day (Annual)", nextTurn: "Nov 15, 2025", direction: "Major", confidence: 70 },
];

const Forecasting = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeTimeframe, setActiveTimeframe] = useState("weekly");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Target className="w-8 h-8 text-accent" />
            Price Forecasting
          </h1>
          <p className="text-muted-foreground">Multi-model prediction with Gann geometry & planetary cycles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate Forecast
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 glass-card text-center animate-scale-in">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">24h Forecast</p>
          <p className="text-2xl font-bold text-success">$105,200</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">+0.65%</Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Next Turn Date</p>
          <p className="text-2xl font-bold text-foreground">Dec 19</p>
          <Badge variant="outline" className="mt-2">High Probability</Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Forecast Accuracy</p>
          <p className="text-2xl font-bold gradient-text">78.5%</p>
          <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20">Last 30 days</Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Cycle Phase</p>
          <p className="text-2xl font-bold text-warning">Topping</p>
          <Badge variant="outline" className="mt-2 bg-warning/10 text-warning border-warning/20">Near peak</Badge>
        </Card>
      </div>

      {/* Timeframe Selector */}
      <Card className="p-4 glass-card">
        <div className="flex flex-wrap gap-2">
          {["daily", "weekly", "monthly", "quarterly", "yearly"].map((tf) => (
            <Button
              key={tf}
              variant={activeTimeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTimeframe(tf)}
              className="capitalize"
            >
              {tf}
            </Button>
          ))}
        </div>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Forecast</TabsTrigger>
          <TabsTrigger value="cycles">Time Cycles</TabsTrigger>
          <TabsTrigger value="projections">ATH/ATL Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Price Forecast with Confidence Bands</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={['dataMin - 500', 'dataMax + 500']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.1} />
                <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-foreground" />
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-primary" style={{ borderStyle: 'dashed' }} />
                <span className="text-muted-foreground">Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-primary/20 rounded" />
                <span className="text-muted-foreground">Confidence Band</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ForecastPanel 
              shortTermForecast={dailyForecast.slice(0, 4).map(d => ({
                date: d.date,
                price: d.price,
                probability: d.probability,
                note: d.gannNote
              }))}
              athAtlEvents={timeProjections.slice(0, 2).map(t => ({
                date: t.date,
                type: t.type as "ATH" | "ATL",
                price: t.price,
                confidence: t.confidence,
                gannNote: t.gannNote
              }))}
            />

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Key Time Cycles</h3>
              <div className="space-y-3">
                {gannCycles.slice(0, 4).map((cycle, idx) => (
                  <div key={cycle.cycle} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-semibold text-foreground">{cycle.cycle}</p>
                      <p className="text-xs text-muted-foreground">Turn: {cycle.nextTurn}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline"
                        className={
                          cycle.direction === "Up" ? "text-success border-success" :
                          cycle.direction === "Down" ? "text-destructive border-destructive" :
                          "text-warning border-warning"
                        }
                      >
                        {cycle.direction}
                      </Badge>
                      <span className="text-sm font-mono">{cycle.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">7-Day Forecast</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Forecast Price</TableHead>
                  <TableHead className="text-center">Probability</TableHead>
                  <TableHead>Gann Note</TableHead>
                  <TableHead>Astro Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyForecast.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-mono">{day.date}</TableCell>
                    <TableCell className="text-right font-mono font-bold">${day.price.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={day.probability >= 70 ? "text-success border-success" : ""}>{day.probability}%</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{day.gannNote}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{day.astroNote}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Gann Time Cycles</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Next Turn Date</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead className="text-center">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gannCycles.map((cycle) => (
                  <TableRow key={cycle.cycle}>
                    <TableCell className="font-semibold">{cycle.cycle}</TableCell>
                    <TableCell className="font-mono">{cycle.nextTurn}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={cycle.direction === "Up" ? "default" : cycle.direction === "Down" ? "destructive" : "secondary"}
                        className={cycle.direction === "Up" ? "bg-success" : ""}
                      >
                        {cycle.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{cycle.confidence}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timeProjections.map((proj, idx) => (
              <Card 
                key={idx} 
                className={`p-6 glass-card border ${proj.type === "ATH" ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {proj.type === "ATH" ? (
                      <TrendingUp className="w-6 h-6 text-success" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-destructive" />
                    )}
                    <span className="font-semibold text-foreground">{proj.label}</span>
                  </div>
                  <Badge variant="outline" className={proj.type === "ATH" ? "text-success border-success" : "text-destructive border-destructive"}>
                    {proj.confidence}% Confidence
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Date: {proj.date}</p>
                  <p className={`text-3xl font-bold ${proj.type === "ATH" ? "text-success" : "text-destructive"}`}>
                    ${proj.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{proj.gannNote}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forecasting;
