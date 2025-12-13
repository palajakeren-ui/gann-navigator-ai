import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from "recharts";
import { Activity, TrendingUp, TrendingDown, Waves, Signal, RefreshCw, Settings } from "lucide-react";
import { useState } from "react";

// Generate mock data for charts
const cyclePeriodData = Array.from({ length: 100 }, (_, i) => ({
  bar: i + 1,
  period: 20 + Math.sin(i / 8) * 8 + Math.random() * 2,
  mama: 104000 + Math.sin(i / 12) * 1500 + Math.random() * 200,
  fama: 104000 + Math.sin(i / 12 - 0.8) * 1500 + Math.random() * 200,
  fisher: Math.sin(i / 6) * 1.5,
  cyber: Math.sin(i / 10) * 0.05,
  smoother: 104000 + Math.sin(i / 15) * 1200,
}));

const indicators = [
  { name: "Fisher Transform", value: "1.33", signal: "Bullish Cross", confidence: 93, trend: "up", description: "Price momentum indicator" },
  { name: "Smoothed RSI", value: "67.2", signal: "Bullish", confidence: 87, trend: "up", description: "Noise-reduced RSI" },
  { name: "Super Smoother", value: "+0.024", signal: "Trend Up", confidence: 85, trend: "up", description: "2-pole filter" },
  { name: "MAMA", value: "104,400", signal: "Bullish", confidence: 90, trend: "up", description: "MESA Adaptive MA" },
  { name: "FAMA", value: "104,350", signal: "Following", confidence: 88, trend: "up", description: "Following Adaptive MA" },
  { name: "Instantaneous Trendline", value: "104,100", signal: "Uptrend", confidence: 89, trend: "up", description: "Hilbert Transform" },
  { name: "Cyber Cycle", value: "+0.026", signal: "Rising", confidence: 86, trend: "up", description: "Cycle momentum" },
  { name: "Dominant Cycle", value: "24.0 days", signal: "Strong", confidence: 96, trend: "up", description: "Detected period" },
  { name: "Sinewave Indicator", value: "+0.021", signal: "Bullish Phase", confidence: 84, trend: "up", description: "Cycle phase" },
  { name: "Roofing Filter", value: "+0.017", signal: "Trend Mode", confidence: 80, trend: "up", description: "Highpass + Smoother" },
  { name: "Decycler", value: "+0.028", signal: "Bullish", confidence: 82, trend: "up", description: "Trend extraction" },
  { name: "Bandpass Filter", value: "0.85", signal: "Cycle Mode", confidence: 78, trend: "neutral", description: "Cycle isolation" },
];

const compositeScore = 0.88;

const Ehlers = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Activity className="w-8 h-8 text-accent" />
            Ehlers DSP
          </h1>
          <p className="text-muted-foreground">John F. Ehlers' Digital Signal Processing indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Composite Score */}
      <Card className="p-6 glass-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Composite Ehlers Score</h2>
            <p className="text-sm text-muted-foreground">Combined signal from all DSP indicators</p>
          </div>
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${compositeScore > 0.7 ? 'text-success border-success bg-success/10' : 'text-warning border-warning'}`}
          >
            {(compositeScore * 100).toFixed(0)}% Bullish
          </Badge>
        </div>
        <Progress value={compositeScore * 100} className="h-3" />
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: "Dominant Cycle", value: "24 bars", status: "Active", color: "text-primary" },
          { name: "MAMA Signal", value: "Buy", status: "Confirmed", color: "text-success" },
          { name: "Fisher Transform", value: "1.33", status: "Bullish Cross", color: "text-success" },
          { name: "Trend Mode", value: "Trending", status: "High Confidence", color: "text-accent" },
        ].map((item, idx) => (
          <Card key={item.name} className="p-6 glass-card animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-start justify-between mb-2">
              <Activity className={`w-5 h-5 ${item.color}`} />
              <Badge variant="secondary" className="text-xs">{item.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{item.name}</p>
            <p className="text-2xl font-bold gradient-text">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">All Indicators</TabsTrigger>
          <TabsTrigger value="mama">MAMA/FAMA</TabsTrigger>
          <TabsTrigger value="cycles">Cycle Analysis</TabsTrigger>
          <TabsTrigger value="filters">Digital Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Ehlers Indicators Overview</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indicator</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Signal</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indicators.map((ind) => (
                  <TableRow key={ind.name}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground">{ind.name}</p>
                        <p className="text-xs text-muted-foreground">{ind.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{ind.value}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-success border-success">
                        {ind.signal}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={ind.confidence} className="w-16" />
                        <span className="text-xs">{ind.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ind.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-success" />
                      ) : ind.trend === "down" ? (
                        <TrendingDown className="w-5 h-5 text-destructive" />
                      ) : (
                        <Activity className="w-5 h-5 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="mama" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">MAMA/FAMA Adaptive Moving Average</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={cyclePeriodData}>
                <defs>
                  <linearGradient id="mamaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="bar" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={['dataMin - 500', 'dataMax + 500']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="mama" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="MAMA" />
                <Line type="monotone" dataKey="fama" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" dot={false} name="FAMA" />
                <Line type="monotone" dataKey="smoother" stroke="hsl(var(--chart-3))" strokeWidth={1} dot={false} name="Super Smoother" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">MAMA Value</p>
                <p className="text-xl font-bold text-primary">104,400</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">FAMA Value</p>
                <p className="text-xl font-bold text-chart-2">104,350</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">Signal</p>
                <p className="text-xl font-bold text-success">BULLISH</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Dominant Cycle Period</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={cyclePeriodData}>
                  <defs>
                    <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="bar" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[10, 35]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="period" stroke="hsl(var(--chart-3))" fill="url(#cycleGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground mb-1">Detected Dominant Cycle</p>
                <p className="text-3xl font-bold text-primary">24.0 days</p>
                <p className="text-xs text-muted-foreground mt-1">96% confidence</p>
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Cyber Cycle Oscillator</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={cyclePeriodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="bar" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[-0.1, 0.1]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="cyber" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                  <Bar dataKey="cyber" fill="hsl(var(--accent))" opacity={0.3} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                  <p className="text-xl font-bold text-success">+0.026</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Signal</p>
                  <p className="text-xl font-bold text-accent">Rising</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Fisher Transform</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cyclePeriodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="bar" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[-2, 2]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="fisher" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))" 
                  fillOpacity={0.2}
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Super Smoother", value: "+0.024", desc: "2-pole Butterworth filter", status: "Trend Up" },
              { name: "Roofing Filter", value: "+0.017", desc: "Highpass + Super Smoother", status: "Trend Mode" },
              { name: "Decycler", value: "+0.028", desc: "Removes cycle component", status: "Bullish" },
              { name: "Bandpass Filter", value: "0.85", desc: "Isolates cycle component", status: "Cycle Mode" },
              { name: "Sinewave", value: "+0.021", desc: "Cycle phase indicator", status: "Bullish Phase" },
              { name: "Laguerre RSI", value: "0.72", desc: "Smoothed momentum", status: "Overbought Soon" },
            ].map((filter, idx) => (
              <Card key={filter.name} className="p-4 glass-card animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <Waves className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="text-success border-success text-xs">{filter.status}</Badge>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{filter.name}</h4>
                <p className="text-2xl font-bold gradient-text mb-2">{filter.value}</p>
                <p className="text-xs text-muted-foreground">{filter.desc}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ehlers;
