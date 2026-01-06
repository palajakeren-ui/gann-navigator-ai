import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Zap,
  BarChart3,
  Clock,
  Target,
} from "lucide-react";
import TradingInstrumentSelector from "@/components/TradingInstrumentSelector";
import useWebSocketPrice from "@/hooks/useWebSocketPrice";

const patterns = [
  { name: "Head and Shoulders", type: "Reversal", confidence: 85, direction: "bearish", timeframe: "4H" },
  { name: "Double Bottom", type: "Reversal", confidence: 78, direction: "bullish", timeframe: "1D" },
  { name: "Bull Flag", type: "Continuation", confidence: 72, direction: "bullish", timeframe: "1H" },
  { name: "Ascending Triangle", type: "Continuation", confidence: 68, direction: "bullish", timeframe: "4H" },
  { name: "Wedge Pattern", type: "Reversal", confidence: 65, direction: "bearish", timeframe: "1D" },
];

const harmonicPatterns = [
  { name: "Gartley", completion: 92, direction: "bullish", prz: "47,200 - 47,350" },
  { name: "Bat Pattern", completion: 78, direction: "bearish", prz: "48,500 - 48,650" },
  { name: "Butterfly", completion: 65, direction: "bullish", prz: "46,800 - 47,000" },
];

const candlePatterns = [
  { name: "Morning Star", timeframe: "4H", strength: "Strong", direction: "bullish" },
  { name: "Engulfing Bearish", timeframe: "1H", strength: "Moderate", direction: "bearish" },
  { name: "Doji", timeframe: "1D", strength: "Weak", direction: "neutral" },
  { name: "Hammer", timeframe: "4H", strength: "Strong", direction: "bullish" },
];

const PatternRecognition = () => {
  const { priceData, isConnected, isLive, toggleConnection } = useWebSocketPrice({
    symbol: 'BTCUSDT',
    enabled: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Pattern Recognition
          </h1>
          <p className="text-muted-foreground">AI-powered chart pattern detection and analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={isConnected ? "border-success text-success" : "border-destructive text-destructive"}>
            {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {isConnected ? "Live" : "Disconnected"}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <TradingInstrumentSelector compact />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs">Patterns Detected</span>
          </div>
          <p className="text-xl font-bold text-foreground">12</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Bullish</span>
          </div>
          <p className="text-xl font-bold text-success">7</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs">Bearish</span>
          </div>
          <p className="text-xl font-bold text-destructive">4</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs">Avg Accuracy</span>
          </div>
          <p className="text-xl font-bold text-foreground">78%</p>
        </Card>
      </div>

      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">Chart Patterns</TabsTrigger>
          <TabsTrigger value="harmonic">Harmonic</TabsTrigger>
          <TabsTrigger value="candle">Candlestick</TabsTrigger>
          <TabsTrigger value="wave">Elliott Wave</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((pattern, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{pattern.name}</h4>
                    <p className="text-xs text-muted-foreground">{pattern.type} Pattern</p>
                  </div>
                  <Badge variant={pattern.direction === "bullish" ? "default" : "destructive"}>
                    {pattern.direction === "bullish" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {pattern.direction}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pattern.timeframe}
                  </span>
                  <span className="font-medium">
                    Confidence: <span className={pattern.confidence >= 75 ? 'text-success' : pattern.confidence >= 60 ? 'text-accent' : 'text-muted-foreground'}>{pattern.confidence}%</span>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="harmonic" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {harmonicPatterns.map((pattern, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{pattern.name}</h4>
                  <Badge variant={pattern.direction === "bullish" ? "default" : "destructive"}>
                    {pattern.direction}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion:</span>
                    <span className="font-medium">{pattern.completion}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${pattern.completion}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PRZ:</span>
                    <span className="font-mono text-xs">${pattern.prz}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candle" className="mt-4 space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Candlestick Patterns</h3>
            <div className="space-y-3">
              {candlePatterns.map((pattern, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {pattern.direction === "bullish" ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : pattern.direction === "bearish" ? (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    ) : (
                      <Activity className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{pattern.name}</p>
                      <p className="text-xs text-muted-foreground">{pattern.timeframe}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={pattern.strength === "Strong" ? "border-success text-success" : pattern.strength === "Moderate" ? "border-accent text-accent" : ""}
                  >
                    {pattern.strength}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="wave" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Elliott Wave Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h4 className="font-medium mb-2">Current Wave Count</h4>
                  <p className="text-2xl font-bold text-primary">Wave 3 of 5</p>
                  <p className="text-sm text-muted-foreground mt-1">Impulse Wave (Bullish)</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h4 className="font-medium mb-2">Wave Targets</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wave 3 Target:</span>
                      <span className="font-mono text-success">$52,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wave 4 Retracement:</span>
                      <span className="font-mono text-destructive">$48,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wave 5 Target:</span>
                      <span className="font-mono text-accent">$58,000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/20 rounded-lg h-[250px] flex items-center justify-center border border-border">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Elliott Wave Visualization</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatternRecognition;
