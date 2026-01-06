import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Area, AreaChart } from "recharts";

// Generate mock DSP data
const generateDSPData = (length: number = 50) => {
  return Array.from({ length }, (_, i) => {
    const t = i / 10;
    return {
      time: i,
      mama: 50 + Math.sin(t) * 20 + Math.random() * 5,
      fama: 50 + Math.sin(t - 0.5) * 18 + Math.random() * 5,
      instantTrendline: 50 + Math.sin(t * 0.8) * 15,
      dominantCycle: 20 + Math.sin(t * 0.3) * 10,
      snr: 0.5 + Math.sin(t * 0.5) * 0.3,
      roofing: Math.sin(t * 1.2) * 30,
      fisher: Math.tanh(Math.sin(t) * 2),
      stochRsi: 50 + Math.sin(t * 1.5) * 40,
      adaptiveRsi: 50 + Math.sin(t * 0.7) * 35,
      decycler: Math.sin(t * 0.4) * 25,
      bandpass: Math.sin(t * 2) * 20,
      hilbertTransform: Math.cos(t) * 15,
    };
  });
};

const dspData = generateDSPData();

interface Indicator {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
}

const indicators: Indicator[] = [
  { name: "MAMA/FAMA", value: 0.85, signal: "bullish", confidence: 0.92 },
  { name: "Instant Trendline", value: 0.72, signal: "bullish", confidence: 0.88 },
  { name: "Dominant Cycle", value: 21.5, signal: "neutral", confidence: 0.75 },
  { name: "SNR (Signal/Noise)", value: 0.68, signal: "bullish", confidence: 0.82 },
  { name: "Roofing Filter", value: 0.55, signal: "neutral", confidence: 0.70 },
  { name: "Fisher Transform", value: 1.2, signal: "bullish", confidence: 0.85 },
  { name: "Stoch RSI", value: 65, signal: "bullish", confidence: 0.78 },
  { name: "Adaptive RSI", value: 58, signal: "neutral", confidence: 0.72 },
  { name: "Decycler", value: 0.42, signal: "bearish", confidence: 0.65 },
  { name: "Bandpass", value: 0.38, signal: "neutral", confidence: 0.60 },
  { name: "Hilbert Transform", value: 0.92, signal: "bullish", confidence: 0.88 },
];

const getSignalColor = (signal: string) => {
  switch (signal) {
    case 'bullish': return 'text-success border-success';
    case 'bearish': return 'text-destructive border-destructive';
    default: return 'text-muted-foreground border-muted';
  }
};

const getSignalIcon = (signal: string) => {
  switch (signal) {
    case 'bullish': return <TrendingUp className="w-3 h-3" />;
    case 'bearish': return <TrendingDown className="w-3 h-3" />;
    default: return <Activity className="w-3 h-3" />;
  }
};

const EhlersDSPPanel = () => {
  const compositeScore = indicators.reduce((acc, ind) => acc + (ind.signal === 'bullish' ? 1 : ind.signal === 'bearish' ? -1 : 0), 0) / indicators.length;
  
  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          <h2 className="text-lg md:text-xl font-bold text-foreground">Ehlers DSP Analysis</h2>
        </div>
        <Badge variant="outline" className={compositeScore > 0 ? 'text-success border-success' : compositeScore < 0 ? 'text-destructive border-destructive' : ''}>
          Score: {(compositeScore * 100).toFixed(0)}%
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="cycles" className="text-xs">Cycles</TabsTrigger>
          <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
          <TabsTrigger value="oscillators" className="text-xs">Oscillators</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Indicator List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {indicators.map((ind, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getSignalIcon(ind.signal)}
                    <span className="text-sm font-medium text-foreground">{ind.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">{ind.value.toFixed(2)}</span>
                    <Badge variant="outline" className={`text-xs ${getSignalColor(ind.signal)}`}>
                      {ind.signal}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* MAMA/FAMA Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dspData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="mama" stroke="hsl(var(--success))" strokeWidth={2} dot={false} name="MAMA" />
                  <Line type="monotone" dataKey="fama" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="FAMA" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cycles">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[250px]">
              <h4 className="text-sm font-medium text-foreground mb-2">Dominant Cycle</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dspData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="dominantCycle" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[250px]">
              <h4 className="text-sm font-medium text-foreground mb-2">Hilbert Transform</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dspData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="hilbertTransform" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="filters">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[250px]">
              <h4 className="text-sm font-medium text-foreground mb-2">Roofing Filter</h4>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dspData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="roofing" fill="hsl(var(--chart-2))" opacity={0.6} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[250px]">
              <h4 className="text-sm font-medium text-foreground mb-2">Bandpass Filter</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dspData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="bandpass" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="oscillators">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[250px]">
              <h4 className="text-sm font-medium text-foreground mb-2">Fisher Transform</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dspData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={[-2, 2]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="fisher" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[250px]">
              <h4 className="text-sm font-medium text-foreground mb-2">Adaptive RSI</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dspData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="adaptiveRsi" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EhlersDSPPanel;
