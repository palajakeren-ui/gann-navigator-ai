import { TradingChart } from "@/components/charts/TradingChart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, TrendingDown, Activity, Target, Layers, 
  ZoomIn, ZoomOut, Maximize2, Download, RefreshCw,
  ChevronDown, Settings, Eye
} from "lucide-react";
import { useState } from "react";

const timeframes = [
  { label: "1M", value: "M1" },
  { label: "5M", value: "M5" },
  { label: "15M", value: "M15" },
  { label: "30M", value: "M30" },
  { label: "1H", value: "H1" },
  { label: "4H", value: "H4" },
  { label: "1D", value: "D1" },
  { label: "1W", value: "W1" },
  { label: "1MO", value: "MN" },
];

const symbols = [
  { symbol: "BTCUSD", name: "Bitcoin", price: 104525, change: 2.34 },
  { symbol: "ETHUSD", name: "Ethereum", price: 3890, change: 1.56 },
  { symbol: "EURUSD", name: "Euro/USD", price: 1.0875, change: -0.12 },
  { symbol: "XAUUSD", name: "Gold", price: 2045.30, change: 0.45 },
  { symbol: "GBPUSD", name: "GBP/USD", price: 1.2654, change: 0.23 },
];

const overlays = [
  { name: "Gann Square of 9", key: "gannSquare", active: true },
  { name: "Gann Angles (1x1, 2x1)", key: "gannAngles", active: true },
  { name: "Gann Fan", key: "gannFan", active: false },
  { name: "Fibonacci Retracement", key: "fibonacci", active: true },
  { name: "Support/Resistance", key: "sr", active: true },
  { name: "Planetary Lines", key: "planetary", active: true },
  { name: "MAMA/FAMA", key: "mama", active: true },
  { name: "Fisher Transform", key: "fisher", active: false },
  { name: "Bollinger Bands", key: "bb", active: false },
  { name: "Volume Profile", key: "volume", active: true },
];

const gannLevels = [
  { type: "Resistance 3", price: 106200, strength: 75 },
  { type: "Resistance 2", price: 105500, strength: 85 },
  { type: "Resistance 1", price: 104800, strength: 92 },
  { type: "Current", price: 104525, strength: 100 },
  { type: "Support 1", price: 104100, strength: 88 },
  { type: "Support 2", price: 103500, strength: 82 },
  { type: "Support 3", price: 102800, strength: 70 },
];

const Charts = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("H4");
  const [activeSymbol, setActiveSymbol] = useState("BTCUSD");
  const [activeOverlays, setActiveOverlays] = useState<Record<string, boolean>>(
    overlays.reduce((acc, o) => ({ ...acc, [o.key]: o.active }), {})
  );

  const currentSymbol = symbols.find(s => s.symbol === activeSymbol) || symbols[0];

  const toggleOverlay = (key: string) => {
    setActiveOverlays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Advanced Charts</h1>
          <p className="text-muted-foreground">Multi-timeframe technical analysis with Gann overlays</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ZoomOut className="w-4 h-4 mr-1" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="w-4 h-4 mr-1" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Symbol & Timeframe Selector */}
      <Card className="p-4 glass-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select value={activeSymbol} onValueChange={setActiveSymbol}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                {symbols.map(s => (
                  <SelectItem key={s.symbol} value={s.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">{s.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">{s.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                ${currentSymbol.price.toLocaleString()}
              </p>
              <p className={`text-sm flex items-center gap-1 ${currentSymbol.change > 0 ? 'text-success' : 'text-destructive'}`}>
                {currentSymbol.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {currentSymbol.change > 0 ? '+' : ''}{currentSymbol.change}%
              </p>
            </div>
          </div>

          {/* Timeframe Tabs */}
          <div className="flex flex-wrap gap-1">
            {timeframes.map(tf => (
              <Button
                key={tf.value}
                variant={activeTimeframe === tf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTimeframe(tf.value)}
                className="min-w-[45px]"
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 space-y-4">
          <TradingChart />
          
          {/* Active Overlays */}
          <Card className="p-4 glass-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Active Overlays
              </h3>
              <Badge variant="outline">{Object.values(activeOverlays).filter(Boolean).length} active</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {overlays.map(overlay => (
                <Badge
                  key={overlay.key}
                  variant={activeOverlays[overlay.key] ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${activeOverlays[overlay.key] ? '' : 'opacity-50'}`}
                  onClick={() => toggleOverlay(overlay.key)}
                >
                  {overlay.name}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Gann Levels */}
          <Card className="p-4 glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Gann Levels
            </h3>
            <div className="space-y-2">
              {gannLevels.map((level, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center text-sm p-2 rounded ${
                    level.type === "Current"
                      ? "bg-primary/20 border border-primary/40"
                      : level.type.includes("Resistance")
                      ? "bg-destructive/10"
                      : "bg-success/10"
                  }`}
                >
                  <span className={`${
                    level.type === "Current"
                      ? "text-foreground font-bold"
                      : "text-muted-foreground"
                  }`}>
                    {level.type}
                  </span>
                  <span className={`font-mono ${
                    level.type === "Current"
                      ? "text-foreground font-bold"
                      : level.type.includes("Resistance")
                      ? "text-destructive"
                      : "text-success"
                  }`}>
                    {level.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Time Cycles */}
          <Card className="p-4 glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Time Cycles</h3>
            <div className="space-y-3">
              <div className="p-3 rounded bg-accent/10 border border-accent/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-foreground">Next Turn Date</span>
                  <Badge variant="outline" className="text-xs">High Prob</Badge>
                </div>
                <p className="text-lg font-bold text-accent">Dec 28, 2024</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mars Cycle</span>
                  <span className="text-foreground font-mono">18 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jupiter Cycle</span>
                  <span className="text-foreground font-mono">45 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gann 90°</span>
                  <span className="text-foreground font-mono">3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Square of 52</span>
                  <span className="text-foreground font-mono">12 days</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Signal Strength */}
          <Card className="p-4 glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Signal Strength</h3>
            <div className="space-y-4">
              {[
                { name: "Gann", value: 85, color: "bg-success" },
                { name: "Astro", value: 72, color: "bg-accent" },
                { name: "Ehlers", value: 78, color: "bg-primary" },
                { name: "ML", value: 88, color: "bg-chart-3" },
              ].map((signal) => (
                <div key={signal.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{signal.name}</span>
                    <span className="text-sm font-semibold text-foreground">{signal.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${signal.color}`} style={{ width: `${signal.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Overlay Settings */}
          <Card className="p-4 glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Overlay Settings
            </h3>
            <div className="space-y-3">
              {overlays.slice(0, 6).map(overlay => (
                <div key={overlay.key} className="flex items-center justify-between">
                  <Label htmlFor={overlay.key} className="text-sm text-muted-foreground">
                    {overlay.name}
                  </Label>
                  <Switch
                    id={overlay.key}
                    checked={activeOverlays[overlay.key]}
                    onCheckedChange={() => toggleOverlay(overlay.key)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Charts;
